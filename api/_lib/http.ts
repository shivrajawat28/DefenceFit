export const jsonResponse = (
  body: unknown,
  init: ResponseInit = {},
) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers ?? {}),
    },
  });

export const errorResponse = (
  message: string,
  status = 500,
  extra?: Record<string, unknown>,
) =>
  jsonResponse(
    {
      error: message,
      ...(extra ?? {}),
    },
    { status },
  );

export const parseJsonBody = async <T>(request: Request): Promise<T | null> => {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
};
