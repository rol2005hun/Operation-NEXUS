export const useAuth = () => {
    const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {
            const response = await $fetch<AuthResponse>('/api/auth/login', {
                method: 'POST',
                body: credentials
            });

            if (!response.success) {
                throw response;
            }

            return response;
        } catch (error: any) {
            if (error?.success === false && error?.message) {
                throw error;
            }

            if (error?.data) {
                throw error.data;
            }

            if (error?.message) {
                throw {
                    success: false,
                    message: error.message
                };
            }

            throw {
                success: false,
                message: 'Login failed'
            };
        }
    };

    const register = async (data: RegisterData): Promise<AuthResponse> => {
        try {
            const response = await $fetch<AuthResponse>('/api/auth/register', {
                method: 'POST',
                body: data
            });

            if (!response.success) {
                throw response;
            }

            return response;
        } catch (error: any) {
            if (error?.success === false && error?.message) {
                throw error;
            }

            if (error?.data) {
                throw error.data;
            }

            if (error?.message) {
                throw {
                    success: false,
                    message: error.message
                };
            }

            throw {
                success: false,
                message: 'Registration failed'
            };
        }
    };

    return {
        login,
        register
    };
};