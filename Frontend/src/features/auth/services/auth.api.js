import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function register(name, email, password) {
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            name,
            email,  
            password
        },{
            withCredentials: true
        });
        return response.data;
    }
    catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }   
}

export async function login(email, password) {
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password
        },{
            withCredentials: true
        });
        return response.data;
    }
    catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
} 

export async function logout() {
    try {
        const response = await axios.get(`${API_URL}/api/auth/logout`, {
            withCredentials: true
        });
        return response.data;
    }
    catch (error) {
        console.error('Error logging out user:', error);
        throw error;
    }
}

export async function getMe() {
    try {
        const response = await axios.get(`${API_URL}/api/auth/get-me`, {
            withCredentials: true
        });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }   
}