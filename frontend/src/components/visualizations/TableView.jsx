// frontend/src/components/visualizations/TableView.jsx
import "../../styles/TableView.css";

export default function TableView({ data }) {
  if (!data.length) return <p className="empty-text">No results found.</p>;

  const keys = Object.keys(data[0]);

  return (
    <table className="data-table">
      <thead>
        <tr>
          {keys.map((k) => (
            <th key={k}>{k}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {keys.map((k) => (
              <td key={k}>{row[k]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
