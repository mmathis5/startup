import React from 'react';
import { BrowserRouter, NavLink, Route, Routes} from 'react-router-dom';
import { About } from './about/about'
import { Display } from './display/display'
import { Log } from './log/log'
import { Connect} from './connect/connect'
import { AuthState } from './login/authState'
import { Login } from './login/login'
import Button from 'react-bootstrap/Button';
import './App.css'


function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);

  function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    })    
      .catch(() => {
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem('userName');
        setAuthState(AuthState.Unauthenticated);
        //fetch the home link and simulate a click. 
        const homeLink = document.getElementsByClassName('home-nav-link')[0]; 
        homeLink.click();
      });
  }

  return (
  <BrowserRouter>
      <header>
        <h1>Paired Financial Management</h1>
        <nav>
          <menu className = 'navbar-nav'>
            <li className = 'nav-item-1'>
              <NavLink className = 'home-nav-link' to= ''>
                Home
              </NavLink>
            </li>
            {authState === AuthState.Authenticated && (
              <li className = 'nav-item'>
              <NavLink className='nav-link' to = 'connect'>
                Connect
              </NavLink>
            </li>
            )}
            {authState === AuthState.Authenticated &&(
              <li className = 'nav-item'>
              <NavLink className='nav-link' to = 'display'>
                Display
              </NavLink>
            </li>
            )}
            {authState === AuthState.Authenticated && (
              <li className = 'nav-item'>
              <NavLink className='nav-link' to = 'log'>
                Log
              </NavLink>
            </li>
            )}
            <li className = 'nav-item'>
              <NavLink className='nav-link'  to = 'about'>
                About
              </NavLink>
            </li>
          </menu>
        </nav>
        {authState === AuthState.Authenticated && (
          <div className="logout-box">
            <span className="user-name">{userName}</span>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        )}
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
        <Route path='/display' element={<Display userName={userName} />}/>
        <Route path = '/log' element={<Log currentUser={userName}/>} />
        <Route path='/about' element = {<About />}/>
      </Routes>
      
      <footer>
        <div>
        <span className = "text-reset"> Maddie Mathis </span>
        <a href="https://github.com/mmathis5/startup">GitHub</a>
        </div>
      </footer>
  </BrowserRouter>
  );
  }

export default App
