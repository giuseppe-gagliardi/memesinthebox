import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react'
import API from './API';
import { MemeNavbar } from './MemeNavbar'
import { MemePage } from './MemePage'
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function getUserI() {
      try {
        const userInfo = await API.getUserInfo();
        setLoggedIn(userInfo);
        setMessage(`Welcome, ${userInfo.username}!`);
      }
      catch (e) { setLoggedIn(false); setMessage(false) }
    }
    getUserI();
  }, []);


  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(user);
      setMessage(`Welcome, ${user.username}!`);
      return user;
    } catch { }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage(false);
  }

  return (
    <Router>
      <MemeNavbar doLogOut={doLogOut} doLogIn={doLogIn} loggedIn={loggedIn} message={message}></MemeNavbar>
      <MemePage loggedIn={loggedIn}></MemePage>
    </Router>

  );
}

export default App;
