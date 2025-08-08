<template>
    <div class="crypto-cracker">
        <div class="header">
            <h2>🔓 CryptoCracker v1.0</h2>
            <div class="tool-info">
                <span class="status" :class="statusClass">{{ statusMessage }}</span>
            </div>
        </div>

        <div class="main-content">
            <div class="cipher-section">
                <h3>🔐 Cipher Type</h3>
                <div class="cipher-types">
                    <button v-for="cipher in availableCiphers" :key="cipher.id"
                        :class="{ active: selectedCipher === cipher.id }" @click="selectCipher(cipher.id)"
                        class="cipher-btn">
                        {{ cipher.icon }} {{ cipher.name }}
                    </button>
                </div>
            </div>

            <div class="input-section">
                <h3>📝 Encrypted Message</h3>
                <textarea v-model="encryptedText" placeholder="Paste encrypted message here..." class="encrypted-input"
                    rows="6"></textarea>

                <div class="key-input" v-if="needsKey">
                    <label>🔑 Decryption Key:</label>
                    <input v-model="decryptionKey" type="text" :placeholder="keyPlaceholder"
                        class="key-field" />
                </div>
            </div>

            <div class="action-section">
                <button @click="decryptMessage" :disabled="!encryptedText || isProcessing" class="decrypt-btn primary">
                    {{ isProcessing ? '🔄 Processing...' : '🔓 Decrypt' }}
                </button>

                <button @click="analyzeFrequency" :disabled="!encryptedText" class="analyze-btn secondary">
                    📊 Frequency Analysis
                </button>

                <button @click="bruteForce" :disabled="!encryptedText || isProcessing" class="brute-btn warning">
                    ⚡ Brute Force
                </button>

                <button @click="clearAll" class="clear-btn">
                    🗑️ Clear
                </button>
            </div>

            <div class="results-section" v-if="decryptedText || analysisResults">
                <h3>✅ Results</h3>

                <div v-if="decryptedText" class="decrypted-result">
                    <h4>🔓 Decrypted Message:</h4>
                    <div class="result-text">{{ decryptedText }}</div>
                    <div class="result-metadata">
                        <span>Cipher: {{ getCurrentCipherName() }}</span>
                        <span v-if="usedKey">Key: {{ usedKey }}</span>
                        <span>Time: {{ processingTime }}ms</span>
                    </div>
                </div>

                <div v-if="analysisResults" class="analysis-result">
                    <h4>📊 Frequency Analysis:</h4>
                    <div class="frequency-chart">
                        <div v-for="(freq, char) in analysisResults" :key="char" class="freq-bar">
                            <span class="char">{{ char }}</span>
                            <div class="bar">
                                <div class="fill" :style="{ width: (freq * 100) + '%' }"></div>
                            </div>
                            <span class="percentage">{{ (freq * 100).toFixed(1) }}%</span>
                        </div>
                    </div>
                </div>

                <div v-if="bruteForceResults.length > 0" class="brute-results">
                    <h4>⚡ Brute Force Results:</h4>
                    <div class="brute-list">
                        <div v-for="result in bruteForceResults" :key="result.key" class="brute-item"
                            @click="selectBruteResult(result)">
                            <span class="key">Key: {{ result.key }}</span>
                            <span class="text">{{ result.text.substring(0, 50) }}...</span>
                            <span class="score">Score: {{ result.readabilityScore.toFixed(2) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="evidence-section" v-if="decryptedText">
                <button @click="toggleEvidence" class="mark-evidence-btn" :class="{ 'marked': isMarkedAsEvidence }">
                    {{ isMarkedAsEvidence ? '🔍 Evidence' : '🔍 Mark as Evidence' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const gameStore = useGameStore();

const selectedCipher = ref('caesar');
const encryptedText = ref('');
const decryptionKey = ref('');
const decryptedText = ref('');
const analysisResults = ref<Record<string, number> | null>(null);
const bruteForceResults = ref<BruteForceResult[]>([]);
const isProcessing = ref(false);
const usedKey = ref('');
const processingTime = ref(0);
const currentEvidenceId = ref('');

const availableCiphers: CipherType[] = [
    { id: 'caesar', name: 'Caesar Cipher', icon: '🏛️', needsKey: true },
    { id: 'vigenere', name: 'Vigenère Cipher', icon: '🗝️', needsKey: true },
    { id: 'atbash', name: 'Atbash Cipher', icon: '🔄', needsKey: false },
    { id: 'rot13', name: 'ROT13', icon: '🔃', needsKey: false },
    { id: 'substitution', name: 'Simple Substitution', icon: '🔤', needsKey: true },
    { id: 'base64', name: 'Base64', icon: '📦', needsKey: false }
];

const needsKey = computed(() => {
    const cipher = availableCiphers.find(c => c.id === selectedCipher.value);
    return cipher?.needsKey || false;
});

const keyPlaceholder = computed(() => {
    switch (selectedCipher.value) {
        case 'caesar':
            return 'Enter shift number (1-25) or leave empty for brute force';
        case 'vigenere':
            return 'Enter keyword or leave empty for brute force';
        case 'substitution':
            return 'Enter substitution alphabet or leave empty for analysis';
        default:
            return 'Enter key or leave empty for brute force';
    }
});

const statusClass = computed(() => {
    if (isProcessing.value) return 'processing';
    if (decryptedText.value) return 'success';
    return 'ready';
});

const statusMessage = computed(() => {
    if (isProcessing.value) return 'Processing...';
    if (decryptedText.value) return 'Decryption Complete';
    return 'Ready for Analysis';
});

const isMarkedAsEvidence = computed(() => {
    if (!gameStore.currentMissionData || !gameStore.currentProgress || !currentEvidenceId.value) return false;
    return gameStore.currentProgress.markedEvidence.includes(currentEvidenceId.value);
});

const selectCipher = (cipherId: string) => {
    selectedCipher.value = cipherId;
    clearAll();
};

const decryptMessage = async () => {
    if (!encryptedText.value) return;

    isProcessing.value = true;
    const startTime = performance.now();

    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const result = performDecryption(encryptedText.value, selectedCipher.value, decryptionKey.value);
        decryptedText.value = result.text;
        usedKey.value = result.key;

        const matchingCrypto = findMatchingCryptoMessage(encryptedText.value);
        if (matchingCrypto) {
            currentEvidenceId.value = matchingCrypto.id;
        } else {
            currentEvidenceId.value = `crypto_${selectedCipher.value}_${Date.now()}`;
        }

        processingTime.value = Math.round(performance.now() - startTime);
    } finally {
        isProcessing.value = false;
    }
};

const performDecryption = (text: string, cipher: string, key: string): { text: string; key: string } => {
    switch (cipher) {
        case 'caesar':
            return caesarDecrypt(text, key ? parseInt(key) : null);
        case 'vigenere':
            return vigenereDecrypt(text, key);
        case 'atbash':
            return { text: atbashDecrypt(text), key: 'N/A' };
        case 'rot13':
            return { text: rot13Decrypt(text), key: 'N/A' };
        case 'base64':
            return { text: base64Decrypt(text), key: 'N/A' };
        case 'substitution':
            return substitutionDecrypt(text, key);
        default:
            return { text: 'Unknown cipher type', key: '' };
    }
};

const caesarDecrypt = (text: string, shift: number | null): { text: string; key: string } => {
    if (shift !== null && shift >= 1 && shift <= 25) {
        return { text: caesarShift(text, -shift), key: shift.toString() };
    }

    let bestText = '';
    let bestScore = 0;
    let bestShift = 0;

    for (let i = 1; i <= 25; i++) {
        const candidate = caesarShift(text, -i);
        const score = calculateReadabilityScore(candidate);
        if (score > bestScore) {
            bestScore = score;
            bestText = candidate;
            bestShift = i;
        }
    }

    return { text: bestText, key: bestShift.toString() };
};

const caesarShift = (text: string, shift: number): string => {
    return text.replace(/[a-zA-Z]/g, (char) => {
        const start = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - start + shift + 26) % 26) + start);
    });
};

