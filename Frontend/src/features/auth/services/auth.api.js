import axios from "axios";

export async function  register(name, email, password) {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
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
        const response = await axios.post('http://localhost:5000/api/auth/login', {
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
        const response = await axios.get('http://localhost:5000/api/auth/logout', {
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
        const response = await axios.get('http://localhost:5000/api/auth/get-me', {
            withCredentials: true
        });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }   
}