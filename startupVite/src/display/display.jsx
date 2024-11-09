// Display.jsx
import React, { useState, useEffect } from 'react';

export function Display({ userName, partnerName }) {
  // Sample data for the logged-in user and the connected user
  const [loggedPurchases, setLoggedPurchases] = useState([
    { date: '10/01/2024', purchase: 'Groceries', amount: 90, necessity: 10 },
    { date: '10/02/2024', purchase: 'Rent', amount: 550, necessity: 10 },
    { date: '10/02/2024', purchase: 'Eating Out', amount: 25, necessity: 4 },
  ]);

  const [partnerPurchases, setPartnerPurchases] = useState([
    { date: '10/01/2024', purchase: 'Laser Tag', amount: 50, necessity: 3 },
    { date: '10/02/2024', purchase: 'Bookstore', amount: 45, necessity: 6 },
    { date: '10/02/2024', purchase: 'Eating Out', amount: 35, necessity: 5 },
  ]);

  return (
    <main>
      <div className="table-container">
        <h2>Logged In User: {userName}</h2>
        <h2>Connected User: {partnerName}</h2>
      </div>
        
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Purchase</th>
              <th>Amount</th>
              <th>Necessity</th>
            </tr>
          </thead>
          <tbody>
            {loggedPurchases.map((purchase, index) => (
              <tr key={index}>
                <td>{purchase.date}</td>
                <td>{purchase.purchase}</td>
                <td>${purchase.amount}</td>
                <td>{purchase.necessity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Purchase</th>
              <th>Amount</th>
              <th>Necessity</th>
            </tr>
          </thead>
          <tbody>
            {partnerPurchases.map((purchase, index) => (
              <tr key={index}>
                <td>{purchase.date}</td>
                <td>{purchase.purchase}</td>
                <td>${purchase.amount}</td>
                <td>{purchase.necessity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
