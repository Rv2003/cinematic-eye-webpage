import { Hero } from "../components/hero";
import { Navbar } from "../components/navbar";
import { Gallery } from "../components/gallery";

export function Homepage({user,setUser,token,setToken,setAuthLoading,authLoading}) {
console.log(user)
  return (
    <>
      <Navbar user={user} setUser={setUser} token={token} setToken={setToken} setAuthloading={setAuthLoading} authLoading={authLoading}/>
      <Hero />
      <Gallery />
  
    </>
  )
}