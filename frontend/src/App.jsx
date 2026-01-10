/// frontend/src/App.jsx
import "./App.css";
import ChatPanel from "./components/ChatPanel";
import VisualizationPanel from "./components/VisualizationPanel";
import { useApp } from "./context/AppContext";

export default function App() {
  const { vizEnabled } = useApp();

  return (
    <div className="app-container">
      <header className="header">DRUG ANALYZING SYSTEM</header>

      <div className="main-content">
        <div className="dashboard-card">
          <div className="panel-viz">
            <VisualizationPanel />
          </div>

          <div className="panel-chat half-width">
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  );
}