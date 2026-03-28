"""Pre-generated mock data for hackathon demo"""
from datetime import datetime
from models.schemas import VerdictSchema, ScanResult, SentenceVerdict
import random
import uuid

# Red verdict - hallucinated content (1912 Martian Meteorite)
RED_SCAN = {
    "scan_id": "demo-red-001",
    "user_id": "demo_user",
    "source_url": "http://localhost:3000/demo",
    "original_text": "The 1912 Martian Meteorite was discovered in London by renowned astronomer Sir Arthur Conan Doyle. It was named the Victoria Stone after Queen Victoria and is now housed in the British Museum's secret underground vault.",
    "claims": [
        "The 1912 Martian Meteorite was discovered in London",
        "Sir Arthur Conan Doyle discovered it",
        "It is named the Victoria Stone"
    ],
    "interrogations": {
        "The 1912 Martian Meteorite was discovered in London": "Meteorites from Mars are indeed studied, but the specific 1912 London discovery claim is unclear. Most prominent meteorites are discovered in Antarctica or deserts...",
        "Sir Arthur Conan Doyle discovered it": "Sir Arthur Conan Doyle was a fiction writer and spiritualist, not a meteorologist or astronomer who would discover meteorites...",
        "It is named the Victoria Stone": "While Victorian-era names are common for historical specimens, this specific name for a Martian meteorite cannot be verified in standard archaeological records..."
    },
    "verdict": VerdictSchema(
        status="Red",
        confidence=91,
        consistency_score=18,
        reasoning="The three explanations reveal contradictions: claims about a famous 1912 discovery are vague and unsupported by standard geological records. The attribution to fiction writer Conan Doyle is highly implausible.",
        suspicious_claims=["The 1912 Martian Meteorite was discovered in London", "Sir Arthur Conan Doyle discovered it"],
        sentence_verdicts=[
            SentenceVerdict(sentence="The 1912 Martian Meteorite was discovered in London by renowned astronomer Sir Arthur Conan Doyle.", verdict="Red", confidence=95),
            SentenceVerdict(sentence="It was named the Victoria Stone after Queen Victoria and is now housed in the British Museum's secret underground vault.", verdict="Red", confidence=88)
        ]
    ),
    "user_feedback": None,
    "created_at": datetime.now(),
    "processing_time_ms": 3870
}

# Yellow verdict - mixed claims
YELLOW_SCAN = {
    "scan_id": "demo-yellow-001",
    "user_id": "demo_user",
    "source_url": "http://localhost:3000/demo",
    "original_text": "Carbon dioxide was discovered in 1754 by Scottish chemist Joseph Black. It plays a vital role in photosynthesis and is also used in carbonated beverages. Some scientists estimate it comprises about 0.5% of Earth's atmosphere.",
    "claims": [
        "Carbon dioxide was discovered in 1754 by Joseph Black",
        "It plays a vital role in photosynthesis",
        "It comprises about 0.5% of Earth's atmosphere"
    ],
    "interrogations": {
        "Carbon dioxide was discovered in 1754 by Joseph Black": "Yes, Joseph Black, a Scottish chemist, is credited with discovering CO2 in 1754. He called it 'fixed air' and documented its properties...",
        "It plays a vital role in photosynthesis": "Carbon dioxide is essential for photosynthesis - plants absorb CO2 and convert it into glucose using sunlight...",
        "It comprises about 0.5% of Earth's atmosphere": "This is slightly inaccurate. CO2 makes up approximately 0.04% of Earth's atmosphere, not 0.5%..."
    },
    "verdict": VerdictSchema(
        status="Yellow",
        confidence=62,
        consistency_score=58,
        reasoning="Most facts check out, but one claim contains a significant numerical error (0.5% vs 0.04%). The first two explanations are solid, but the third shows uncertainty about precise atmospheric composition.",
        suspicious_claims=["It comprises about 0.5% of Earth's atmosphere"],
        sentence_verdicts=[
            SentenceVerdict(sentence="Carbon dioxide was discovered in 1754 by Scottish chemist Joseph Black.", verdict="Green", confidence=95),
            SentenceVerdict(sentence="It plays a vital role in photosynthesis and is also used in carbonated beverages.", verdict="Green", confidence=98),
            SentenceVerdict(sentence="Some scientists estimate it comprises about 0.5% of Earth's atmosphere.", verdict="Yellow", confidence=70)
        ]
    ),
    "user_feedback": None,
    "created_at": datetime.now(),
    "processing_time_ms": 3420
}

