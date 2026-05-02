export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  let accessToken = localStorage.getItem("accessToken");

  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    return response;
  }

  const refreshResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    },
  );

  if (!refreshResponse.ok) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    return response;
  }

  const data = await refreshResponse.json();

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  accessToken = data.accessToken;

  const retryHeaders = new Headers(options.headers);
  retryHeaders.set("Authorization", `Bearer ${accessToken}`);

  return fetch(url, {
    ...options,
    headers: retryHeaders,
  });
}
