import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children })=>{
    
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check if user is already logged in on app mount
    useEffect(() => {
        localStorage.removeItem('authToken');
        const checkUser = async () => {
            try {
                const userData = await getMe();
                setUser(userData.user);
            } catch {
                // User not authenticated
                console.log("No active session");
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
