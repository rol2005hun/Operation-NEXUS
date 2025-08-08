export interface User extends BaseEntity {
    username: string;
    email: string;
    agent: Agent;
    gameProgress: GameProgress;
    subscription: Subscription;
}

export interface Agent {
    badge: string;
    name: string;
    rank: DifficultyLevel;
    department: string;
    clearanceLevel: SecurityClearanceLevel;
    joinDate: Date;
}

export interface GameProgress {
    purchasedMissions: string[];
    currentMission: string | null;
    totalPlaytime: number;
    achievements: string[];
    missionScores: Map<string, number>;
}

export interface Subscription {
    type: 'free' | 'premium';
    expiresAt?: Date | null; // default: null
}

export interface UserProfile {
    username: string;
    email: string;
    agentName: string;
}

export interface ProfileUpdateResponse {
    success: boolean;
    user?: User;
}

export interface EmailChangeRequest {
    newEmail: string;
}

export interface EmailChangeResponse {
    success: boolean;
    message: string;
}