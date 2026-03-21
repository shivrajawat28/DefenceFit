import { isAdminRequestAuthenticated } from "./_lib/admin-session";
import { getCmsDataFromStore, saveCmsDataToStore } from "./_lib/cms-store";
import { errorResponse, jsonResponse, parseJsonBody } from "./_lib/http";
import { normalizeMedicalCmsData } from "../src/app/lib/medicalData";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const includeFeedback = url.searchParams.get("feedback") === "1";
    const data = await getCmsDataFromStore(includeFeedback);
    return jsonResponse({ data });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to load CMS data.",
    );
  }
}

export async function PUT(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return errorResponse("Unauthorized", 401);
  }

  const body = await parseJsonBody<{ data?: unknown }>(request);
  if (!body?.data) {
    return errorResponse("Missing CMS payload.", 400);
  }

  try {
    const data = normalizeMedicalCmsData(body.data as never);
    const saved = await saveCmsDataToStore(data);
    return jsonResponse({ data: saved });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to save CMS data.",
    );
  }
}