const vigenereDecrypt = (text: string, key: string): { text: string; key: string } => {
    if (!key) return { text: 'Vigenère cipher requires a key', key: '' };

    let result = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char && /[a-zA-Z]/.test(char)) {
            const textChar = char.toUpperCase().charCodeAt(0) - 65;
            const keyChar = key[keyIndex % key.length]?.toUpperCase()?.charCodeAt(0);
            if (keyChar !== undefined) {
                const keyCharValue = keyChar - 65;
                const decrypted = (textChar - keyCharValue + 26) % 26;
                result += String.fromCharCode(decrypted + 65);
                keyIndex++;
            }
        } else {
            result += char || '';
        }
    }

    return { text: result, key };
};

const atbashDecrypt = (text: string): string => {
    return text.replace(/[a-zA-Z]/g, (char) => {
        if (char <= 'Z') {
            return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
        } else {
            return String.fromCharCode(122 - (char.charCodeAt(0) - 97));
        }
    });
};

const rot13Decrypt = (text: string): string => {
    return caesarShift(text, -13);
};

const base64Decrypt = (text: string): string => {
    try {
        return atob(text);
    } catch {
        return 'Invalid Base64 encoding';
    }
};

const substitutionDecrypt = (text: string, key: string): { text: string; key: string } => {
    if (!key || key.length !== 26) {
        return { text: 'Substitution cipher requires 26-character key', key: '' };
    }

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    for (const char of text.toUpperCase()) {
        const index = key.indexOf(char);
        if (index !== -1) {
            result += alphabet[index];
        } else {
            result += char;
        }
    }

    return { text: result, key };
};

