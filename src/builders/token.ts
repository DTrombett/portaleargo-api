import type { APIToken, Token } from "../types";

/**
 * Build the token data.
 * @param body - The API response
 * @returns The new data
 */
export const buildToken = (body: APIToken, date: Date): Token => {
	date.setSeconds(date.getSeconds() + body.expires_in);
	return {
		accessToken: body.access_token,
		expireDate: date.getTime(),
		idToken: body.id_token,
		refreshToken: body.refresh_token,
		scopes: body.scope.split(" "),
		tokenType: body.token_type,
	};
};
