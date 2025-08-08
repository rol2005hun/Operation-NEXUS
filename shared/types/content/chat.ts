export interface Chat extends BaseEntity {
    id: string;
    participants: string[];
    messages: ChatMessage[];
    image: string;
    name?: string; // default: 'Participant 1 name + Participant 2 name'
    status?: 'online' | 'offline' | 'away' | 'busy'; // default: 'offline'
}

export interface ChatMessage extends BaseEntity {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
    attachments?: string[]; // default: []
}

export interface ChatFilter {
    showOwnChats: boolean;
    showAllAccessible: boolean;
    showEvidenceOnly: boolean;
}

export interface NewChatRequest {
    participantIds: string[];
    name?: string; // default: 'Participant 1 name + Participant 2 name'
}