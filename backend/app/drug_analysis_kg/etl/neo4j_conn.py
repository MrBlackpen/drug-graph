#backend/app/drug_analysis_kg/etl/neo4j_conn.py
from neo4j import GraphDatabase

NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "drug-analysis-kg"
NEO4J_DATABASE = "main"

driver = GraphDatabase.driver(
    NEO4J_URI,
    auth=(NEO4J_USER, NEO4J_PASSWORD)
)

def get_session():
    return driver.session(database=NEO4J_DATABASE)
