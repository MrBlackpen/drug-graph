# backend/app/services/llm_service.py
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json, re
 
# Load environment variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("❌ GEMINI_API_KEY not found in environment")

genai.configure(api_key=GEMINI_API_KEY)
g_model = genai.GenerativeModel("gemini-2.5-flash")

ALLOWED_VIZ = {"table", "kpi", "graph", "bar", "pie", "none"}

SYSTEM_PROMPT = """
You are a READ-ONLY Cypher query generator for a Neo4j medical knowledge graph.

IMPORTANT:
- You MUST generate Cypher that matches the schema exactly.
- You MUST NOT use properties that are not listed below.
- NEVER invent properties like category, severity, frequency, class, or type.
- Use ONLY the relationships provided.
- All name matching MUST be case-insensitive using CONTAINS.

──────────────────
GRAPH SCHEMA
──────────────────

Nodes and properties:

(:Drug)
- name (string)
- rxcui (string)
- rxcui_int (integer)
- tty (string)

(:Disease)
- name (string)
- mesh_id (string)

(:Symptom)
- name (string)

(:Ingredient)
- name (string)
- rxcui (string)
- rxcui_int (integer)

(:DoseForm)
- name (string)
- rxcui (string)

Relationships:

(:Drug)-[:TREATS]->(:Disease)
(:Drug)-[:CAUSES]->(:Symptom)
(:Drug)-[:HAS_INGREDIENT]->(:Ingredient)
(:Drug)-[:HAS_DOSE_FORM]->(:DoseForm)

Rules:
- Use only MATCH, WHERE, RETURN only
- No CREATE, DELETE, MERGE, SET
- Use case-insensitive CONTAINS for name matching
- Do NOT infer data that does not exist
- If a request asks for more items than exist, return available results only
- Return JSON only
- Always use:
  toLower(node.name) CONTAINS toLower('value')
- Use DISTINCT when counting entities
- If aggregation is used, alias results as:
  - name
  - value
- If the result is a single number, return ONE row
- Always add LIMIT 10 unless counting

When matching names, always use:
toLower(node.name) CONTAINS toLower('value')
Never use exact equality for names.

Return STRICT JSON:
{
  "cypher": "..."
}
"""



def generate_cypher(question: str) -> str:
    prompt = f"""{SYSTEM_PROMPT}

User Question: {question}
Return only the strict JSON object as specified above."""

    try:
        response = g_model.generate_content(
            prompt,
            generation_config={"temperature": 0},
        )
        return (response.text or "").strip()
    except Exception as e:
        print(f"Error generating response: {e}")
        return "I apologize, but I encountered an error while generating a Cypher."



def generate_answer(context: str, question: str) -> str:
    prompt = f"""
You are answering questions based ONLY on the provided context
from a Neo4j medical knowledge graph.

──────────────────
GRAPH INTERPRETATION RULES
──────────────────

Nodes:
- Drug       → medication or formulation
- Disease    → medical condition
- Symptom    → side effect or adverse event
- Ingredient → active ingredient
- DoseForm   → dosage form

Relationships:
- Drug TREATS Disease      → disease treated by the drug
- Drug CAUSES Symptom     → symptom IS a side effect of the drug
- Drug HAS_INGREDIENT Ingredient → ingredient contained in the drug
- Drug HAS_DOSE_FORM DoseForm    → formulation of the drug

──────────────────
RESULT INTERPRETATION RULES
──────────────────

The query results are ALREADY filtered and correct.

If results contain:
- name + value AND the Cypher used COUNT →  
  value represents the COUNT of related entities

Specifically:
- If CAUSES → value = number of side effects
- If TREATS → value = number of diseases treated
- If HAS_INGREDIENT → value = number of ingredients
- If HAS_DOSE_FORM → value = number of dose forms

If multiple rows exist:
- Describe them as distributions or comparisons
- Mention highest / lowest when appropriate

If a single numeric row exists:
- Answer directly with the number

⚠️ NEVER say:
- "No results were found"
- "Context does not contain information"

IF rows exist in the context.

──────────────────
Context:
{context}

User Question:
{question}

Provide a clear, direct, grounded answer using ONLY the context.
"""
    try:
        response = g_model.generate_content(prompt)
        return (response.text or "").strip()
    except Exception as e:
        print(f"Error generating response: {e}")
        return "I apologize, but I encountered an error while generating a explanation."



def decide_visualization_llm(data: list) -> str:
    """
    Uses LLM to decide visualization type based on actual result data.
    """

    if not data:
        return "none"

    # Hard rule: single numeric KPI
    if (
        len(data) == 1
        and len(data[0]) == 1
        and isinstance(list(data[0].values())[0], (int, float))
    ):
        return "kpi"

    prompt = f"""
You are a visualization classifier.

Allowed types:
- table
- bar
- pie
- graph

Rules:
- bar or pie ONLY if data is like {{ name, value }}, prefer pie if data is less or equal than 10
- graph ONLY if rows represent relationships
- otherwise choose table

Data:
{json.dumps(data, indent=2)}

Return STRICT JSON only:
{{ "viz": "table | bar | pie | graph" }}
"""

    try:
        response = g_model.generate_content(
            prompt,
            generation_config={"temperature": 0},
        )
        text = response.text or ""
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            return "table"

        viz = json.loads(match.group()).get("viz", "table")
        return viz if viz in ALLOWED_VIZ else "table"

    except Exception:
        return "table"
