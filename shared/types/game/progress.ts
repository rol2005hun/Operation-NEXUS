export interface EmailUIState {
    read: boolean;
    important: boolean;
    folder: string;
}

export interface ChatUIState {
    deleted: boolean;
    permanentlyDeleted: boolean;
    filter: 'chats' | 'own' | 'all' | 'observed' | 'trash';
}

export interface MissionProgress {
    emailsRead: string[];
    chatsRead: string[];
    evidenceFound: string[];
    filesExamined: string[];
    suspectsIdentified: string[];
    timelineBuilt: boolean;
    primarySuspectConfirmed: boolean;
    caseStatus: 'briefing' | 'investigating' | 'analyzing' | 'building_case' | 'arrest_warrant' | 'completed';
    investigationScore: number;
    hintsUsed: number;
    markedEvidence: string[];

    emailUIStates: Record<string, EmailUIState>;
    deletedEmails: string[];
    activeEmailFolder: string;
    selectedEmail: string | null;
    emailSearchQuery: string;
    
    chatUIStates: Record<string, ChatUIState>;
    deletedChats: string[];
    permanentlyDeletedChats: string[];
    activeChatId: string | null;
    chatFilter: 'chats' | 'own' | 'all' | 'observed' | 'trash';
    customChats: Chat[];
    chatSearchQuery: string;
}