export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: User;
    message?: string;
    email?: string;
    verificationLink?: string;
}

export interface AuthError {
    data?: {
        message?: string;
    };
}

export interface LoginCredentials {
    identifier: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    agentName: string;
}

export interface JWTPayload {
    userId: string;
    email: string;
    username: string;
}

export interface ScoreUpdateResponse {
    success: boolean;
    currentScore?: number;
    newScore?: number;
    message?: string;
}