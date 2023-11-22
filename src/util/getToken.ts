import { APIToken, LoginLink, clientId } from "..";

export const getToken = async (code: LoginLink & { code: string }) => {
	const res = await fetch("https://auth.portaleargo.it/oauth2/token", {
		headers: {
			"content-type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			code: code.code,
			grant_type: "authorization_code",
			redirect_uri: "it.argosoft.didup.famiglia.new://login-callback",
			code_verifier: code.codeVerifier,
			client_id: clientId,
		}).toString(),
		method: "POST",
	});
	const data: APIToken = await res.json();
	const expireDate = new Date(res.headers.get("date")!);

	if ("error" in data)
		throw new Error(data.error, { cause: data.error_description });
	expireDate.setSeconds(expireDate.getSeconds() + data.expires_in);
	return Object.assign(data, { expireDate });
};
