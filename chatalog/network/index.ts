import nodeFetch, { RequestInit } from "node-fetch";

export async function request<T, U>(
  target: string,
  body: T,
  options?: RequestInit
): Promise<U> {
  const response = await nodeFetch(target, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    ...options,
  });
  return response.json() as U;
}
