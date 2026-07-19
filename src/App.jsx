import { Routes,Route} from 'react-router'
import { useState } from 'react';
import './App.css'
import { Homepage } from './webpages/homepage'
import{Login} from "./webpages/loginpage";
import { Booking } from './webpages/booking';
import { GoogleOAuthProvider } from '@react-oauth/google';
function App() {

 const [user,setUser]=useState( )
 const [token,setToken]=useState( )
  return (
    <>
    <GoogleOAuthProvider clientId="806438665621-ot0fnvqdvp6irvj2nfme3ue53d8ic77o.apps.googleusercontent.com">
   <Routes>
   
    <Route path='/' element={<Homepage user={user} setUser={setUser} token={token} setToken={setToken}/>}></Route>
     <Route path='/login' element={<Login  user={user} setUser={setUser} token={token} setToken={setToken}/>}></Route>
     <Route path='/booking' element={<Booking user={user} setUser={setUser} token={token} setToken={setToken}/>}></Route>
    </Routes>
      
  </GoogleOAuthProvider>
      </>
    
  )
}

export default App
