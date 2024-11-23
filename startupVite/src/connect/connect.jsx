import React from 'react';
import './connect.css';
import { MessageDialog } from '../messageDialog';

export function Connect({userName}){
    const[partnerEmail, setPartnerEmail] = React.useState(null);
    const [message, setMessage] = React.useState(null);
    
    const handleEmailChange = (event) => {
        setPartnerEmail(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        submit('/api/connect')
    };

    async function submit(endpoint){
      const response = await fetch(endpoint, {
        method: 'post',
        body: JSON.stringify({ user: userName, reqUser: partnerEmail }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if(response?.status === 200){
        const body = await response.json();
        setMessage(`${body.msg}`);
      }
      else{
        const body = await response.json();
        setMessage(`⚠ Error: ${body.msg}`);
      }
    }

    return(
      <>
      <main>
      <h1>Connect With A Partner</h1>
      <form onSubmit={handleSubmit}>
        <div className="rounded-box">
          <label>Partner Email:  </label>
          <input 
            type="email" 
            placeholder="partneremail@domain.com" 
            onChange={handleEmailChange}
            value = {partnerEmail}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </main>
    <MessageDialog message={message} onHide={() => setMessage(null)} />          
    </>
    );
}