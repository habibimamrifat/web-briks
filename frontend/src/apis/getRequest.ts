import { getAuthToken } from "@/util/getAuthToken";
import { renewToken } from "@/util/renewToken";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

type GetRequestOptions = {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  requiredAuth?: boolean;
};

export async function sendGetRequest(
  url: string,
  component: string,
  options?: GetRequestOptions,
  retry = true,
) {
  const { requiredAuth = false, ...fetchOptions } = options ?? {};

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (requiredAuth) {
      const accessToken = getAuthToken("access");

      if (!accessToken) {
        throw new Error(`${component}: Access token not found`);
      }

      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
      method: "GET",
      headers,
      ...fetchOptions,
    });

    /*
     * Token expired
     */
    if (response.status === 401 && requiredAuth) {
      /*
       * We already retried once.
       * Do not try again.
       */
      if (!retry) {
        throw new Error(
          `${component}: Authentication failed after token renewal`,
        );
      }

      const renewed = await renewToken();

      if (!renewed) {
        throw new Error(`${component}: Token renewal failed`);
      }

      /*
       * Retry the original request with
       * the newly generated access token.
       */
      return sendGetRequest(url, component, options, false);
    }

    if (!response.ok) {
      throw new Error(`${component}: GET request failed (${response.status})`);
    }

    return response.json();
  } catch (error) {
    console.error(`${component}:`, error);
    throw error;
  }
}
