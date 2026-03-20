const ADMIN_AUTH_KEY = "defence-medical-admin-auth";
const ADMIN_EMAIL = "shiv@gmail.com";
const ADMIN_PASSWORD = "SHIV123@";

export const isValidAdminCredentials = (email: string, password: string) =>
  email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD;

export const setAdminAuthenticated = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
};

export const clearAdminAuthenticated = () => {
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

export const ADMIN_LOGIN_HINT = {
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
};
