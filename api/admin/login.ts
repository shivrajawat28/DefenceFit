import {
  buildAdminSessionCookie,
  createAdminSessionToken,
  matchesAdminCredentials,
} from "../_lib/admin-session.js";
import { errorResponse, jsonResponse, parseJsonBody } from "../_lib/http.js";

export async function POST(request: Request) {
  const body = await parseJsonBody<{ email?: string; password?: string }>(request);
  if (!body?.email || !body.password) {
    return errorResponse("Email and password are required.", 400);
  }

  if (!matchesAdminCredentials(body.email, body.password)) {
    return errorResponse("Invalid admin credentials.", 401);
  }

  const response = jsonResponse({ authenticated: true });
  response.headers.append(
    "set-cookie",
    buildAdminSessionCookie(createAdminSessionToken()),
  );
  return response;
}
