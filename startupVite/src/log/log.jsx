import React, {useState, useEffect} from 'react';

export function Log({currentUser}){
    const [purchase, setPurchase] = useState('');
    const [amount, setAmount] = useState('');
    const [necessity, setNecessity] = useState('5');
    const [logs, setLogs] = useState([]); 

    useEffect(() => {
      const storedLogs = JSON.parse(localStorage.getItem('purchaseLogs')) || [];
      setLogs(storedLogs);
    }, []);
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const logEntry = {
        user: currentUser,
        date: new Date().toISOString().split('T')[0], 
        purchase,
        amount,
        necessity,
      };
  
    const existingLogs = JSON.parse(localStorage.getItem('purchaseLogs')) || [];
    existingLogs.push(logEntry);
    localStorage.setItem('purchaseLogs', JSON.stringify(existingLogs));
    console.log('Logging Purchase:', logEntry);
    setPurchase('');
    setAmount('');
    setNecessity('5');
  };

    return (
        <main>
          <h1>Log a Purchase</h1>
          <h2>User: {currentUser}</h2>
          <form onSubmit={handleSubmit}>
            <div className="rounded-box">
              <label>Purchase:</label>
              <input
                type="text"
                placeholder="Your purchase"
                value={purchase}
                onChange={(e) => setPurchase(e.target.value)}
              />
            </div>
            <div className="rounded-box">
              <label>Amount:</label>
              <input
                type="text"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="rounded-box">
              <label>Necessity:</label>
              <select
                value={necessity}
                onChange={(e) => setNecessity(e.target.value)}
              >
                <option value="1">1 - Not Necessary</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5 - Moderately Necessary</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10 - Very Necessary</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </main>
      );
}