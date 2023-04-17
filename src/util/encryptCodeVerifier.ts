import CryptoJS from "crypto-js";

/**
 * Crittografa un codice.
 * @param codeVerifier - Il codice
 * @returns Il codice crittografato
 */
export const encryptCodeVerifier = (codeVerifier: string) =>
	CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Base64url);
