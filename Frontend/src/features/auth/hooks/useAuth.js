import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import {login,register,logout,getMe} from "../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async(email,password) => {

        setLoading(true)
        try{
     const data = await login({email,password})

     setUser(data.user)
        }
        catch(err){
            console.error("Login failed:", err)
        }
        finally{
     setLoading(false)
    }
}


    const handleRegister = async(name,email,password) => {

        try{
        setLoading(true)
        const data = await register({name,email,password})
        setUser(data.user)
       
        }
        catch(err){
            console.error("Register failed:", err)
        }
        finally{
            setLoading(false)
        }
    }
    const handleLogout = async() => {
        setLoading(true)
        try{
       
       const data= await logout()
        setUser(null)
      
        }
        catch(err){
            console.error("Logout failed:", err)
        }
        finally{
            setLoading(false)
        }
    }
    return {user, loading, login: handleLogin, register: handleRegister, logout: handleLogout}
}