# Green verdict - factual content
GREEN_SCAN = {
    "scan_id": "demo-green-001",
    "user_id": "demo_user",
    "source_url": "https://en.wikipedia.org/wiki/Water",
    "original_text": "Water is a transparent, colorless chemical substance that is the main constituent of Earth's hydrosphere. It exists in solid, liquid, and gaseous forms. The chemical formula of water is H2O.",
    "claims": [
        "Water is a transparent, colorless chemical substance",
        "It is the main constituent of Earth's hydrosphere",
        "The chemical formula of water is H2O"
    ],
    "interrogations": {
        "Water is a transparent, colorless chemical substance": "Water is indeed transparent and colorless in its pure form, though it can appear blue when in large quantities due to selective absorption of red wavelengths...",
        "It is the main constituent of Earth's hydrosphere": "Yes, water makes up approximately 96.5% of Earth's hydrosphere, which includes all oceans, ice caps, and freshwater...",
        "The chemical formula of water is H2O": "Correct. Water consists of two hydrogen atoms and one oxygen atom, bonded covalently to form the H2O molecule..."
    },
    "verdict": VerdictSchema(
        status="Green",
        confidence=98,
        consistency_score=95,
        reasoning="All three explanations are internally consistent and well-supported by scientific evidence. Claims are specific, substantiated, and free of contradictions.",
        suspicious_claims=[],
        sentence_verdicts=[
            SentenceVerdict(sentence="Water is a transparent, colorless chemical substance that is the main constituent of Earth's hydrosphere.", verdict="Green", confidence=99),
            SentenceVerdict(sentence="It exists in solid, liquid, and gaseous forms.", verdict="Green", confidence=99),
            SentenceVerdict(sentence="The chemical formula of water is H2O.", verdict="Green", confidence=99)
        ]
    ),
    "user_feedback": None,
    "created_at": datetime.now(),
    "processing_time_ms": 3120
}


def get_mock_scan(verdict_status: str = None, text: str = None) -> dict:
    """Return a mock scan result based on verdict status"""
    import random
    import copy
    
    if not verdict_status and text:
        text_lower = text.lower()
        # Known factual content → Green
        if "virat kohli" in text_lower or "water is" in text_lower or "h2o" in text_lower or "photosynthesis" in text_lower:
            verdict_status = "Green"
        # Known hallucinated content → Red
        elif "meteorite" in text_lower or "alien" in text_lower or "1912" in text_lower or "secret underground" in text_lower or "conan doyle" in text_lower:
            verdict_status = "Red"
        # Known mixed content → Yellow
        elif "0.5%" in text_lower:
            verdict_status = "Yellow"
        else:
            # Default to Yellow (uncertain) — we can't verify unknown text in mock mode
            verdict_status = "Yellow"
            
    if verdict_status == "Red":
        result = copy.deepcopy(RED_SCAN)
    elif verdict_status == "Yellow":
        result = copy.deepcopy(YELLOW_SCAN)
    elif verdict_status == "Green":
        result = copy.deepcopy(GREEN_SCAN)
    else:
        # Return random fallback
        result = copy.deepcopy(random.choice([RED_SCAN, YELLOW_SCAN, GREEN_SCAN]))

    if text and len(text.strip()) > 10:
        sentences = [s.strip() + '.' for s in text.split('.') if len(s.strip()) > 10]
        if not sentences:
            sentences = [text[:100] + '...']
            
        result["original_text"] = text
        result["claims"] = sentences[:3]
        
        status = result["verdict"].status
        if status == "Green":
            interrogation_text = "Verified as factual based on reliable standard historical records."
            reasoning = f"Analysis complete. The {len(sentences[:3])} claims correspond accurately with established facts."
        elif status == "Red":
            interrogation_text = "This claim cannot be corroborated and directly conflicts with known data."
            reasoning = f"Analysis complete. Evaluated {len(sentences[:3])} claims. Highly suspicious anomalies detected."
        else:
            interrogation_text = "Partially verified, some elements appear accurate while others lack citations."
            reasoning = f"Analysis complete. Evaluated {len(sentences[:3])} primary claims. Confidence is mixed based on standard references."

        result["interrogations"] = {
            s: f"Analysis of claim: '{s}'. {interrogation_text}" for s in sentences[:3]
        }
        
        from models.schemas import SentenceVerdict
        result["verdict"].reasoning = reasoning
        
        svs = []
        for s in sentences[:3]:
            svs.append(SentenceVerdict(sentence=s, verdict=status, confidence=random.randint(60, 95)))
            
        result["verdict"].sentence_verdicts = svs
        if status != "Green":
            result["verdict"].suspicious_claims = sentences[:2]
        else:
            result["verdict"].suspicious_claims = []

    # Convert VerdictSchema to dict
    if hasattr(result['verdict'], 'model_dump'):
        result['verdict'] = result['verdict'].model_dump()
    elif hasattr(result['verdict'], 'dict'):
        result['verdict'] = result['verdict'].dict()

    return result


def get_all_mock_scans() -> list:
    """Return all mock scans"""
    return [RED_SCAN, YELLOW_SCAN, GREEN_SCAN]
