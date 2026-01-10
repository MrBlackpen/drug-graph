// frontend/src/components/visualizations/KPIView.jsx
import "../../styles/KPIView.css";

export default function KPIView({ data }) {
  if (!data.length) return null;
  const value = Object.values(data[0])[0];

  return <div className="kpi-value">{value}</div>;
}
