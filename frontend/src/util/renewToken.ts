const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function renewToken() {
  console.log("Renewing token...");

  const authData = localStorage.getItem("webBriksAuth");
  console.log("Auth data from localStorage: ======>>>>>", authData);

  if (!authData) {
    return null;
  }

  const { refreshToken } = JSON.parse(authData);

  console.log("Refresh token: ======>>>>>", refreshToken);

  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: refreshToken,
    }),
  });

  console.log("Renew token response:=======>>>>>", response);

  if (!response.ok) {
    localStorage.removeItem("webBriksAuth");
    return null;
  }

  const data = await response.json();

  console.log("Renew token data:=======>>>>>", data);

  const newAuthData = {
    accessToken: data.accessToken,
    refreshToken: refreshToken,
  };

  localStorage.setItem("webBriksAuth", JSON.stringify(newAuthData));

  return newAuthData;
}
