import { isAdminRequestAuthenticated } from "../_lib/admin-session";
import { jsonResponse } from "../_lib/http";

export async function GET(request: Request) {
  return jsonResponse({
    authenticated: isAdminRequestAuthenticated(request),
  });
}
