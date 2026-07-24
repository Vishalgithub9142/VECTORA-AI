import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true
})

// Add token to Authorization header if it exists in localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function register({username, email, password , confirmPassword}){

    try {
        const response = await api.post("/api/auth/register", {
            username,
            email,
            password
        });

        // Store token in localStorage
        if (response.data.user) {
            // If backend returns token, store it
            // Otherwise it's set in cookies which is fine
        }

        return response.data;   
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function login({email, password}){

    try {
        const response = await api.post("/api/auth/login",{
            email,
            password
        })

        return response.data;   

    } catch (error) {
        console.log(error);
        throw error;
    }

}

export async function logout(){
    try {
        const response = await api.post("/api/auth/logout")

        return response.data;
        
    } catch (error) {
        console.log(error);
        throw error;
    }

}

export async function getMe(){

    try {
        const response = await api.get("/api/auth/get-me")

        return response.data;
        
    } catch (error) {
        console.log(error);
        throw error;
    }

}