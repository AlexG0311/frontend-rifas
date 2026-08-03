import type { AuthServiceParams, AuthServiceResponse } from '../types/auth.type';
import type { ApiResponse } from '../types/api.type';

export const AuthService = async ({correo, password}: AuthServiceParams) => {
try {
    const response = await fetch(`http://localhost:3000/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            correo,
            password
        })
    });
    const data: ApiResponse<AuthServiceResponse> = await response.json();
    console.log("Token:", data.data);
    return data.data;
    
}catch (error) {
    console.log('Error:', error);
    throw error;
}   
}
