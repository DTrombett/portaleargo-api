const encoder = new TextEncoder();

/**
 * Crittografa un codice.
 * @param codeVerifier - Il codice
 * @returns Il codice crittografato
 */
export const encryptCodeVerifier = async (codeVerifier: string) =>
	btoa(
		String.fromCharCode(
			...new Uint8Array(
				await crypto.subtle.digest("SHA-256", encoder.encode(codeVerifier)),
			),
		),
	)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
