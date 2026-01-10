// frontend/src/components/VisualizationPanel.jsx
import "../styles/VisualizationPanel.css";
import { useApp } from "../context/AppContext";
import TableView from "./visualizations/TableView";
import GraphView from "./visualizations/GraphView";
import KPIView from "./visualizations/KPIView";
import BarView from "./visualizations/BarView";
import PieView from "./visualizations/PieView";

export default function VisualizationPanel() {
  const { vizData, vizEnabled, setVizEnabled } = useApp();

  return (
    <div className="viz-panel">
      <div className="viz-header">
        <h2 className="viz-title">Analytics Engine</h2>

        <div className="viz-status">
          <span className={`status-dot ${vizEnabled && vizData ? "active" : ""}`} />
          <span className="status-text">
            STATUS: {vizEnabled && vizData ? "ACTIVE" : "IDLE"}
          </span>
        </div>
      </div>

      <div className="viz-body">
        {!vizEnabled ? (
          <div className="viz-empty">
            <div className="viz-logo">VIS</div>
            <div className="viz-line" />
            <p>WAITING FOR QUERY DATA...</p>
          </div>
        ) : !vizData ? (
          <div className="viz-empty">
            <div className="viz-logo">VIS</div>
            <div className="viz-line" />
            <p>WAITING FOR QUERY DATA...</p>
          </div>
        ) : (
          <div className="viz-content">
            {vizData.type === "table" && <TableView data={vizData.data} />}
            {vizData.type === "graph" && <GraphView data={vizData.data} />}
            {vizData.type === "kpi" && <KPIView data={vizData.data} />}
            {vizData.type === "bar" && <BarView data={vizData.data} />}
            {vizData.type === "pie" && <PieView data={vizData.data} />}
          </div>
        )}
      </div>

      <div className="viz-footer">
        <button
          className="viz-toggle"
          onClick={() => setVizEnabled(!vizEnabled)}
        >
          <div className={`toggle-switch ${vizEnabled ? "on" : ""}`}>
            <div className="toggle-thumb" />
          </div>
          <span>Toggle Canvas</span>
        </button>
      </div>
    </div>
  );
}
