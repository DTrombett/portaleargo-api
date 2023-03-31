const characters =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generate a random string of `length` characters.
 * @param length - The length of the string to generate
 * @returns The generated random string
 */
export const randomString = (length: number) => {
	let result = "";

	for (let i = 0; i < length; i++)
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	return result;
};
