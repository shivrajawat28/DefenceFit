import { isAdminRequestAuthenticated } from "../_lib/admin-session.js";
import { jsonResponse } from "../_lib/http.js";

export async function GET(request: Request) {
  return jsonResponse({
    authenticated: isAdminRequestAuthenticated(request),
  });
}
