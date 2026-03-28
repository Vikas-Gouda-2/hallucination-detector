"""LLM service for hallucination detection using Gemini Pro"""
import json
import asyncio
import os
import re
import httpx
from typing import List, Dict, Tuple
from models.schemas import VerdictSchema, SentenceVerdict

# ─────────────────────────────────────────────────────────
# Built-in fact-check database (used when LLM is unavailable)
# ─────────────────────────────────────────────────────────
FALSE_CLAIMS_DB = [
    # Astronomy
    (r"sun\s+(revolves?|orbits?|goes?|moves?)\s+(around|round)\s+(the\s+)?earth", "The Earth revolves around the Sun, not the other way around."),
    (r"earth\s+is\s+flat", "The Earth is an oblate spheroid, not flat."),
    (r"moon\s+(emits?|generates?|produces?|makes?|creates?)\s+(its?\s+own\s+)?light", "The Moon reflects sunlight; it does not emit its own light."),
    (r"pluto\s+is\s+a\s+planet", "Pluto was reclassified as a dwarf planet by the IAU in 2006."),

    # Biology / Human body
    (r"humans?\s+(can|are\s+able\s+to)\s+breathe?\s+in\s+space", "Humans cannot breathe in space — there is no breathable atmosphere."),
    (r"humans?\s+use\s+only\s+10\s*%", "Humans use all parts of their brain, not just 10%."),
    (r"blood\s+is\s+blue", "Blood is always red; deoxygenated blood is dark red, not blue."),
    (r"great\s+wall.*visible.*space", "The Great Wall of China is not visible from space with the naked eye."),
    (r"goldfish.*memory.*(3|three)\s*second", "Goldfish have a memory span of months, not 3 seconds."),

    # Physics / Chemistry
    (r"water\s+boils?\s+at\s+(50|60|30|40|20)\s*(degrees?|°)?\s*(c|celsius|centigrade)", "Water boils at 100°C (212°F) at sea level, not at the temperature stated."),
    (r"water\s+freezes?\s+at\s+(-?\d+)\s*(degrees?|°)?\s*(c|celsius)", "check_water_freeze"),  # Special handler
    (r"lightning\s+never\s+strikes?\s+(the\s+)?same\s+place", "Lightning frequently strikes the same place, especially tall structures."),
    (r"diamond.*hardest.*universe", "Diamond is the hardest natural mineral but not the hardest substance in the universe."),

    # History
    (r"columbus.*discover.*america", "Columbus did not discover America; indigenous peoples lived there for thousands of years."),
    (r"napoleon.*short", "Napoleon was about 5'7\", average height for his era."),
    (r"einstein.*failed?\s+math", "Einstein excelled at mathematics from a young age."),

    # Technology / AI
    (r"artificial\s+intelligence.*replace\s+all\s+human\s+jobs", "AI is expected to automate some tasks but also create new jobs; the 'all human jobs' claim is considered an exaggeration or half-truth."),
    (r"python\s+is\s+(the\s+)?fastest\s+programming\s+language", "Python is an interpreted language and is generally slower in execution speed compared to compiled languages like C, C++, or Rust."),
    (r"react\s+is\s+used\s+to\s+build\s+websites", "True, but React is a frontend library for building user interfaces, not a complete website builder by itself."),
    (r"blockchain\s+is\s+completely\s+anonymous", "Blockchain is pseudonymous; transactions are recorded on a public ledger and can often be traced to real identities."),

    # Common myths
    (r"sugar\s+(causes?|makes?)\s+(children\s+)?hyper", "Studies show sugar does not cause hyperactivity in children."),
    (r"cracking.*knuckles.*arthritis", "Cracking knuckles does not cause arthritis."),
    (r"swallowed?\s+gum.*(7|seven)\s*years?\s+to\s+digest", "Swallowed gum passes through the digestive system in days, not 7 years."),
    (r"tongue.*taste.*map", "The tongue map theory is a myth; all taste receptors are distributed throughout the tongue."),
    (r"sharks?\s+(don.t|do\s+not|never)\s+get\s+cancer", "Sharks can and do get cancer."),
    (r"bats?\s+(are|is)\s+blind", "Bats are not blind; they can see and also use echolocation."),
    (r"ostriches?\s+bury\s+(their\s+)?head", "Ostriches do not bury their heads in sand."),
]

