import { buildAdminLogoutCookie } from "../_lib/admin-session";
import { jsonResponse } from "../_lib/http";

export async function POST() {
  const response = jsonResponse({ authenticated: false });
  response.headers.append("set-cookie", buildAdminLogoutCookie());
  return response;
}
