Drug Analyzing System

An AI-powered medical knowledge graph platform that converts natural language questions into Neo4j Cypher queries, retrieves structured drug intelligence, and automatically visualizes results using interactive charts and graphs.

Overview

The Drug Analyzing System enables users to ask questions like:
How many side effects are reported for amlodipine?
What diseases does a drug treat?
What are the top side effects of a drug?
What ingredients are present in a medication?

The system intelligently:
Translates questions into schema-safe Cypher queries
Executes them on a Neo4j medical knowledge graph
Chooses the best visualization type automatically
Generates grounded, data-backed explanations

Key Features

🔍 Natural Language → Cypher
🧩 Medical Knowledge Graph (Neo4j)
📊 Automatic Visualization Selection
  Table | KPI | Bar Chart | Pie Chart
Graph (relationship-based only)
🔒 Read-only, schema-validated queries
⚡ FastAPI backend
🎨 Modern React UI (custom CSS, no Tailwind)
🤖 LLM-grounded answers (no hallucination)

System Architecture

User Question
     ↓
LLM (Cypher Generator)
     ↓
Cypher Guard (Schema Validation)
     ↓
Neo4j Knowledge Graph
     ↓
Result Data
     ↓
LLM (Visualization Decision)
     ↓
React Visualization Engine

Knowledge Graph Schema
Nodes : 
Drug
Disease
Symptom
Ingredient
DoseForm

Relationships :
(:Drug)-[:TREATS]->(:Disease)
(:Drug)-[:CAUSES]->(:Symptom)
(:Drug)-[:HAS_INGREDIENT]->(:Ingredient)
(:Drug)-[:HAS_DOSE_FORM]->(:DoseForm)

Datasets Used

This project is built on authoritative biomedical datasets provided by the U.S. National Library of Medicine (NLM) and other trusted medical sources.

🧬 RXNorm (NLM)
RXNorm provides standardized drug names, ingredients, dose forms, and relationships.
Source: National Library of Medicine (NLM)

Files Used: 3
Record Counts:
RXNCONSO.RRF → 244,991 records
RXNREL.RRF → 2,541,640 records
RXNSAT.RRF → 3,284,142 records

Usage in Project:
Drug normalization
Drug–ingredient mapping
Drug–dose form relationships
Drug composition and brand relationships

🧠 MeSH (Medical Subject Headings – NLM)
MeSH provides a controlled vocabulary for biomedical and health-related concepts.
Source: National Library of Medicine (NLM)

Files Used: 1 (XML)
Record Count: 10,096,017 records

Usage in Project:
Disease normalization
Biomedical concept hierarchy
Drug–disease treatment relationships

⚠️ SIDER (Side Effect Resource)
SIDER contains clinically reported drug side effects linked to standardized identifiers.
Source: SIDER Database

Files Used: 2
Record Counts:
Side effect relationships → 309,849 records
Drug name mappings → 1,430 records

Usage in Project:
Drug–symptom (side effect) relationships
Adverse effect analysis

🧠 Knowledge Graph Construction
All datasets were parsed, normalized, and integrated into a Neo4j knowledge graph with strict schema validation:
Nodes: Drug, Disease, Symptom, Ingredient, DoseForm
Relationships:
TREATS
CAUSES
HAS_INGREDIENT
HAS_DOSE_FORM

This enables accurate querying, aggregation, and visualization of medical data at scale.

Tech Stack
Backend : Python, FastAPI, Neo4j, Google Gemini LLM

Frontend : React, Recharts, react-force-graph, Custom CSS
