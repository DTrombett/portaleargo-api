import CryptoJS from "crypto-js";

/**
 * Encrypt a code verifier.
 * @param codeVerifier - The code to encrypt
 * @returns The encrypted code
 */
export const encryptCodeVerifier = (codeVerifier: string) =>
	CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Base64url);