const analyzeFrequency = () => {
    const frequencies: Record<string, number> = {};
    const text = encryptedText.value.toUpperCase().replace(/[^A-Z]/g, '');

    for (const char of text) {
        frequencies[char] = (frequencies[char] || 0) + 1;
    }

    const total = text.length;
    for (const char in frequencies) {
        const freq = frequencies[char];
        if (freq !== undefined) {
            frequencies[char] = freq / total;
        }
    }

    const sorted = Object.entries(frequencies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    analysisResults.value = Object.fromEntries(sorted);
};

const bruteForce = async () => {
    if (!encryptedText.value) return;

    isProcessing.value = true;
    bruteForceResults.value = [];

    try {
        await new Promise(resolve => setTimeout(resolve, 100));

        const results: BruteForceResult[] = [];

        if (selectedCipher.value === 'caesar') {
            for (let shift = 1; shift <= 25; shift++) {
                const text = caesarShift(encryptedText.value, -shift);
                const score = calculateReadabilityScore(text);
                results.push({ key: shift.toString(), text, readabilityScore: score });
            }
        }

        results.sort((a, b) => b.readabilityScore - a.readabilityScore);
        bruteForceResults.value = results.slice(0, 10);
    } finally {
        isProcessing.value = false;
    }
};

const calculateReadabilityScore = (text: string): number => {
    const commonWords = ['THE', 'AND', 'TO', 'OF', 'A', 'IN', 'IS', 'IT', 'YOU', 'THAT', 'HE', 'WAS', 'FOR', 'ON', 'ARE', 'AS', 'WITH', 'HIS', 'THEY', 'I', 'ACCOUNT', 'AMOUNT', 'STATUS', 'ACTIVE', 'OFFSHORE', 'FILES', 'STORED', 'FOLDER', 'SECURE', 'BACKUP', 'PROJECT', 'FTPS', 'CREDENTIALS'];
    const words = text.toUpperCase().match(/[A-Z]+/g) || [];
    let score = 0;
    let totalWords = 0;

    for (const word of words) {
        if (word.length >= 2) {
            totalWords++;
            if (commonWords.includes(word)) {
                score += word.length * 2;
            } else if (word.length >= 4) {
                score += 1;
            }
        }
    }

    const wordRatio = totalWords > 0 ? score / (totalWords * 5) : 0;
    return wordRatio;
};

const selectBruteResult = (result: BruteForceResult) => {
    decryptedText.value = result.text;
    usedKey.value = result.key;
    bruteForceResults.value = [];

    const matchingCrypto = findMatchingCryptoMessage(encryptedText.value);
    if (matchingCrypto) {
        currentEvidenceId.value = matchingCrypto.id;
    } else {
        currentEvidenceId.value = `crypto_brute_${selectedCipher.value}_${Date.now()}`;
    }
};

const findMatchingCryptoMessage = (encryptedInput: string) => {
    if (!gameStore.currentMissionContent) return null;
    
    const normalizedInput = encryptedInput.trim().toLowerCase();
    
    return gameStore.currentMissionContent.cryptoMessages.find(crypto => 
        crypto.encryptedText.trim().toLowerCase() === normalizedInput
    );
};

const clearAll = () => {
    encryptedText.value = '';
    decryptionKey.value = '';
    clearResults();
};

const clearResults = () => {
    decryptedText.value = '';
    analysisResults.value = null;
    bruteForceResults.value = [];
    usedKey.value = '';
    processingTime.value = 0;
    currentEvidenceId.value = '';
};

const getCurrentCipherName = (): string => {
    const cipher = availableCiphers.find(c => c.id === selectedCipher.value);
    return cipher?.name || 'Unknown';
};

const toggleEvidence = () => {
    if (!decryptedText.value || !gameStore.currentMissionData) return;

    if (!currentEvidenceId.value) {
        currentEvidenceId.value = `crypto_${decryptedText.value}`;
    }

    gameStore.toggleEvidence(gameStore.currentMissionData.id, currentEvidenceId.value);
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/apps/CryptoCracker';
</style>