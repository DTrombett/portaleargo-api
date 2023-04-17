/**
 * Formatta una data dell'API
 * @param date - La data
 * @returns La data formattata
 */
export const formatDate = (date: Date | number | string) => {
	date = new Date(date);
	return `${date.getFullYear()}-${(date.getMonth() + 1)
		.toString()
		.padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
		.getHours()
		.toString()
		.padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
		.getSeconds()
		.toString()
		.padStart(2, "0")}.${date.getMilliseconds().toString().padStart(3, "0")}`;
};
