# backend/app/services/neo4j_service.py
from app.drug_analysis_kg.etl.neo4j_conn import get_session

def run_cypher(cypher: str):
    with get_session() as session:
        result = session.run(cypher)
        return [r.data() for r in result]
