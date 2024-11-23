import React, { useState, useEffect } from 'react';

export function Display({ userName }) {
  const [logs, setLogs] = useState([]);
  const [connectedUser, setConnectedUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the connected user
    const fetchPartnerName = async () => {
      try {
        const response = await fetch(`/api/connectedUser?user=${userName}`, {
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to fetch connected user');
        }

        const data = await response.json();
        setConnectedUser(data.connectedUser); // Set the connected user (partner name)
      } catch {
        setConnectedUser(null);
      }
    };

    fetchPartnerName();
  }, [userName]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`/api/logs?user=${userName}&connectedUser=${connectedUser}`, {
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to fetch logs');
        }

        const data = await response.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLogs();
  }, [userName, connectedUser]); // Re-run when userName or connectedUser changes

  return (
    <main>
      <div className="table-container">
        <h2>Logged Purchases</h2>
        <h2>{connectedUser}</h2>
        {error && <p className="error">Error: {error}</p>}
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Date</th>
              <th>Purchase</th>
              <th>Amount</th>
              <th>Necessity</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.user}</td>
                <td>{log.date}</td>
                <td>{log.purchase}</td>
                <td>${log.amount}</td>
                <td>{log.necessity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
