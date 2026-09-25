import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { LoadingScreen } from "../components/loading";

export function Profile({token}){
 const [isLoading, setIsLoading] = useState(false);

useEffect(()=>{


const fetchData=async()=>{
try{
    setIsLoading(true);
    const response=await axios.get('http://localhost:5500/api/v1/booking/records',{
  headers: {
    'Authorization': `Bearer ${token}`
  }

});
    console.log(response);

}catch(err){
console.log(err)
}finally{
    setIsLoading(false)
}

}
fetchData();
},[token])

if (isLoading){
return<LoadingScreen/>
}

return <p>hukpan</p>






}