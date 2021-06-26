import { useEffect, useState } from 'react';
import './App.css';
import NavBar from './layouts/NavBar';
import Login from './authentication/Login';
import SignUp from './authentication/SignUp';
import fire from "./helpers/db";


function App() {
  const [user, setUser] = useState('');
  const [toggleForm, setToggleForm] =  useState(true);
  const formMode = () => {
    setToggleForm(!toggleForm);
  }
  // const userState = () => {
  //   const data = localStorage.getItem('user');
  //   const us = data !== null ? JSON.parse(data) : null;
  //   setUser(us);
  // }

  const authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser("");
      }

    })
  }

  useEffect(() => {
    authListener();
  }, []);

  return(
     
    <>
    {user !== "" ? ( // if logged in, show nav bar and setUser back to null during logging out
      <> 
      <NavBar setUserState={() => setUser("")}/>                
      </>
    ) : ( // else if not logged in, check for toggle form
       <>
       {toggleForm ? (<Login loggedIn={(user) => setUser(user)} toggle={() => formMode()}/>) 
       : ( <SignUp toggle={() => formMode()}/>)}
      
   </>
    )} 
  </>
  )
        
 
       
      }
    
  



   
  // );
  


export default App;