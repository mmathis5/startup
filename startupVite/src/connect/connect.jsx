import React from 'react';
import './connect.css'

export function Connect({userName}){
    const initialPartnerEmail = localStorage.getItem('partnerEmail') || '';
    const[partnerEmail, setPartnerEmail] = React.useState(initialPartnerEmail);

    const handleEmailChange = (event) => {
        setPartnerEmail(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        localStorage.setItem('partnerEmail', partnerEmail);
        console.log(`User ${userName} connected with partner ${partnerEmail}`)
    };

    return(

      <main>
      <h1>Connect With A Partner</h1>
      <form onSubmit={handleSubmit}>
        <div className="rounded-box">
          <label>Partner Email:  </label>
          <input 
            type="email" 
            placeholder="partneremail@domain.com" 
            value={partnerEmail}
            onChange={handleEmailChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </main>
    );
}