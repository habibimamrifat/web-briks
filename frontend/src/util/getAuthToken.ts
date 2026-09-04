type TokenType = "access" | "refresh";

export function getAuthToken(type: TokenType) {
  const authData = localStorage.getItem("webBriksAuth");

  if (!authData) {
    return null;
  }
  const { accessToken, refreshToken } = JSON.parse(authData);
  if (type === "refresh") {
    return refreshToken;
  }
  
  return accessToken;
}
