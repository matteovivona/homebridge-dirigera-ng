import crypto from 'crypto';

const CODE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('')
const CODE_LENGTH = 128
export const CODE_CHALLENGE_METHOD = 'S256'

export const generateCodeVerifier = () => {
    // Use a cryptographically secure RNG. Rejection sampling avoids the modulo
    // bias that a naive `bytes[i] % length` would introduce.
    const verifier: string[] = [];
    while (verifier.length < CODE_LENGTH) {
        const bytes = crypto.randomBytes(CODE_LENGTH);
        for (let i = 0; i < bytes.length && verifier.length < CODE_LENGTH; i++) {
            const byte = bytes[i];
            if (byte < CODE_CHARACTERS.length * Math.floor(256 / CODE_CHARACTERS.length)) {
                verifier.push(CODE_CHARACTERS[byte % CODE_CHARACTERS.length]);
            }
        }
    }
    return verifier.join('');
}

export const calculateCodeChallenge = (codeVerifier: string) => {
    return crypto.createHash('sha256').update(codeVerifier).digest('base64url')
}
