/**
 * Format a date for the API.
 * @param date - The date to format
 * @returns The formatted date
 */
export const formatDate = (date: Date | number | string) => {
	date = new Date(date);
	return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
		.toString()
		.padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")} ${date
		.getUTCHours()
		.toString()
		.padStart(2, "0")}:${date
		.getUTCMinutes()
		.toString()
		.padStart(2, "0")}:${date
		.getUTCSeconds()
		.toString()
		.padStart(2, "0")}.${date.getMilliseconds().toString().padStart(3, "0")}`;
};
