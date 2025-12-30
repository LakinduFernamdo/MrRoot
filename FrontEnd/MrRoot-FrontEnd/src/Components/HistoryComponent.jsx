import React from "react";

function HistoryTable({ historyData = [], onClose }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-container"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Your History</h3>

        <table className="history-table">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Date</th>
              <th>Time</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(historyData) && historyData.length > 0 ? (
              historyData.map((item, index) => (
                <tr key={item.id ?? index}>
                  <td>{item.from}</td>
                  <td>{item.to}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>{item.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No history found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default HistoryTable;
