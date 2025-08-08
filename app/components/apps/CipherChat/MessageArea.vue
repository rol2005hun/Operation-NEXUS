<template>
    <div class="message-area">
        <div v-if="chat" class="chat-view">
            <div class="chat-header-bar">
                <div class="chat-header-content">
                    <div class="contact-info">
                        <div class="contact-avatar">{{ chat.image }}</div>
                        <div class="contact-details">
                            <div class="contact-name">
                                {{ chat.name }}
                                <span v-if="chat.participants.length > 2" class="group-label">(Group)</span>
                            </div>
                            <div class="chat-type-label chat-type-label-header">{{ getChatTypeLabel(chat) }}</div>
                            <div class="contact-status" :class="getStatusClass(chat.status || 'offline')">
                                {{ chat.status }}
                            </div>
                        </div>
                    </div>
                    <button class="mark-evidence-btn" :class="{ 'marked': isMarkedAsEvidence }"
                        @click="$emit('toggle-evidence', chat.id)">
                        {{ isMarkedAsEvidence ? '🔍 Evidence' : '🔍 Mark as Evidence' }}
                    </button>
                </div>
            </div>

            <div class="messages" ref="messagesContainer">
                <div v-for="message in processedMessages" :key="message.id" class="message"
                    :class="{ sent: message.sender === props.playerName, received: !(message.sender === props.playerName) }">
                    <div v-if="!(message.sender === props.playerName && chat.participants.length === 2)"
                        class="message-sender">
                        {{ message.sender }}
                    </div>
                    <div class="message-content">
                        {{ message.content }}
                    </div>

                    <div v-if="useAttachment().getAttachments(message.attachments ?? []).length"
                        class="message-attachments">
                        <div v-for="file in useAttachment().getAttachments(message.attachments ?? [])" :key="file.id"
                            class="message-attachment" @click="openFileAttachment(file)" :class="{ 'clickable': true }">
                            <span class="attachment-icon">📎</span>
                            <span class="attachment-name">{{ file.name }}</span>
                            <span class="open-hint">📄</span>
                        </div>
                    </div>

                    <div class="message-time">{{ formatDate(message.timestamp) }}</div>
                </div>
            </div>

            <div v-if="chat.participants.includes(props.playerName)" class="message-input">
                <input v-model="newMessage" type="text" placeholder="Type a message..." @keyup.enter="sendMessage">
                <button @click="sendMessage" :disabled="!newMessage.trim()">📤</button>
            </div>
            <div v-else class="message-input-disabled">
                <div class="disabled-text">
                    {{ chat.participants.includes(props.playerName) ? 'Read-only conversation' : `You cannot send
                    messages to
                    this private
                    conversation` }}
                </div>
            </div>
        </div>

        <div v-else class="no-chat-selected">
            <p>Select a conversation</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { MessageAreaProps, MessageAreaEmits } from '#shared/types';

const props = defineProps<MessageAreaProps>();
const emit = defineEmits<MessageAreaEmits>();

const newMessage = ref('');
const messagesContainer = ref<HTMLElement>();

const processedMessages = computed(() => {
    if (!props.chat?.messages) return [];
    return props.chat.messages;
});

const sendMessage = () => {
    if (!newMessage.value.trim() || !props.chat?.participants.includes(props.playerName)) return;

    emit('send-message', newMessage.value.trim());
    newMessage.value = '';

    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};

const getParticipantsDisplay = (chat: Chat): string => {
    const otherParticipants = chat.participants.filter(p => p !== props.playerName);
    const isPlayer = chat.participants.includes(props.playerName);

    if (isPlayer) {
        return `You + ${otherParticipants.join(', ')}`;
    }
    return otherParticipants.join(', ');
};

const getChatTypeLabel = (chat: Chat): string => {
    if (!chat) return '';
    const participantsLabel = getParticipantsDisplay(chat);

    if (chat.participants.length === 2) {
        return `Private chat: ${participantsLabel}`;
    } else {
        return `Group chat: ${participantsLabel}`;
    }
};

const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'away':
            return 'status-away';
        case 'online':
            return 'status-online';
        case 'offline':
            return 'status-offline';
        case 'busy':
            return 'status-busy';
        default:
            return 'status-offline';
    }
};

const openFileAttachment = async (file: FileDocument) => {
    const laptopStore = useLaptopStore();
    laptopStore.openFileInReader(file.id);
};

watch(() => props.chat, () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/CipherChat/MessageArea.scss';
</style>