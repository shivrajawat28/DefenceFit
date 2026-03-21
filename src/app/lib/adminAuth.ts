const ADMIN_AUTH_KEY = "defencefit-admin-auth";

const setLocalAdminAuthenticated = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
};

const clearLocalAdminAuthenticated = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(ADMIN_AUTH_KEY);
};

export const isAdminAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
};

const parsePayload = async (response: Response) => {
  const text = await response.text();
  return text ? (JSON.parse(text) as Record<string, unknown>) : {};
};

export const loginAdmin = async (email: string, password: string) => {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const payload = await parsePayload(response);
  if (!response.ok || payload.authenticated !== true) {
    clearLocalAdminAuthenticated();
    return {
      ok: false,
      error:
        typeof payload.error === "string"
          ? payload.error
          : "Invalid admin credentials.",
    };
  }

  setLocalAdminAuthenticated();
  return { ok: true, error: "" };
};

export const logoutAdmin = async () => {
  try {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
  } finally {
    clearLocalAdminAuthenticated();
  }
};

export const checkAdminSession = async () => {
  try {
    const response = await fetch("/api/admin/session", {
      credentials: "include",
    });
    const payload = await parsePayload(response);
    const authenticated = response.ok && payload.authenticated === true;

    if (authenticated) {
      setLocalAdminAuthenticated();
      return true;
    }

    clearLocalAdminAuthenticated();
    return false;
  } catch {
    return isAdminAuthenticated();
  }
};