TRUE_CLAIMS_DB = [
    r"earth\s+(revolves?|orbits?)\s+(around|round)\s+(the\s+)?sun",
    r"water\s+boils?\s+at\s+100\s*°?\s*(c|celsius)",
    r"water\s+freezes?\s+at\s+0\s*°?\s*(c|celsius)",
    r"water\s+is\s+(a\s+)?(transparent|colorless|liquid)",
    r"h2o",
    r"photosynthesis",
    r"dna\s+(stands?\s+for|is\s+deoxyribonucleic)",
    r"speed\s+of\s+light\s+(is\s+)?(approximately?\s+)?3\s*×?\s*10\s*\^?\s*8",
    r"earth\s+is\s+(an?\s+)?(oblate\s+)?spheroid",
    r"gravity\s+(is\s+)?9\.8",
]


def check_claim_against_db(claim: str) -> tuple:
    """Check a single claim against the false/true databases.
    Returns: (is_false: bool, is_true: bool, explanation: str)
    """
    claim_lower = claim.lower().strip()

    for pattern, explanation in FALSE_CLAIMS_DB:
        if re.search(pattern, claim_lower):
            return True, False, explanation

    for pattern in TRUE_CLAIMS_DB:
        if re.search(pattern, claim_lower):
            return False, True, "This claim is consistent with established scientific knowledge."

    return False, False, "Unable to verify this claim against known facts."


def map_nli_result(nli_classification: str) -> tuple:
    """Map NLI model classification to verdict components.
    
    NLI Classification Mapping:
    - Entailment → (is_false=False, is_true=True) → Green (Verified)
    - Neutral → (is_false=False, is_true=False) → Yellow (Uncertain)
    - Contradiction → (is_false=True, is_true=False) → Red (Hallucinated)
    
    Args:
        nli_classification: One of "Entailment", "Neutral", or "Contradiction"
    
    Returns:
        Tuple of (is_false: bool, is_true: bool, explanation: str)
    """
    nli_lower = nli_classification.lower().strip()
    
    if nli_lower == "entailment":
        return False, True, "NLI model confirmed: Entailment detected (supported by evidence)."
    elif nli_lower == "neutral":
        return False, False, "NLI model result: Neutral classification (insufficient evidence to verify or contradict)."
    elif nli_lower == "contradiction":
        return True, False, "NLI model flagged: Contradiction detected (contradicts established facts)."
    else:
        # Default fallback for unrecognized classifications
        return False, False, f"Unknown NLI classification: {nli_classification}. Treating as neutral."


def analyze_text_offline(text: str) -> Tuple[List[str], Dict[str, str], VerdictSchema]:
    """Analyze text using the built-in fact-check database (no LLM needed)."""
    # Step 1: Extract sentences as claims
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if len(s.strip()) > 10]
    claims = sentences[:5]

    if not claims:
        return [], {}, VerdictSchema(
            status="Yellow", confidence=50, consistency_score=50,
            reasoning="No verifiable claims found.", suspicious_claims=[], sentence_verdicts=[]
        )

    # Step 2: Check each claim
    interrogations = {}
    sentence_verdicts = []
    false_count = 0
    true_count = 0
    uncertain_count = 0
    suspicious = []

    for claim in claims:
        is_false, is_true, explanation = check_claim_against_db(claim)
        interrogations[claim] = explanation

        if is_false:
            false_count += 1
            suspicious.append(claim)
            sentence_verdicts.append(SentenceVerdict(sentence=claim, verdict="Red", confidence=92))
        elif is_true:
            true_count += 1
            sentence_verdicts.append(SentenceVerdict(sentence=claim, verdict="Green", confidence=90))
        else:
            uncertain_count += 1
            sentence_verdicts.append(SentenceVerdict(sentence=claim, verdict="Yellow", confidence=40))

    total = len(claims)

    # Step 3: Produce verdict
    if false_count > 0 and true_count == 0:
        status = "Red"
        confidence = 85 + min(10, false_count * 3)
        consistency_score = max(5, 20 - false_count * 5)
        reasoning = f"Detected {false_count} factually incorrect or significantly misleading claim(s). These statements contradict established facts and common consensus."
    elif false_count > 0 and true_count > 0:
        status = "Yellow"
        confidence = 70
        consistency_score = 40
        reasoning = f"Mixed content: {true_count} verifiable fact(s) detected, but {false_count} statement(s) were flagged as inaccurate or oversimplified half-truths."
    elif false_count == 0:
        status = "Green"
        confidence = 80
        consistency_score = 80
        reasoning = "No verifiably false claims detected. The statements appear generally consistent or benign."
    else:
        status = "Yellow"
        confidence = 45
        consistency_score = 50
        reasoning = "Unable to independently verify these specific claims. The content contains assertions that require more detailed domain expertise."

    verdict = VerdictSchema(
        status=status,
        confidence=confidence,
        consistency_score=consistency_score,
        reasoning=reasoning,
        suspicious_claims=suspicious,
        sentence_verdicts=sentence_verdicts
    )

    return claims, interrogations, verdict


