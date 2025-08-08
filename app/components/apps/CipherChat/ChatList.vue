<template>
    <div class="chat-list">
        <div class="chat-header">
            <h3>Cipher Messages</h3>
            <div class="chat-controls">
                <div class="search-container">
                    <input v-model="searchQuery" type="text" placeholder="Search chats..." class="search-input"
                        @input="$emit('update:search-query', searchQuery)">
                    <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn">✕</button>
                </div>
                <select v-model="chatFilter" class="filter-select">
                    <option value="chats">Chats</option>
                    <option value="all">All Chats</option>
                    <option value="own">My Chats</option>
                    <option value="observed">Agent Accessible Chats</option>
                    <option value="trash">Trash</option>
                </select>
                <button class="refresh-btn" @click="$emit('refresh')" title="Refresh Chats">↻</button>
                <button class="new-chat-btn" @click="$emit('new-chat')">+</button>
            </div>
        </div>

        <div class="chats">
            <div v-for="chat in filteredChats" :key="chat.id" class="chat-item"
                :class="{ active: activeChat === chat.id }" @click="$emit('select-chat', chat.id)">
                <div class="chat-avatar">{{ chat.image }}</div>
                <div class="chat-info">
                    <div class="chat-name">
                        {{ chat.name }}
                        <span v-if="chat.participants.length > 2" class="group-indicator">👥</span>
                        <span v-if="isEvidenceChat(chat.id)" class="evidence-indicator">🔍</span>
                    </div>
                    <div class="chat-type-label">{{ getChatTypeLabel(chat) }}</div>
                    <div class="chat-last-message">{{ getLastMessage(chat) }}</div>
                    <div class="chat-time">{{ formatDate(getLastMessageTime(chat)) }}</div>
                </div>
                <div v-if="getUnreadCount(chat) > 0" class="unread-badge">{{ getUnreadCount(chat) }}</div>
                <div class="chat-item-actions">
                    <button v-if="chatFilter !== 'trash'" class="action-btn trash"
                        @click.stop="$emit('move-to-trash', chat.id)" title="Move to Trash">🗑️</button>
                    <button v-if="chatFilter === 'trash'" class="action-btn restore"
                        @click.stop="$emit('restore-from-trash', chat.id)" title="Restore">↶</button>
                    <button v-if="chatFilter === 'trash'" class="action-btn delete"
                        @click.stop="$emit('permanent-delete', chat.id)" title="Delete Forever">❌</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ChatListProps, ChatListEmits } from '#shared/types';

const props = defineProps<ChatListProps>();
const emit = defineEmits<ChatListEmits>();

const searchQuery = ref(props.searchQuery);

const clearSearch = () => {
    searchQuery.value = '';
    emit('update:search-query', '');
};

watch(() => props.searchQuery, (newValue) => {
    searchQuery.value = newValue;
});

watch(searchQuery, (newValue) => {
    emit('update:search-query', newValue);
});

const chatFilter = computed({
    get: () => props.chatFilter,
    set: (value) => emit('update:chatFilter', value)
});

const gameStore = useGameStore();
const { currentMission, progress } = storeToRefs(gameStore);

const filteredChats = computed(() => {
    if (!searchQuery.value.trim()) {
        return props.chats;
    }

    const query = searchQuery.value.toLowerCase();
    return props.chats.filter(chat => {
        if (chat.name && chat.name.toLowerCase().includes(query)) return true;

        if (chat.participants && chat.participants.some((participant: string) => participant.toLowerCase().includes(query))) return true;

        if (chat.messages && chat.messages.some((message: ChatMessage) => {
            if (message.content && message.content.toLowerCase().includes(query)) return true;
            if (message.sender && message.sender.toLowerCase().includes(query)) return true;
            return false;
        })) return true;

        return false;
    });
});

function getUnreadCount(chat: Chat): number {
    if (!currentMission.value || !progress.value[currentMission.value]) {
        return chat.messages?.length || 0;
    }
    const missionProgress = progress.value[currentMission.value];
    const chatsRead = missionProgress?.chatsRead ?? [];
    return chatsRead.includes(chat.id) ? 0 : (chat.messages?.length || 0);
}

const getParticipantsDisplay = (chat: Chat): string => {
    const otherParticipants = chat.participants.filter((p: string) => p !== props.playerName);
    const isPlayer = chat.participants.includes(props.playerName);

    if (isPlayer) {
        return `You + ${otherParticipants.join(', ')}`;
    }
    return otherParticipants.join(', ');
};

const getChatTypeLabel = (chat: Chat): string => {
    const participantsLabel = getParticipantsDisplay(chat);

    if (chat.participants.length === 2) {
        return `Private chat: ${participantsLabel}`;
    } else {
        return `Group chat: ${participantsLabel}`;
    }
};

const getLastMessage = (chat: Chat): string => {
    if (!chat.messages || chat.messages.length === 0) {
        return 'No messages';
    }

    const lastMessage = chat.messages[chat.messages.length - 1];
    return lastMessage?.content || 'No content';
};

const getLastMessageTime = (chat: Chat): Date => {
    if (!chat.messages || chat.messages.length === 0) {
        return new Date();
    }

    const lastMessage = chat.messages[chat.messages.length - 1];
    return lastMessage?.timestamp || new Date();
};

const isEvidenceChat = (chatId: string): boolean => {
    const gameStore = useGameStore();
    const missionContent = gameStore.currentMissionContent;
    return missionContent?.evidenceItems?.includes(chatId) ?? false;
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/CipherChat/ChatList.scss';
</style>