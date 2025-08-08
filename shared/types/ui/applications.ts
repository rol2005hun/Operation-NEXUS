export interface MissionApp {
    id: string;
    name: string;
    icon: string;
    type: 'financial' | 'surveillance' | 'database' | 'communication' | 'monitoring' | 'social' | 'forensic';
    description: string;
    data?: AppSpecificData; // default: {}
    showOnDesktop?: boolean; // default: true
    builtIn?: boolean; // default: false
    default?: boolean; // default: false
    component?: string; // default: 'Default'
    accessRequirements?: string[]; // default: []
}

export interface AppSpecificData {
    [key: string]: unknown;
}

export interface ChatListProps {
    chats: Chat[];
    activeChat: string | null;
    chatFilter: 'chats' | 'own' | 'all' | 'observed' | 'trash';
    playerName: string;
    searchQuery: string;
}

export interface ChatListEmits {
    'select-chat': [chatId: string];
    'refresh': [];
    'new-chat': [];
    'move-to-trash': [chatId: string];
    'restore-from-trash': [chatId: string];
    'permanent-delete': [chatId: string];
    'update:chatFilter': [value: 'chats' | 'own' | 'all' | 'observed' | 'trash'];
    'update:search-query': [query: string];
}

export interface MessageAreaProps {
    chat: Chat | null;
    playerName: string;
    isMarkedAsEvidence: boolean;
}

export interface MessageAreaEmits {
    (event: 'send-message', message: string): void;
    (event: 'toggle-evidence', chatId: string): void;
}

export interface NewChatDialogProps {
    show: boolean;
    availableCharacters: Character[];
}

export interface ChatData {
    type: 'private' | 'group';
    name: string;
    selectedCharacters: string[];
}

export interface NewChatDialogEmits {
    (event: 'close'): void;
    (event: 'create', data: ChatData): void;
}

export interface NexusProcessingModalProps {
    isVisible: boolean;
    currentStep: number;
    processingStatus: string;
    processingText: string;
    dotIndex: number;
    processingError: boolean;
}

export interface EvidenceLockerHeaderProps {
    missionData?: Mission | null;
    statusClass: string;
    statusText: string;
}

export interface EvidenceTabProps {
    investigationProgress: number;
    progressClass: string;
    progressStatusText: string;
    evidenceItems: EvidenceItem[];
}

export interface Suspect {
    id: string;
    name: string;
    role: string;
    isSuspect: boolean;
}

export interface SuspectSelectionModalProps {
    availableSuspects: Suspect[];
    selectedSuspects: string[];
}

export interface TabsContainerProps {
    activeTab: string;
}

export interface TimelineTabProps {
    revealedTimelineEvents: MissionEvent[];
}