"""Test script for backend API"""
import asyncio
from services.llm_service import LLMService
from services.firebase_service import FirebaseService


async def test_detection_pipeline():
    """Test the complete detection pipeline"""
    print("\n🧪 Testing TruthLens Backend Detection Pipeline\n")

    # Initialize services
    llm_service = LLMService(use_mock=True)
    firebase_service = FirebaseService()

    # Test text with hallucinations
    test_text = "The 1912 Martian Meteorite was discovered in London by renowned astronomer Sir Arthur Conan Doyle. It was named the Victoria Stone after Queen Victoria."

    print("📝 Input Text:")
    print(f"  {test_text[:100]}...\n")

    # Step A: Extract claims
    print("🔍 Step A - Extracting Claims...")
    claims = await llm_service.extract_claims(test_text)
    print(f"  ✅ Found {len(claims)} claims:")
    for i, claim in enumerate(claims, 1):
        print(f"     {i}. {claim[:60]}...")

    # Step B: Parallel interrogation
    print("\n❓ Step B - Parallel Interrogation...")
    interrogations = await llm_service.interrogate_claims_parallel(claims)
    print(f"  ✅ Got {len(interrogations)} explanations")

    # Step C: Consistency verdict
    print("\n⚖️  Step C - Analyzing Consistency...")
    verdict = await llm_service.analyze_consistency(claims, interrogations)
    print(f"  ✅ Verdict: {verdict.status}")
    print(f"     Confidence: {verdict.confidence}%")
    print(f"     Consistency Score: {verdict.consistency_score}/100")
    print(f"     Reasoning: {verdict.reasoning[:80]}...")

    if verdict.suspicious_claims:
        print(f"\n⚠️  Suspicious Claims:")
        for claim in verdict.suspicious_claims:
            print(f"     - {claim[:60]}...")

    print("\n✅ Pipeline test complete!\n")


if __name__ == "__main__":
    asyncio.run(test_detection_pipeline())
