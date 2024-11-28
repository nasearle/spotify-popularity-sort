let accessToken = '';
let refreshToken = '';

export function getTokens() {
  return {accessToken, refreshToken};
}

export function setTokens(access_token: string, refresh_token: string | undefined) {
  accessToken = access_token;
  refreshToken = refresh_token || refreshToken;
}

