import { Routes,Route} from 'react-router'
import './App.css'
import { Homepage } from './webpages/homepage'

function App() {


  return (
    <>
   <Routes>
    <Route path='/' element={<Homepage/>}></Route>
    </Routes>
      
  
      </>
    
  )
}

export default App
