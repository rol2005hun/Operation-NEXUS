<template>
    <div v-if="show" class="new-chat-dialog">
        <div class="dialog-content">
            <div class="dialog-header">
                <h3>Start New Chat</h3>
                <button class="close-btn" @click="$emit('close')">✕</button>
            </div>

            <div class="dialog-body">
                <div class="chat-type-selector">
                    <label>
                        <input type="radio" v-model="chatType" value="private"> Private Chat
                    </label>
                    <label>
                        <input type="radio" v-model="chatType" value="group"> Group Chat
                    </label>
                </div>

                <div v-if="chatType === 'group'" class="group-name-input">
                    <input v-model="chatName" type="text" placeholder="Group name...">
                </div>

                <div class="character-list">
                    <h4>Select participants:</h4>
                    <div class="character-items-container">
                        <div v-for="character in availableCharacters" :key="character.id" class="character-item"
                            @click="toggleCharacterSelection(character.id)">
                            <div class="character-avatar">{{ character.avatar }}</div>
                            <div class="character-info">
                                <div class="character-name">{{ character.name }}</div>
                                <div class="character-role">{{ character.role }}</div>
                            </div>
                            <div v-if="selectedCharacters.includes(character.id)" class="selected-indicator">✓</div>
                        </div>
                    </div>
                </div>

                <div class="dialog-actions">
                    <button @click="$emit('close')" class="cancel-btn">Cancel</button>
                    <button @click="createChat" :disabled="selectedCharacters.length === 0" class="create-btn">
                        Create Chat
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { NewChatDialogProps, NewChatDialogEmits } from '#shared/types';

const props = defineProps<NewChatDialogProps>();
const emit = defineEmits<NewChatDialogEmits>();

const chatType = ref<'private' | 'group'>('private');
const chatName = ref('');
const selectedCharacters = ref<string[]>([]);

const toggleCharacterSelection = (characterId: string) => {
    const index = selectedCharacters.value.indexOf(characterId);
    if (index > -1) {
        selectedCharacters.value.splice(index, 1);
    } else {
        if (chatType.value === 'private') {
            selectedCharacters.value = [characterId];
        } else {
            selectedCharacters.value.push(characterId);
        }
    }
};

const createChat = () => {
    if (selectedCharacters.value.length === 0) return;

    emit('create', {
        type: chatType.value,
        name: chatName.value,
        selectedCharacters: selectedCharacters.value
    });

    chatType.value = 'private';
    chatName.value = '';
    selectedCharacters.value = [];
};

watch(() => props.show, (newShow) => {
    if (!newShow) {
        chatType.value = 'private';
        chatName.value = '';
        selectedCharacters.value = [];
    }
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/CipherChat/NewChatDialog.scss';
</style>