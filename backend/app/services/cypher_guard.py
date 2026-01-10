# backend/app/services/cypher_guard.py
FORBIDDEN = ["CREATE", "MERGE", "DELETE", "SET", "REMOVE", "DROP"]

def validate_cypher(query: str):
    q = query.upper()
    for word in FORBIDDEN:
        if word in q:
            raise ValueError(f"Unsafe Cypher detected: {word}")
