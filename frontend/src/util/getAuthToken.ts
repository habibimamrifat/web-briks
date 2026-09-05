type TokenType = "access" | "refresh";

export function getAuthToken(type: TokenType) {
  if (typeof window === "undefined") {
    return null;
  }

  const authData = localStorage.getItem("webBriksAuth");

  if (!authData) {
    return null;
  }

  const parsedAuthData = JSON.parse(authData);

  if (type === "access") {
    return parsedAuthData.accessToken ?? null;
  }

  return parsedAuthData.refreshToken ?? null;
}