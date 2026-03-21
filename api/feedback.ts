import { isAdminRequestAuthenticated } from "./_lib/admin-session";
import { createFeedbackInStore, deleteFeedbackFromStore } from "./_lib/cms-store";
import { errorResponse, jsonResponse, parseJsonBody } from "./_lib/http";

export async function POST(request: Request) {
  const body = await parseJsonBody<{
    name?: string;
    email?: string;
    message?: string;
  }>(request);

  if (!body?.message?.trim()) {
    return errorResponse("Feedback message is required.", 400);
  }

  try {
    const feedback = await createFeedbackInStore({
      name: body.name,
      email: body.email,
      message: body.message,
    });

    return jsonResponse({ feedback }, { status: 201 });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to save feedback.",
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return errorResponse("Unauthorized", 401);
  }

  const url = new URL(request.url);
  const feedbackId = url.searchParams.get("id");
  if (!feedbackId) {
    return errorResponse("Missing feedback id.", 400);
  }

  try {
    await deleteFeedbackFromStore(feedbackId);
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to delete feedback.",
    );
  }
}
