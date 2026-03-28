import asyncio
from dotenv import load_dotenv
import os
from services.llm_service import LLMService

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

async def main():
    service = LLMService(use_mock=False, api_key=api_key)
    print("Testing extract claims...")
    claims = await service.extract_claims("Virat Kohli is a cricketer.")
    print("Claims:", claims)
    print("Testing interrogation...")
    interrogations = await service.interrogate_claims_parallel(claims)
    print("Interrogations:", interrogations)
    print("Testing consistency...")
    verdict = await service.analyze_consistency(claims, interrogations)
    print("Verdict:", verdict)

asyncio.run(main())
