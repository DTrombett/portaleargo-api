const characters =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Genera una stringa casuale.
 * @param length - La lunghezza della stringa
 * @returns La stringa generata
 */
export const randomString = (length: number) => {
	let result = "";

	for (let i = 0; i < length; i++)
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	return result;
};
