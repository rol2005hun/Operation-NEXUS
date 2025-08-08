export interface CryptoMessage {
    id: string;
    encryptedText: string;
    decryptedText: string;
    cipher: 'Caesar' | 'ROT13' | 'Atbash' | 'Vigenère' | 'Substitution' | 'Base64';
    key?: string;
}

export interface CipherType {
    id: string;
    name: string;
    icon: string;
    needsKey: boolean;
}

export interface BruteForceResult {
    key: string;
    text: string;
    readabilityScore: number;
}