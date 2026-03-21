import { buildAdminLogoutCookie } from "../_lib/admin-session.js";
import { jsonResponse } from "../_lib/http.js";

export async function POST() {
  const response = jsonResponse({ authenticated: false });
  response.headers.append("set-cookie", buildAdminLogoutCookie());
  return response;
}
