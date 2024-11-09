import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { About } from './about/about'
import { Display } from './display/display'
import { Log } from './log/log'
import { Connect} from './connect/connect'
import { AuthState } from './login/authState'
import './App.css'


function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);

return (
<BrowserRouter>
  <div className='header'>
    <header>
      <h1>Paired Financial Management</h1>
      <nav>
        <menu className = 'navbar-nav'>
          <li className = 'nav-item'>
            <NavLink className = 'nav-link' to= 'home'>
              Home
            </NavLink>
          </li>
          <li className = 'nav-item'>
            <NavLink className='nav-link' to = 'connect'>
              Connect
            </NavLink>
          </li>
          <li className = 'nav-item' to = 'display'>
            <NavLink className='nav-link'>
              Display
            </NavLink>
          </li>
          <li className = 'nav-item' to = 'log'>
            <NavLink className='nav-link'>
              Log
            </NavLink>
          </li>
          <li className = 'nav-item' to = 'about'>
            <NavLink className='nav-link'>
              About
            </NavLink>
          </li>
        </menu>
      </nav>
    </header>

    <Routes>
       <Route
            path='/'
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(userName, authState) => {
                  setAuthState(authState);
                  setUserName(userName);
                }}
              />
            }
            exact
          />
      <Route path='/connect' element={<Connect userName={userName} />}/>
      <Route path='display' element={<Display userNmae={userName}/>}/>
      <Route path = 'log' element={<Log/>} />
      <Route path='/about' element = {<About />}/>
    </Routes>
    
    <footer>
      <div>
      <span class = "text-reset"> Maddie Mathis </span>
      <a href="https://github.com/mmathis5/startup">GitHub</a>
      </div>
    </footer>
  </div>
</BrowserRouter>
);
}

export default App
