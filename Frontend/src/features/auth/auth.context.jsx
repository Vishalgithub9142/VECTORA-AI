import { createContext, useContext, useState, useEffect } from "react";
import { login, getMe } from "./services/auth.api"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children })=>{
    
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check if user is already logged in on app mount
    useEffect(() => {
        const checkUser = async () => {
            try {
                // First, restore token from localStorage if it exists
                const storedToken = localStorage.getItem('authToken');
                if (storedToken) {
                    // Token is already available for the interceptor to use
                }
                
                const userData = await getMe();
                setUser(userData.user);
            } catch (error) {
                // User not authenticated
                console.log("No active session");
                localStorage.removeItem('authToken');
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    return (
        <AuthContext.Provider value= {{user, setUser, loading, setLoading}}>      
            {children}
        </AuthContext.Provider>
    )
}