class LLMService:
    def __init__(self, use_mock: bool = True, api_key: str = None):
        self.use_mock = use_mock
        self.api_key = api_key

        if not use_mock and not api_key:
            print("Warning: No Gemini API key provided, falling back to mock data")
            self.use_mock = True

    async def _call_gemini(self, prompt: str) -> str:
        """Helper to call Gemini API via HTTP"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.1}
        }

        async with httpx.AsyncClient() as client:
            for attempt in range(3):
                response = await client.post(url, headers=headers, json=payload, timeout=40.0)
                if response.status_code == 429:
                    print(f"Rate limited (429). Retrying in {2 ** attempt} seconds...")
                    await asyncio.sleep(2 ** attempt)
                    continue
                response.raise_for_status()
                data = response.json()

                try:
                    return data["candidates"][0]["content"]["parts"][0]["text"]
                except (KeyError, IndexError) as e:
                    print(f"Failed to parse Gemini response: {data}")
                    raise e
            raise Exception("Gemini API Rate Limit Exceeded after 3 attempts")
            
            raise Exception("Failed after 3 attempts due to rate limits.")

    async def extract_claims(self, text: str) -> List[str]:
        """Step A: Extract 3 distinct factual claims from text"""
        if self.use_mock:
            return await self._extract_claims_mock(text)

        try:
            prompt = f"""Extract exactly 1 to 3 distinct, specific factual claims from the following text.
Return ONLY a valid JSON array of strings: ["claim1", "claim2"]. No markdown formatting, no explanations.
Text: {text}"""

            response_text = await self._call_gemini(prompt)
            # cleanup potential markdown
            response_text = response_text.replace("```json", "").replace("```", "").strip()
            claims = json.loads(response_text)
            return claims[:3] if len(claims) > 3 else claims
        except Exception as e:
            print(f"Error extracting claims: {e}, falling back to offline analysis")
            return await self._extract_claims_mock(text)

    async def _extract_claims_mock(self, text: str) -> List[str]:
        sentences = [s.strip() for s in re.split(r'[.!?]+', text) if len(s.strip()) > 10]
        return sentences[:3]

    async def interrogate_claim(self, claim: str) -> str:
        """Interrogate a single claim"""
        if self.use_mock:
            return await self._interrogate_claim_mock(claim)

        try:
            prompt = f"""You are a strict and objective fact-checker. Analyze the following claim and determine its veracity based on established facts.

Claim: "{claim}"

CLASSIFICATION RULES:
- Start your response with exactly one of these labels: "TRUE:", "FALSE:", "HALF-TRUTH:", or "UNCERTAIN:".
- TRUE: The claim is factually correct, widely accepted, and not misleading. Even simple general facts should be TRUE.
- FALSE: The claim contains false information, impossible physics, or completely wrong facts.
- HALF-TRUTH: The claim is partially true but lacks critical context, is oversimplified, or exaggerated.
- UNCERTAIN: The claim is subjective, a prediction, or factually unverifiable.

After the classification keyword, concisely explain your reasoning in 2-3 sentences."""

            return await self._call_gemini(prompt)
        except Exception as e:
            print(f"Error interrogating claim: {e}")
            return await self._interrogate_claim_mock(claim)

    async def _interrogate_claim_mock(self, claim: str) -> str:
        is_false, is_true, explanation = check_claim_against_db(claim)
        if is_false:
            return f"This claim is FALSE. {explanation}"
        elif is_true:
            return f"This claim is TRUE. {explanation}"
        else:
            return f"Unable to fully verify: The claim '{claim}' could not be independently corroborated. Further evidence is needed to confirm or deny this assertion."

    async def interrogate_claims_parallel(self, claims: List[str]) -> Dict[str, str]:
        """Step B: Interrogation of claims (Sequential to avoid 429 Rate Limits)"""
        if not claims:
            return {}
        
        explanations = []
        for claim in claims:
            explanation = await self.interrogate_claim(claim)
            explanations.append(explanation)
            await asyncio.sleep(3)  # Strict Free tier rate limit prevention (2 RPS or 15 RPM)
            
        return {claim: explanation for claim, explanation in zip(claims, explanations)}

    async def analyze_consistency(self, claims: List[str], interrogations: Dict[str, str]) -> VerdictSchema:
        """Step C: Analyze consistency across explanations"""
        if self.use_mock:
            return await self._analyze_consistency_mock(claims, interrogations)

        try:
            explanations_text = ""
            for i, claim in enumerate(claims):
                explanations_text += f"\nClaim {i+1}: {claim} \nExplanation: {interrogations.get(claim, 'N/A')}\n"

            if not claims:
                explanations_text = "No claims detected."

            prompt = f"""You are a strict fact-checking auditor. Based on the following claims and their fact-check explanations, produce a final verdict.

