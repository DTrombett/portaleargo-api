export const clientId = "72fd6dea-d0ab-4bb9-8eaa-3ac24c84886c";
export const defaultVersion = "1.18.0";

let AuthFolder: string;

export const getAuthFolder = async () => {
	if (AuthFolder) return AuthFolder;
	const [{ join }, { cwd }] = await Promise.all([
		import("node:path"),
		import("node:process"),
	]);

	return (AuthFolder = join(cwd(), ".argo"));
};
