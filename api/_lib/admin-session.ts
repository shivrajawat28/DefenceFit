import crypto from "node:crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "shiv@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "SHIV123@";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "defencefit-change-this-session-secret";
const SESSION_COOKIE = "defencefit_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type AdminCredential = {
  email: string;
  password: string;
};

const signValue = (value: string) =>
  crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");

const safeCompare = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
};

const parseCookies = (cookieHeader: string | null) => {
  if (!cookieHeader) {
    return new Map<string, string>();
  }

  return new Map(
    cookieHeader
      .split(";")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [name, ...rest] = entry.split("=");
        return [name, decodeURIComponent(rest.join("="))] as const;
      }),
  );
};

const getConfiguredAdminCredentials = (): AdminCredential[] => {
  const credentials: AdminCredential[] = [];
  const seenEmails = new Set<string>();

  const addCredential = (email: string | undefined, password: string | undefined) => {
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !password || seenEmails.has(normalizedEmail)) {
      return;
    }

    credentials.push({
      email: normalizedEmail,
      password,
    });
    seenEmails.add(normalizedEmail);
  };

  addCredential(ADMIN_EMAIL, ADMIN_PASSWORD);

  Object.keys(process.env)
    .map((key) => {
      const match = key.match(/^ADMIN_EMAIL_(\d+)$/);
      return match ? Number(match[1]) : null;
    })
    .filter((index): index is number => index !== null)
    .sort((left, right) => left - right)
    .forEach((index) => {
      addCredential(
        process.env[`ADMIN_EMAIL_${index}`],
        process.env[`ADMIN_PASSWORD_${index}`],
      );
    });

  return credentials;
};

export const matchesAdminCredentials = (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  return getConfiguredAdminCredentials().some(
    (credential) =>
      credential.email === normalizedEmail && credential.password === password,
  );
};

export const createAdminSessionToken = () => {
  const expiry = String(Date.now() + SESSION_MAX_AGE * 1000);
  const signature = signValue(expiry);
  return `${expiry}.${signature}`;
};

export const isValidAdminSessionToken = (token: string | undefined) => {
  if (!token) {
    return false;
  }

  const [expiry, signature] = token.split(".");
  if (!expiry || !signature) {
    return false;
  }

  if (!safeCompare(signature, signValue(expiry))) {
    return false;
  }

  return Number(expiry) > Date.now();
};

export const isAdminRequestAuthenticated = (request: Request) => {
  const token = parseCookies(request.headers.get("cookie")).get(SESSION_COOKIE);
  return isValidAdminSessionToken(token);
};

const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";

export const buildAdminSessionCookie = (token: string) =>
  `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}${secureFlag}`;

export const buildAdminLogoutCookie = () =>
  `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`;
