import React, { useState, useEffect } from 'react';

export function Display({ userName }) {
  const [logs, setLogs] = useState([]);
  const [partnerName, setPartnerName] = useState(localStorage.getItem('partnerEmail'));


  useEffect(() => {
    const partner = localStorage.getItem('partnerEmail');
    setPartnerName(partner);
  }, []);

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem('purchaseLogs')) || [];
    
    const filteredLogs = storedLogs.filter(log => 
      log.user === userName || log.user === partnerName
    );

    setLogs(filteredLogs);
  }, [userName, partnerName]);

  return (
    <main>
    <div className="table-container">
      <h2>Logged Purchases</h2>
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
