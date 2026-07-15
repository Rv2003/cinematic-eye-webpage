import { Routes,Route} from 'react-router'
import './App.css'
import { Homepage } from './webpages/homepage'
import{Login} from "./webpages/loginpage";
import { GoogleOAuthProvider } from '@react-oauth/google';
function App() {


  return (
    <>
    <GoogleOAuthProvider clientId="806438665621-ot0fnvqdvp6irvj2nfme3ue53d8ic77o.apps.googleusercontent.com">
   <Routes>
   
    <Route path='/' element={<Homepage/>}></Route>
     <Route path='/login' element={<Login/>}></Route>
    </Routes>
      
  </GoogleOAuthProvider>
      </>
    
  )
}

export default App
