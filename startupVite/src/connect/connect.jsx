import React from 'react';
import './connect.css';
import { MessageDialog } from '../messageDialog';

export function Connect({userName}){
    const[partnerEmail, setPartnerEmail] = React.useState(null);
    const [displayError, setDisplayError] = React.useState(null);
    
    const handleEmailChange = (event) => {
        setPartnerEmail(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        submit('/api/connect')
    };

    async function submit(endpoint){
      console.log(userName);
      console.log(partnerEmail);
      const response = await fetch(endpoint, {
        method: 'post',
        body: JSON.stringify({ user: userName, reqUser: partnerEmail }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if(response?.status === 200){
        const body = await response.json();
        setDisplayError(`${body.msg}`);
      }
      else{
        const body = await response.json();
        setDisplayError(`⚠ Error: ${body.msg}`);
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
    <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />          
    </>
    );
}