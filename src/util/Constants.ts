export const clientId = "72fd6dea-d0ab-4bb9-8eaa-3ac24c84886c";
export const defaultVersion = "1.18.0";

let AuthFolder: string;

export const getAuthFolder = async () => {
	if (AuthFolder) return AuthFolder;
	return (AuthFolder = (await import("node:path")).join(
		process.cwd(),
		".argo",
	));
};
