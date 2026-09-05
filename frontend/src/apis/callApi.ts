import { getAuthToken } from "@/util/getAuthToken";
import { renewToken } from "@/util/renewToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiMethod = "POST" | "PUT" | "PATCH" | "DELETE";

type CallApiOptions = {
  method: ApiMethod;
  body?: unknown;
  requiredAuth?: boolean;
};

export async function callApis(
  url: string,
  component: string,
  options: CallApiOptions,
  retry = true,
) {
  const { method, body, requiredAuth = false } = options;

  try {
    const headers: HeadersInit = {};

    const isFormData = body instanceof FormData;

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (requiredAuth) {
      const accessToken = getAuthToken("access");

      if (!accessToken) {
        throw new Error(`${component}: Access token not found`);
      }

      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && requiredAuth) {
      if (!retry) {
        throw new Error(
          `${component}: Authentication failed after token renewal`,
        );
      }

      const renewed = await renewToken();

      console.log("Token renewed: ======>>>>>", renewed);

      if (!renewed) {
        throw new Error(`${component}: Token renewal failed`);
      }

      /*
       * Retry the original request.
       */
      return callApis(url, component, options, false);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `${component}: ${data?.message || "API request failed"} (${response.status})`,
      );
    }

    return data;
  } catch (error) {
    console.error(`${component}:`, error);
    throw error;
  }
}
