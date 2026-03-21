import {
  createDefaultMedicalCmsData,
  mergeSiteContentWithFeedback,
  normalizeMedicalCmsData,
  toSiteContentData,
  type FeedbackItem,
  type MedicalCmsData,
} from "../../src/app/lib/medicalData.js";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SITE_CONTENT_ROW_ID = "main";

interface SiteContentRow {
  id: string;
  exams: unknown;
  questions: unknown;
  articles: unknown;
  sponsors: unknown;
  updated_at?: string;
}

interface FeedbackRow {
  id: string;
  name?: string;
  email?: string;
  message: string;
  created_at: string;
}

const hasSupabaseConfig = () =>
  Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

const createSupabaseHeaders = (extra?: HeadersInit) => ({
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
  ...(extra ?? {}),
});

const defaultCmsData = createDefaultMedicalCmsData();

const mapFeedbackRow = (row: FeedbackRow): FeedbackItem => ({
  id: String(row.id),
  name: row.name?.trim() || "Anonymous",
  email: row.email?.trim() || "",
  message: String(row.message),
  createdAt: String(row.created_at),
});

const requestSupabase = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  if (!hasSupabaseConfig()) {
    throw new Error(
      "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const response = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}${path}`, {
    ...init,
    headers: createSupabaseHeaders(init.headers),
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as T) : (null as T);

  if (!response.ok) {
    throw new Error(
      `Supabase request failed with status ${response.status}: ${text || response.statusText}`,
    );
  }

  return payload;
};

const listFeedbackRows = async () => {
  const rows = await requestSupabase<FeedbackRow[]>(
    "/rest/v1/feedback_entries?select=id,name,email,message,created_at&order=created_at.desc",
  );

  return Array.isArray(rows) ? rows.map(mapFeedbackRow) : [];
};

const getOrSeedSiteContent = async () => {
  const rows = await requestSupabase<SiteContentRow[]>(
    `/rest/v1/site_content?id=eq.${SITE_CONTENT_ROW_ID}&select=id,exams,questions,articles,sponsors,updated_at`,
  );

  if (Array.isArray(rows) && rows[0]) {
    return rows[0];
  }

  const siteContent = toSiteContentData(defaultCmsData);
  const seeded = await requestSupabase<SiteContentRow[]>(
    "/rest/v1/site_content",
    {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify([
        {
          id: SITE_CONTENT_ROW_ID,
          ...siteContent,
          updated_at: new Date().toISOString(),
        },
      ]),
    },
  );

  return seeded[0];
};

export const getCmsDataFromStore = async (includeFeedback = false) => {
  if (!hasSupabaseConfig()) {
    return includeFeedback
      ? defaultCmsData
      : {
          ...defaultCmsData,
          feedback: [],
        };
  }

  const [contentRow, feedback] = await Promise.all([
    getOrSeedSiteContent(),
    includeFeedback ? listFeedbackRows() : Promise.resolve([]),
  ]);

  const normalizedContent = normalizeMedicalCmsData({
    exams: contentRow.exams,
    questions: contentRow.questions,
    articles: contentRow.articles,
    sponsors: contentRow.sponsors,
    feedback: [],
  });

  return mergeSiteContentWithFeedback(toSiteContentData(normalizedContent), feedback);
};

export const saveCmsDataToStore = async (data: MedicalCmsData) => {
  const normalized = normalizeMedicalCmsData(data);
  const siteContent = toSiteContentData(normalized);

  await requestSupabase(
    "/rest/v1/site_content",
    {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify([
        {
          id: SITE_CONTENT_ROW_ID,
          ...siteContent,
          updated_at: new Date().toISOString(),
        },
      ]),
    },
  );

  const feedback = await listFeedbackRows();
  return mergeSiteContentWithFeedback(siteContent, feedback);
};

export const createFeedbackInStore = async (input: {
  name?: string;
  email?: string;
  message: string;
}) => {
  const row = {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? `feedback-${crypto.randomUUID()}`
        : `feedback-${Date.now()}`,
    name: input.name?.trim() || "Anonymous",
    email: input.email?.trim() || "",
    message: input.message.trim(),
    created_at: new Date().toISOString(),
  };

  const inserted = await requestSupabase<FeedbackRow[]>(
    "/rest/v1/feedback_entries",
    {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify([row]),
    },
  );

  return mapFeedbackRow(inserted[0] ?? row);
};

export const deleteFeedbackFromStore = async (feedbackId: string) => {
  await requestSupabase(
    `/rest/v1/feedback_entries?id=eq.${encodeURIComponent(feedbackId)}`,
    {
      method: "DELETE",
      headers: {
        Prefer: "return=minimal",
      },
    },
  );
};
