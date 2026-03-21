import {
  loadMedicalCmsData,
  normalizeMedicalCmsData,
  saveMedicalCmsData,
  type FeedbackItem,
  type MedicalCmsData,
} from "./medicalData";

const parseApiPayload = async (response: Response) => {
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message =
      typeof payload?.error === "string" ? payload.error : "Request failed.";
    throw new Error(message);
  }

  return payload as Record<string, unknown>;
};

export const fetchMedicalCmsDataFromApi = async (options?: {
  includeFeedback?: boolean;
}) => {
  try {
    const query = options?.includeFeedback ? "?feedback=1" : "";
    const response = await fetch(`/api/cms${query}`, {
      credentials: "include",
    });
    const payload = await parseApiPayload(response);
    const data = normalizeMedicalCmsData(
      (payload.data as Partial<MedicalCmsData> | undefined) ?? null,
    );
    saveMedicalCmsData(data);
    return data;
  } catch {
    return loadMedicalCmsData();
  }
};

export const saveMedicalCmsDataToApi = async (data: MedicalCmsData) => {
  const response = await fetch("/api/cms", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ data }),
  });

  const payload = await parseApiPayload(response);
  const nextData = normalizeMedicalCmsData(
    (payload.data as Partial<MedicalCmsData> | undefined) ?? null,
  );
  saveMedicalCmsData(nextData);
  return nextData;
};

export const submitFeedbackToApi = async (input: {
  name?: string;
  email?: string;
  message: string;
}) => {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = await parseApiPayload(response);
  return payload.feedback as FeedbackItem;
};

export const deleteFeedbackFromApi = async (feedbackId: string) => {
  const response = await fetch(
    `/api/feedback?id=${encodeURIComponent(feedbackId)}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  await parseApiPayload(response);
};
