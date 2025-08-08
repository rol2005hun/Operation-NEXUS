import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
    }),

    getters: {
        currentUser: (state) => state.user,
        userAgent: (state) => state.user?.agent,
        gameProgress: (state) => state.user?.gameProgress,
        canAccessMission: (state) => (mission: Mission) => {
            if (!state.user) return false;

            const hasPurchased = state.user.gameProgress.purchasedMissions.includes(mission.id);
            const hasRequiredClearance = state.user.agent.clearanceLevel >= mission.securityClearance;

            return hasPurchased && hasRequiredClearance;
        }
    },

    actions: {
        async register(userData: { username: string; email: string; password: string; agentName: string }) {
            this.isLoading = true;
            try {
                const { register } = useAuth();
                const data = await register(userData);

                if (data.success) {
                    return {
                        success: true,
                        message: data.message,
                        email: data.email,
                        verificationLink: data.verificationLink
                    };
                }
            } catch (error: any) {
                let errorMessage = 'Registration failed';

                if (error?.success === false && error?.message) {
                    errorMessage = error.message;
                } else if (error?.message) {
                    errorMessage = error.message;
                } else if (error?.data?.message) {
                    errorMessage = error.data.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }

                return {
                    success: false,
                    message: errorMessage
                };
            } finally {
                this.isLoading = false;
            }
        },

        setUser(user: any) {
            this.user = user;
            this.isAuthenticated = true;
        },

        setToken(token: string) {
            this.token = token;
            const tokenCookie = useCookie('auth-token');
            tokenCookie.value = token;
        },

        async login(credentials: { identifier: string; password: string; rememberMe?: boolean }) {
            this.isLoading = true;
            try {
                const { login } = useAuth();
                const data = await login(credentials);

                if (data.success && data.user) {
                    this.user = data.user;
                    this.token = data.token || null;
                    this.isAuthenticated = true;

                    const cookieOptions = credentials.rememberMe
                        ? { maxAge: 60 * 60 * 24 * 365 * 10 }
                        : {};

                    const tokenCookie = useCookie('auth-token', cookieOptions);
                    tokenCookie.value = data.token;

                    return { success: true, message: data.message };
                }
            } catch (error: any) {
                let errorMessage = 'Login failed';

                if (error?.success === false && error?.message) {
                    errorMessage = error.message;
                } else if (error?.message) {
                    errorMessage = error.message;
                } else if (error?.data?.message) {
                    errorMessage = error.data.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }

                return {
                    success: false,
                    message: errorMessage
                };
            } finally {
                this.isLoading = false;
            }
        },

        async forgotPassword(email: string) {
            this.isLoading = true;
            try {
                const data = await $fetch<{
                    success: boolean;
                    message: string;
                }>('/api/password-reset/request', {
                    method: 'POST',
                    body: { email }
                });

                return {
                    success: data.success,
                    message: data.message
                };
            } catch (error: any) {
                let errorMessage = 'Failed to send reset email';

                if (error?.data?.message) {
                    errorMessage = error.data.message;
                } else if (error?.message) {
                    errorMessage = error.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }

                return {
                    success: false,
                    message: errorMessage
                };
            } finally {
                this.isLoading = false;
            }
        },

        async resetPassword(token: string, newPassword: string) {
            this.isLoading = true;
            try {
                const data = await $fetch<{
                    success: boolean;
                    message: string;
                }>('/api/password-reset/verify', {
                    method: 'POST',
                    body: { token, newPassword }
                });

                return {
                    success: data.success,
                    message: data.message
                };
            } catch (error: any) {
                let errorMessage = 'Failed to reset password';

                if (error?.data?.message) {
                    errorMessage = error.data.message;
                } else if (error?.message) {
                    errorMessage = error.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }

                return {
                    success: false,
                    message: errorMessage
                };
            } finally {
                this.isLoading = false;
            }
        },

        async fetchProfile() {
            if (!this.token) return;

            try {
                const { fetchProfile } = useUserProfile();
                const data = await fetchProfile(this.token);

                if (data.success && data.user) {
                    this.user = data.user;
                    this.isAuthenticated = true;
                }
            } catch (error: any) {
                console.error('Profile fetch error:', error);

                if (error?.statusCode === 404 || error?.statusCode === 401 ||
                    error?.data?.statusCode === 404 || error?.data?.statusCode === 401) {
                    this.clearAuth();
                }
            }
        },

        clearAuth() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
        },

        logout() {
            this.clearAuth();

            try {
                const tokenCookie = useCookie('auth-token');
                tokenCookie.value = null;
            } catch (error) {
                console.warn('Could not clear auth cookie:', error);
            }
        },

        async initAuth() {
            const tokenCookie = useCookie('auth-token');
            if (tokenCookie.value) {
                this.token = tokenCookie.value;
                await this.fetchProfile();
            }
        }
    }
});