# backend/app/api/ask.py
from fastapi import APIRouter, HTTPException
from app.schemas.ask_schema import AskRequest, AskResponse
from app.services.llm_service import generate_cypher, generate_answer, decide_visualization_llm
from app.services.cypher_guard import validate_cypher
from app.services.neo4j_service import run_cypher
import json, re

router = APIRouter(prefix="/ask")

def extract_json(text: str):
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError("LLM did not return valid JSON")
    return json.loads(match.group())


@router.post("/", response_model=AskResponse)
def ask_question(payload: AskRequest):
    try:
        llm_output = generate_cypher(payload.question)
        parsed = extract_json(llm_output)

        cypher = parsed["cypher"]

        # Normalize name matching
        match = re.search(r"WHERE\s+d\.name\s*=\s*'([^']+)'", cypher)
        if match:
            value = match.group(1)
            cypher = re.sub(
                r"WHERE\s+d\.name\s*=\s*'[^']+'",
                f"WHERE toLower(d.name) CONTAINS toLower('{value}')",
                cypher
            )

        validate_cypher(cypher)

        if "LIMIT" not in cypher.upper() and "count(" not in cypher.lower():
            cypher += " LIMIT 10"

        data = run_cypher(cypher)

        # ✅ LLM decides visualization AFTER data
        viz_type = decide_visualization_llm(data)

        # 👉 LLM-based explanation (grounded)
        context = json.dumps(data, indent=2)
        explanation = generate_answer(context, payload.question)

        return {
            "type": viz_type,
            "cypher": cypher,
            "data": data,
            "explanation": explanation
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