{explanations_text}

IMPORTANT RULES FOR STATUS:
1. "Red" (False/Hallucination): Use this IF AND ONLY IF at least one claim is specifically marked "FALSE:" or is definitively incorrect. An UNCERTAIN claim should NOT trigger a Red status unless there is also a blatantly false claim.
2. "Yellow" (Mixed/Uncertain): Use this IF AND ONLY IF there are NO "FALSE:" claims, BUT at least one claim is marked "HALF-TRUTH:" or "UNCERTAIN:". Do not assign Yellow to statements that are simply True.
3. "Green" (True/Verified): Use this IF AND ONLY IF ALL claims are marked as "TRUE:" and are factually accurate. Fully accurate facts MUST ALWAYS be categorized as Green.

Return ONLY valid JSON (no markdown, no extra text) with this EXACT structure:
{{
  "status": "Green",
  "confidence": 95,
  "reasoning": "Brief explanation",
  "suspicious_claims": ["list of false claims"],
  "consistency_score": 85,
  "sentence_verdicts": [
    {{
      "sentence": "Exact claim text",
      "verdict": "Green",
      "confidence": 95
    }}
  ]
}}
Note: "status" and "verdict" must be exactly "Green" (True/Verified), "Yellow" (Mixed/Uncertain), or "Red" (False/Hallucination). Ensure individual sentence verdicts exactly match their individual "TRUE/FALSE/HALF-TRUTH/UNCERTAIN" labels (TRUE=Green, FALSE=Red, HALF-TRUTH/UNCERTAIN=Yellow)."""

            response_text = await self._call_gemini(prompt)
            # cleanup potential markdown
            response_text = response_text.replace("```json", "").replace("```", "").strip()
            verdict_data = json.loads(response_text)
            return VerdictSchema(**verdict_data)
        except Exception as e:
            print(f"Error analyzing consistency: {e}, falling back to offline analysis")
            return await self._analyze_consistency_mock(claims, interrogations)

    async def _analyze_consistency_mock(self, claims: List[str], interrogations: Dict[str, str]) -> VerdictSchema:
        """Offline consistency analysis using built-in fact-check database"""
        if not claims:
            return VerdictSchema(status="Yellow", confidence=50, consistency_score=50, reasoning="No verifiable claims detected.", suspicious_claims=[], sentence_verdicts=[])

        # Check each claim individually
        false_count = 0
        true_count = 0
        suspicious = []
        sentence_verdicts = []

        for claim in claims:
            is_false, is_true, explanation = check_claim_against_db(claim)
            if is_false:
                false_count += 1
                suspicious.append(claim)
                sentence_verdicts.append(SentenceVerdict(sentence=claim, verdict="Red", confidence=92))
            elif is_true:
                true_count += 1
                sentence_verdicts.append(SentenceVerdict(sentence=claim, verdict="Green", confidence=90))
            else:
                sentence_verdicts.append(SentenceVerdict(sentence=claim, verdict="Yellow", confidence=40))

        if false_count > 0 and true_count == 0:
            status = "Red"
            confidence = 85 + min(10, false_count * 3)
            consistency_score = max(5, 20 - false_count * 5)
            reasoning = f"Detected {false_count} factually incorrect claim(s). These statements contradict well-established scientific knowledge."
        elif false_count > 0 and true_count > 0:
            status = "Yellow"
            confidence = 70
            consistency_score = 40
            reasoning = f"Mixed content: {true_count} verifiable fact(s), but {false_count} statement(s) flagged as inaccurate."
        elif false_count == 0:
            status = "Green"
            confidence = 80
            consistency_score = 80
            reasoning = "No verifiably false claims detected. The statements appear generally consistent or benign."
        else:
            status = "Yellow"
            confidence = 45
            consistency_score = 50
            reasoning = "Unable to independently verify these claims. They may or may not be accurate."

        return VerdictSchema(
            status=status, confidence=confidence, consistency_score=consistency_score,
            reasoning=reasoning, suspicious_claims=suspicious, sentence_verdicts=sentence_verdicts
        )

    async def analyze_text(self, text: str) -> Tuple[List[str], Dict[str, str], VerdictSchema]:
        """Main analysis pipeline: Extract → Interrogate → Verify"""
        # If mock mode or LLM is unavailable, use offline analysis
        if self.use_mock:
            claims, interrogations, verdict = analyze_text_offline(text)
            return claims, interrogations, verdict

        claims = await self.extract_claims(text)
        interrogations = await self.interrogate_claims_parallel(claims)
        verdict = await self.analyze_consistency(claims, interrogations)
        return claims, interrogations, verdict
