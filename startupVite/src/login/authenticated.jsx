import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './authenticated.css';

export function Authenticated(props) {
    const navigate = useNavigate();
  

    return(
        <div>
            <div className = 'login-message '> You are logged in, navigate to your desired page. </div>
        </div>
    );
}
