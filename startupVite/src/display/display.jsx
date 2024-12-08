import React, { useState, useEffect } from 'react';
import { LogNotifier } from '../log/notifyLog';


export function Display({ userName }) {
  const [logs, setLogs] = useState([]);
  const [connectedUser, setConnectedUser] = useState(null);
  const [error, setError] = useState(null);

  //state that will trigger a re-render when new data is received
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchLogs = async (currentUser, partner) => {
    try {
      const queryParams = partner 
        ? `?user=${currentUser}&connectedUser=${partner}` 
        : `?user=${currentUser}`;
        
      const response = await fetch(`/api/logs${queryParams}`, {
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
        setConnectedUser(data.connectedUser.connectedUser); // Set the connected user (partner name)
      } catch {
        setConnectedUser(null);
      }
    };

    fetchPartnerName();
  }, [userName]);

  //load the data 
  useEffect(() => {
    fetchLogs(userName, connectedUser);
  }, [userName, connectedUser]);

  //Listen for WebSocket messages
  useEffect(() => {
    const handleEvent = (event) => {
        console.log("Received WebSocket event:", event);
        if (event.from == connectedUser){
          setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to trigger re-render
        }
        else {
          console.log("Event ignored: does not match connectedUser")
        }
    };

    LogNotifier.addHandler(handleEvent);

    return () => {
        LogNotifier.removeHandler(handleEvent); // Cleanup on unmount
    };
  }, [connectedUser]);


  //Refetch data when refreshKey changes
  useEffect(() => {
    if (refreshKey > 0) {
        console.log("trying to refresh");
        fetchLogs(userName, connectedUser);
    }
  }, [refreshKey]);

  return (
    <main>
      <div className="table-container">
        <h2>Logged Purchases</h2>
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
