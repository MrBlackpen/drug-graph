// frontend/src/components/visualizations/GraphView.jsx
import ForceGraph2D from "react-force-graph-2d";
import "../../styles/GraphView.css";

export default function GraphView({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="graph-empty">
        No relationship data to display
      </div>
    );
  }

  const nodesMap = new Map();
  const links = [];

  data.forEach((row) => {
    Object.entries(row).forEach(([key, val]) => {
      if (!val) return;
  
      let nodeType = "Unknown";
  
      // 🔑 Infer type from column name
      if (/drug/i.test(key)) nodeType = "Drug";
      else if (/disease/i.test(key)) nodeType = "Disease";
      else if (/symptom/i.test(key)) nodeType = "Symptom";
      else if (/ingredient/i.test(key)) nodeType = "Ingredient";
      else if (/doseform/i.test(key)) nodeType = "DoseForm";
  
      if (!nodesMap.has(val)) {
        nodesMap.set(val, {
          id: val,
          name: val,
          type: nodeType
        });
      }
    });
  
    const values = Object.values(row);
  
    if (values.length >= 2) {
      for (let i = 0; i < values.length - 1; i++) {
        const source = values[i];
        const target = values[i + 1];
  
        if (source && target) {
          const exists = links.some(
            l =>
              (l.source === source && l.target === target) ||
              (l.source === target && l.target === source)
          );
  
          if (!exists) {
            links.push({ source, target });
          }
        }
      }
    }
  });  

  const nodes = Array.from(nodesMap.values());

  const getNodeColor = (node) => {
    const map = {
      Drug: "#3b82f6",
      Disease: "#ef4444",
      Symptom: "#f59e0b",
      Ingredient: "#10b981",
      DoseForm: "#8b5cf6"
    };
    return map[node.type] || "#71717a";
  };

  return (
    <div className="graph-container">
      <ForceGraph2D
        graphData={{ nodes, links }}
        nodeLabel="name"
        nodeRelSize={6}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        linkWidth={2}
        linkColor={() => "#3f3f46"}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        backgroundColor="#09090b"
        d3VelocityDecay={0.3}
        cooldownTime={3000}
        warmupTicks={100}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Inter, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.beginPath();
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = getNodeColor(node);
          ctx.fill();

          ctx.fillStyle = "#fafafa";
          ctx.fillText(node.name, node.x, node.y + 10);
        }}
      />

      {/* Legend */}
      <div className="graph-legend">
        <div className="legend-title">NODE TYPES</div>
        {[
          { type: "Drug", color: "#3b82f6" },
          { type: "Disease", color: "#ef4444" },
          { type: "Symptom", color: "#f59e0b" },
          { type: "Ingredient", color: "#10b981" },
          { type: "DoseForm", color: "#8b5cf6" }
        ].map(({ type, color }) => (
          <div key={type} className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: color }}
            />
            <span className="legend-text">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
