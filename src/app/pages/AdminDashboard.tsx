import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Activity,
  Calendar,
  Edit,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Newspaper,
  Plus,
  Save,
  Shield,
  Trash2,
} from "lucide-react";
import BodyAreaPreview from "../components/BodyAreaPreview";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  BODY_AREAS,
  buildCountdownFromDays,
  getQuestionCountForExam,
  getRemainingDaysFromCountdown,
  loadMedicalCmsData,
  makeId,
  saveMedicalCmsData,
  type AppArticle,
  type BodyArea,
  type CandidateGender,
  type DefenceExam,
  type FeedbackItem,
  type GenderScope,
  type MedicalCmsData,
  type MedicalQuestion,
  type ResolutionType,
  type SponsorItem,
} from "../lib/medicalData";
import {
  clearAdminAuthenticated,
  isAdminAuthenticated,
} from "../lib/adminAuth";

type Tab =
  | "overview"
  | "exams"
  | "questions"
  | "articles"
  | "sponsors"
  | "feedback";

interface ExamDraft {
  title: string;
  tagsText: string;
  image: string;
  countdownDays: string;
}

interface QuestionDraft {
  examId: string;
  question: string;
  helper: string;
  bodyArea: BodyArea;
  gender: GenderScope;
  optionsText: string;
  passingAnswer: string;
  failSummary: string;
  treatment: string;
  resolutionType: ResolutionType;
  alternativeAdvice: string;
  weight: string;
}

interface ArticleDraft {
  title: string;
  image: string;
  link: string;
  category: string;
}

interface SponsorDraft {
  title: string;
  image: string;
  link: string;
}

const getInitialMedicalData = () => loadMedicalCmsData();

const createEmptyExamDraft = (): ExamDraft => ({
  title: "",
  tagsText: "",
  image: "",
  countdownDays: "30",
});

const createEmptyQuestionDraft = (examId = ""): QuestionDraft => ({
  examId,
  question: "",
  helper: "",
  bodyArea: "eyes",
  gender: "all",
  optionsText: "Yes\nNo",
  passingAnswer: "Yes",
  failSummary: "",
  treatment: "",
  resolutionType: "correctable",
  alternativeAdvice: "",
  weight: "10",
});

const createEmptyArticleDraft = (): ArticleDraft => ({
  title: "",
  image: "",
  link: "",
  category: "Guide",
});

const createEmptySponsorDraft = (): SponsorDraft => ({
  title: "",
  image: "",
  link: "",
});

const parseCsv = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const parseOptions = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const formatGenderScope = (value: GenderScope) => {
  if (value === "male") {
    return "Male only";
  }
  if (value === "female") {
    return "Female only";
  }
  return "All candidates";
};

const formatResolutionType = (value: ResolutionType) => {
  if (value === "specialist_review") {
    return "Needs specialist review";
  }
  if (value === "likely_permanent") {
    return "Likely not correctable for this exam";
  }
  return "Can improve and retry";
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const readImageFile = (
  event: ChangeEvent<HTMLInputElement>,
  onLoaded: (value: string) => void,
) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result;
    if (typeof result === "string") {
      onLoaded(result);
    }
  };
  reader.readAsDataURL(file);
  event.target.value = "";
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [medicalData, setMedicalData] = useState<MedicalCmsData>(() =>
    getInitialMedicalData(),
  );
  const [examDraft, setExamDraft] = useState<ExamDraft>(createEmptyExamDraft());
  const [questionDraft, setQuestionDraft] = useState<QuestionDraft>(() =>
    createEmptyQuestionDraft(getInitialMedicalData().exams[0]?.id ?? ""),
  );
  const [articleDraft, setArticleDraft] =
    useState<ArticleDraft>(createEmptyArticleDraft());
  const [sponsorDraft, setSponsorDraft] =
    useState<SponsorDraft>(createEmptySponsorDraft());
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  const [questionExamFilter, setQuestionExamFilter] = useState(
    getInitialMedicalData().exams[0]?.id ?? "",
  );
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate("/", { replace: true });
      return;
    }

    setIsAuthorized(true);
  }, [navigate]);

  useEffect(() => {
    if (!questionExamFilter && medicalData.exams[0]) {
      setQuestionExamFilter(medicalData.exams[0].id);
    }
  }, [medicalData.exams, questionExamFilter]);

  useEffect(() => {
    if (!questionDraft.examId && medicalData.exams[0]) {
      setQuestionDraft((draft) => ({
        ...draft,
        examId: medicalData.exams[0].id,
      }));
    }
  }, [medicalData.exams, questionDraft.examId]);

  const persistData = (nextData: MedicalCmsData) => {
    setMedicalData(nextData);
    saveMedicalCmsData(nextData);
  };

  const parsedQuestionOptions = useMemo(
    () => parseOptions(questionDraft.optionsText),
    [questionDraft.optionsText],
  );

  useEffect(() => {
    if (parsedQuestionOptions.length === 0) {
      if (questionDraft.passingAnswer !== "") {
        setQuestionDraft((draft) => ({ ...draft, passingAnswer: "" }));
      }
      return;
    }

    if (!parsedQuestionOptions.includes(questionDraft.passingAnswer)) {
      setQuestionDraft((draft) => ({
        ...draft,
        passingAnswer: parsedQuestionOptions[0],
      }));
    }
  }, [parsedQuestionOptions, questionDraft.passingAnswer]);

  const filteredQuestions = useMemo(
    () =>
      questionExamFilter
        ? medicalData.questions.filter(
            (question) => question.examId === questionExamFilter,
          )
        : medicalData.questions,
    [medicalData.questions, questionExamFilter],
  );

  const coveredAreas = useMemo(
    () => new Set(medicalData.questions.map((question) => question.bodyArea)).size,
    [medicalData.questions],
  );

  const upcomingExam = useMemo(() => {
    if (medicalData.exams.length === 0) {
      return null;
    }

    return [...medicalData.exams].sort(
      (a, b) =>
        new Date(a.countdownEndsAt).getTime() - new Date(b.countdownEndsAt).getTime(),
    )[0];
  }, [medicalData.exams]);

  const sortedFeedback = useMemo(
    () =>
      [...medicalData.feedback].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [medicalData.feedback],
  );

  const resetExamDraft = () => {
    setEditingExamId(null);
    setExamDraft(createEmptyExamDraft());
  };

  const resetQuestionDraft = (
    examId = questionExamFilter || medicalData.exams[0]?.id || "",
  ) => {
    setEditingQuestionId(null);
    setQuestionDraft(createEmptyQuestionDraft(examId));
  };

  const resetArticleDraft = () => {
    setEditingArticleId(null);
    setArticleDraft(createEmptyArticleDraft());
  };

  const resetSponsorDraft = () => {
    setEditingSponsorId(null);
    setSponsorDraft(createEmptySponsorDraft());
  };

  const handleLogout = () => {
    clearAdminAuthenticated();
    navigate("/", { replace: true });
  };

  const handleSaveExam = () => {
    if (!examDraft.title.trim() || !examDraft.image.trim()) {
      return;
    }

    const nextExam: DefenceExam = {
      id: editingExamId ?? makeId("exam"),
      title: examDraft.title.trim(),
      image: examDraft.image.trim(),
      tags: parseCsv(examDraft.tagsText),
      countdownEndsAt: buildCountdownFromDays(Number(examDraft.countdownDays) || 0),
    };

    const exams = editingExamId
      ? medicalData.exams.map((exam) => (exam.id === editingExamId ? nextExam : exam))
      : [nextExam, ...medicalData.exams];

    persistData({
      ...medicalData,
      exams,
    });

    if (!questionExamFilter) {
      setQuestionExamFilter(nextExam.id);
    }

    if (!questionDraft.examId) {
      setQuestionDraft((draft) => ({ ...draft, examId: nextExam.id }));
    }

    resetExamDraft();
    setActiveTab("exams");
  };

  const handleEditExam = (exam: DefenceExam) => {
    setEditingExamId(exam.id);
    setExamDraft({
      title: exam.title,
      image: exam.image,
      tagsText: exam.tags.join(", "),
      countdownDays: String(getRemainingDaysFromCountdown(exam.countdownEndsAt)),
    });
    setActiveTab("exams");
  };

  const handleDeleteExam = (examId: string) => {
    if (
      !window.confirm(
        "Deleting this exam will also remove all of its questions. Continue?",
      )
    ) {
      return;
    }

    const exams = medicalData.exams.filter((exam) => exam.id !== examId);
    const questions = medicalData.questions.filter(
      (question) => question.examId !== examId,
    );

    persistData({
      ...medicalData,
      exams,
      questions,
    });

    if (questionExamFilter === examId) {
      setQuestionExamFilter(exams[0]?.id ?? "");
    }

    if (questionDraft.examId === examId) {
      resetQuestionDraft(exams[0]?.id ?? "");
    }

    if (editingExamId === examId) {
      resetExamDraft();
    }
  };

  const handleSaveQuestion = () => {
    const options = parseOptions(questionDraft.optionsText);

    if (
      !questionDraft.examId ||
      !questionDraft.question.trim() ||
      !questionDraft.failSummary.trim() ||
      !questionDraft.treatment.trim() ||
      options.length === 0 ||
      !questionDraft.passingAnswer
    ) {
      return;
    }

    const nextQuestion: MedicalQuestion = {
      id: editingQuestionId ?? makeId("question"),
      examId: questionDraft.examId,
      question: questionDraft.question.trim(),
      helper: questionDraft.helper.trim(),
      bodyArea: questionDraft.bodyArea,
      gender: questionDraft.gender,
      options,
      passingAnswers: [questionDraft.passingAnswer],
      failSummary: questionDraft.failSummary.trim(),
      treatment: questionDraft.treatment.trim(),
      resolutionType: questionDraft.resolutionType,
      alternativeAdvice: questionDraft.alternativeAdvice.trim(),
      weight: Math.max(1, Number(questionDraft.weight) || 10),
    };

    const questions = editingQuestionId
      ? medicalData.questions.map((question) =>
          question.id === editingQuestionId ? nextQuestion : question,
        )
      : [nextQuestion, ...medicalData.questions];

    persistData({
      ...medicalData,
      questions,
    });

    setQuestionExamFilter(nextQuestion.examId);
    resetQuestionDraft(nextQuestion.examId);
    setActiveTab("questions");
  };

  const handleEditQuestion = (question: MedicalQuestion) => {
    setEditingQuestionId(question.id);
    setQuestionDraft({
      examId: question.examId,
      question: question.question,
      helper: question.helper ?? "",
      bodyArea: question.bodyArea,
      gender: question.gender,
      optionsText: question.options.join("\n"),
      passingAnswer: question.passingAnswers[0] ?? "",
      failSummary: question.failSummary,
      treatment: question.treatment,
      resolutionType: question.resolutionType ?? "correctable",
      alternativeAdvice: question.alternativeAdvice ?? "",
      weight: String(question.weight),
    });
    setQuestionExamFilter(question.examId);
    setActiveTab("questions");
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!window.confirm("Delete this question?")) {
      return;
    }

    persistData({
      ...medicalData,
      questions: medicalData.questions.filter((question) => question.id !== questionId),
    });

    if (editingQuestionId === questionId) {
      resetQuestionDraft();
    }
  };

  const handleSaveArticle = () => {
    if (
      !articleDraft.title.trim() ||
      !articleDraft.image.trim() ||
      !articleDraft.link.trim()
    ) {
      return;
    }

    const nextArticle: AppArticle = {
      id: editingArticleId ?? makeId("article"),
      title: articleDraft.title.trim(),
      image: articleDraft.image.trim(),
      link: articleDraft.link.trim(),
      category: articleDraft.category.trim() || "Guide",
    };

    const articles = editingArticleId
      ? medicalData.articles.map((article) =>
          article.id === editingArticleId ? nextArticle : article,
        )
      : [nextArticle, ...medicalData.articles];

    persistData({
      ...medicalData,
      articles,
    });

    resetArticleDraft();
    setActiveTab("articles");
  };

  const handleEditArticle = (article: AppArticle) => {
    setEditingArticleId(article.id);
    setArticleDraft({
      title: article.title,
      image: article.image,
      link: article.link,
      category: article.category,
    });
    setActiveTab("articles");
  };

  const handleDeleteArticle = (articleId: string) => {
    if (!window.confirm("Delete this article?")) {
      return;
    }

    persistData({
      ...medicalData,
      articles: medicalData.articles.filter((article) => article.id !== articleId),
    });

    if (editingArticleId === articleId) {
      resetArticleDraft();
    }
  };

  const handleSaveSponsor = () => {
    if (
      !sponsorDraft.title.trim() ||
      !sponsorDraft.image.trim() ||
      !sponsorDraft.link.trim()
    ) {
      return;
    }

    const nextSponsor: SponsorItem = {
      id: editingSponsorId ?? makeId("sponsor"),
      title: sponsorDraft.title.trim(),
      image: sponsorDraft.image.trim(),
      link: sponsorDraft.link.trim(),
    };

    const sponsors = editingSponsorId
      ? medicalData.sponsors.map((sponsor) =>
          sponsor.id === editingSponsorId ? nextSponsor : sponsor,
        )
      : [nextSponsor, ...medicalData.sponsors];

    persistData({
      ...medicalData,
      sponsors,
    });

    resetSponsorDraft();
    setActiveTab("sponsors");
  };

  const handleEditSponsor = (sponsor: SponsorItem) => {
    setEditingSponsorId(sponsor.id);
    setSponsorDraft({
      title: sponsor.title,
      image: sponsor.image,
      link: sponsor.link,
    });
    setActiveTab("sponsors");
  };

  const handleDeleteSponsor = (sponsorId: string) => {
    if (!window.confirm("Delete this sponsor?")) {
      return;
    }

    persistData({
      ...medicalData,
      sponsors: medicalData.sponsors.filter((sponsor) => sponsor.id !== sponsorId),
    });

    if (editingSponsorId === sponsorId) {
      resetSponsorDraft();
    }
  };

  const handleDeleteFeedback = (feedbackId: string) => {
    if (!window.confirm("Remove this feedback entry?")) {
      return;
    }

    persistData({
      ...medicalData,
      feedback: medicalData.feedback.filter((item) => item.id !== feedbackId),
    });
  };

  const sidebarItems: Array<{ id: Tab; label: string; icon: typeof LayoutDashboard }> =
    [
      { id: "overview", icon: LayoutDashboard, label: "Overview" },
      { id: "exams", icon: Calendar, label: "Manage Exams" },
      { id: "questions", icon: FileText, label: "Question Bank" },
      { id: "articles", icon: Newspaper, label: "Articles" },
      { id: "sponsors", icon: ImageIcon, label: "Sponsors" },
      { id: "feedback", icon: MessageSquare, label: "Feedback" },
    ];

  const headerTitle =
    sidebarItems.find((item) => item.id === activeTab)?.label ?? "Admin Panel";

  const previewGender: CandidateGender =
    questionDraft.gender === "female" ? "female" : "male";

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-72 bg-[#0B1F3A] text-white">
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-[#D4AF37]" />
            <div>
              <h1 className="text-lg font-bold">Admin Panel</h1>
              <p className="text-xs text-slate-400">
                Exam, questions, articles, sponsors, feedback
              </p>
            </div>
          </div>
        </div>

        <nav className="space-y-2 p-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors ${
                activeTab === item.id
                  ? "bg-[#D4AF37] text-[#0B1F3A]"
                  : "hover:bg-white/10"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 overflow-auto">
        <header className="border-b border-gray-200 bg-white px-8 py-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold text-[#0B1F3A]">{headerTitle}</h2>
            <div className="rounded-full bg-[#2E4A3F]/10 px-4 py-2 text-sm font-medium text-[#2E4A3F]">
              Exams: {medicalData.exams.length} | Questions: {medicalData.questions.length}{" "}
              | Articles: {medicalData.articles.length} | Sponsors:{" "}
              {medicalData.sponsors.length}
            </div>
          </div>
        </header>

        <main className="p-8">
          {activeTab === "overview" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[
                  {
                    label: "Total Exams",
                    value: medicalData.exams.length,
                    helper: "Home page and medical-check cards",
                    icon: Calendar,
                    color: "bg-blue-100 text-blue-700",
                  },
                  {
                    label: "Total Questions",
                    value: medicalData.questions.length,
                    helper: "Exam and gender-aware checks",
                    icon: FileText,
                    color: "bg-emerald-100 text-emerald-700",
                  },
                  {
                    label: "Body Areas Covered",
                    value: coveredAreas,
                    helper: "Human body preview mapping ready",
                    icon: Activity,
                    color: "bg-amber-100 text-amber-700",
                  },
                  {
                    label: "Articles",
                    value: medicalData.articles.length,
                    helper: "Public guides page",
                    icon: Newspaper,
                    color: "bg-purple-100 text-purple-700",
                  },
                  {
                    label: "Sponsors",
                    value: medicalData.sponsors.length,
                    helper: "Banner cards on home page",
                    icon: ImageIcon,
                    color: "bg-pink-100 text-pink-700",
                  },
                  {
                    label: "Feedback Entries",
                    value: medicalData.feedback.length,
                    helper: upcomingExam
                      ? `Upcoming exam: ${upcomingExam.title} in ${getRemainingDaysFromCountdown(
                          upcomingExam.countdownEndsAt,
                        )} days`
                      : "No upcoming exam added",
                    icon: MessageSquare,
                    color: "bg-slate-100 text-slate-700",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                  >
                    <Card className="border-2 p-6">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}
                      >
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <p className="mt-4 text-sm font-medium text-gray-500">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-3xl font-bold text-[#0B1F3A]">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">{stat.helper}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="max-w-xl border-2 p-6">
                <h3 className="text-lg font-bold text-[#0B1F3A]">
                  Quick actions
                </h3>
                <div className="mt-5 grid grid-cols-1 gap-4">
                  {[
                    { label: "Add new exam", tab: "exams" as Tab, icon: Plus },
                    { label: "Add question", tab: "questions" as Tab, icon: FileText },
                    { label: "Add article", tab: "articles" as Tab, icon: Newspaper },
                    { label: "Add sponsor", tab: "sponsors" as Tab, icon: ImageIcon },
                  ].map((action) => (
                    <Button
                      key={action.label}
                      onClick={() => setActiveTab(action.tab)}
                      variant="outline"
                      className="justify-start gap-3 border-2 py-6"
                    >
                      <action.icon className="h-5 w-5" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          ) : null}

          {activeTab === "exams" ? (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
              <Card className="border-2 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0B1F3A]">
                    {editingExamId ? "Edit Exam" : "Add New Exam"}
                  </h3>
                  {editingExamId ? (
                    <Button variant="ghost" onClick={resetExamDraft}>
                      Cancel
                    </Button>
                  ) : null}
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Exam title
                    </label>
                    <Input
                      value={examDraft.title}
                      onChange={(event) =>
                        setExamDraft((draft) => ({
                          ...draft,
                          title: event.target.value,
                        }))
                      }
                      placeholder="Indian Army NDA"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Tags
                    </label>
                    <Input
                      value={examDraft.tagsText}
                      onChange={(event) =>
                        setExamDraft((draft) => ({
                          ...draft,
                          tagsText: event.target.value,
                        }))
                      }
                      placeholder="Army, NDA, Officer Entry"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Exam image
                    </label>
                    <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[#2E4A3F] hover:text-[#2E4A3F]">
                      <ImageIcon className="h-4 w-4" />
                      Upload image file
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) =>
                          readImageFile(event, (image) =>
                            setExamDraft((draft) => ({ ...draft, image })),
                          )
                        }
                      />
                    </label>
                    <p className="mt-2 text-xs text-gray-500">
                      You can also paste an image URL below.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Image URL (optional)
                    </label>
                    <Input
                      value={examDraft.image}
                      onChange={(event) =>
                        setExamDraft((draft) => ({
                          ...draft,
                          image: event.target.value,
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>

                  {examDraft.image ? (
                    <div className="overflow-hidden rounded-3xl border border-slate-200">
                      <img
                        src={examDraft.image}
                        alt="Exam preview"
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Countdown days remaining
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={examDraft.countdownDays}
                      onChange={(event) =>
                        setExamDraft((draft) => ({
                          ...draft,
                          countdownDays: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <Button
                    onClick={handleSaveExam}
                    className="w-full gap-2 bg-[#2E4A3F] text-white hover:bg-[#0B1F3A]"
                  >
                    <Save className="h-4 w-4" />
                    {editingExamId ? "Update Exam" : "Save Exam"}
                  </Button>
                </div>
              </Card>

              <Card className="border-2 p-6">
                <h3 className="text-lg font-bold text-[#0B1F3A]">
                  Live exams on website
                </h3>

                <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {medicalData.exams.map((exam) => (
                    <div
                      key={exam.id}
                      className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={exam.image}
                          alt={exam.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                        <div className="absolute right-4 bottom-4 left-4">
                          <h4 className="text-xl font-bold text-white">
                            {exam.title}
                          </h4>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {exam.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0B1F3A]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>
                            {getQuestionCountForExam(exam.id, medicalData.questions)} questions
                          </span>
                          <span>
                            {getRemainingDaysFromCountdown(exam.countdownEndsAt)} days left
                          </span>
                        </div>

                        <div className="mt-5 flex gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => handleEditExam(exam)}
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 text-red-600"
                            onClick={() => handleDeleteExam(exam.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {medicalData.exams.length === 0 ? (
                    <div className="xl:col-span-2 rounded-3xl border-2 border-dashed border-slate-200 p-8 text-center text-gray-500">
                      No exams have been added yet.
                    </div>
                  ) : null}
                </div>
              </Card>
            </div>
          ) : null}

          {activeTab === "questions" ? (
            medicalData.exams.length === 0 ? (
              <Card className="border-2 p-10 text-center">
                <Calendar className="mx-auto h-10 w-10 text-[#D4AF37]" />
                <h3 className="mt-4 text-2xl font-bold text-[#0B1F3A]">
                  Add exam before questions
                </h3>
                <Button
                  onClick={() => setActiveTab("exams")}
                  className="mt-6 bg-[#2E4A3F] text-white hover:bg-[#0B1F3A]"
                >
                  Go to Exams
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
                  <Card className="border-2 p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <h3 className="text-lg font-bold text-[#0B1F3A]">
                        {editingQuestionId ? "Edit Question" : "Add New Question"}
                      </h3>
                      {editingQuestionId ? (
                        <Button variant="ghost" onClick={() => resetQuestionDraft()}>
                          Cancel edit
                        </Button>
                      ) : null}
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Exam
                        </label>
                        <select
                          value={questionDraft.examId}
                          onChange={(event) =>
                            setQuestionDraft((draft) => ({
                              ...draft,
                              examId: event.target.value,
                            }))
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
                        >
                          {medicalData.exams.map((exam) => (
                            <option key={exam.id} value={exam.id}>
                              {exam.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Applies to
                        </label>
                        <select
                          value={questionDraft.gender}
                          onChange={(event) =>
                            setQuestionDraft((draft) => ({
                              ...draft,
                              gender: event.target.value as GenderScope,
                            }))
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
                        >
                          <option value="all">All candidates</option>
                          <option value="male">Male only</option>
                          <option value="female">Female only</option>
                        </select>
                      </div>

                      <div className="lg:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Body area
                        </label>
                        <select
                          value={questionDraft.bodyArea}
                          onChange={(event) =>
                            setQuestionDraft((draft) => ({
                              ...draft,
                              bodyArea: event.target.value as BodyArea,
                            }))
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
                        >
                          {BODY_AREAS.map((area) => (
                            <option key={area.value} value={area.value}>
                              {area.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="lg:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Question
                        </label>
                        <Input
                          value={questionDraft.question}
                          onChange={(event) =>
                            setQuestionDraft((draft) => ({
                              ...draft,
                              question: event.target.value,
                            }))
                          }
                          placeholder="Can you hear whispered speech clearly from a distance?"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Self-check hint
                        </label>
                        <Textarea
                          rows={3}
                          value={questionDraft.helper}
                          onChange={(event) =>
                            setQuestionDraft((draft) => ({
                              ...draft,
                              helper: event.target.value,
                            }))
                          }
                          placeholder="Add a simple hint so the candidate knows how to self-check this point."
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Options (one per line)
                        </label>
                        <Textarea
                          rows={5}
                          value={questionDraft.optionsText}
                          onChange={(event) =>
                            setQuestionDraft((draft) => ({
                              ...draft,
                              optionsText: event.target.value,
                            }))
                          }
                          placeholder={"Yes, clearly\nSome difficulty\nNo"}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Passing answer
                        </label>
                        <select
                          value={questionDraft.passingAnswer}
                          onChange={(event) =>
                            setQuestionDraft((draft) => ({
                              ...draft,
                              passingAnswer: event.target.value,
                            }))
                          }
                          className="mb-4 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
                        >
                          {parsedQuestionOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Fail impact weight
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="50"
                          value={questionDraft.weight}
                          onChange={(event) =>
                            setQuestionDraft((draft) => ({
                              ...draft,
                              weight: event.target.value,
                            }))
                          }
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          If candidate fails
                        </label>
                        <select
                          value={questionDraft.resolutionType}
                          onChange={(event) =>
                            setQuestionDraft((draft) => ({
                              ...draft,
                              resolutionType: event.target.value as ResolutionType,
                            }))
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
                        >
                          <option value="correctable">Can improve and retry</option>
                          <option value="specialist_review">Needs specialist review</option>
                          <option value="likely_permanent">
                            Likely not correctable for this exam
                          </option>
                        </select>
                      </div>

                      <div className="lg:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Fail summary
                        </label>
                        <Textarea
                          rows={3}
                          value={questionDraft.failSummary}
                          onChange={(event) =>
                            setQuestionDraft((draft) => ({
                              ...draft,
                              failSummary: event.target.value,
                            }))
                          }
                          placeholder="Hearing clarity may affect Navy SSR medical clearance."
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Treatment / correction guidance
                        </label>
                        <Textarea
                          rows={4}
                          value={questionDraft.treatment}
                          onChange={(event) =>
                            setQuestionDraft((draft) => ({
                              ...draft,
                              treatment: event.target.value,
                            }))
                          }
                          placeholder="Schedule ENT review, complete audiometry, and resolve infection or wax issues."
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Alternative advice (optional)
                        </label>
                        <Textarea
                          rows={3}
                          value={questionDraft.alternativeAdvice}
                          onChange={(event) =>
                            setQuestionDraft((draft) => ({
                              ...draft,
                              alternativeAdvice: event.target.value,
                            }))
                          }
                          placeholder="If this issue is not realistically fixable, suggest another role or exam path."
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveQuestion}
                      className="mt-6 gap-2 bg-[#2E4A3F] text-white hover:bg-[#0B1F3A]"
                    >
                      <Save className="h-4 w-4" />
                      {editingQuestionId ? "Update Question" : "Save Question"}
                    </Button>
                  </Card>

                  <div className="xl:sticky xl:top-28 space-y-4">
                    <BodyAreaPreview
                      activeArea={questionDraft.bodyArea}
                      bodyGender={previewGender}
                      title="Body Preview"
                      description="Selected body area"
                      size="compact"
                      showBadge={false}
                    />
                    <Card className="border-2 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Question scope
                      </p>
                      <p className="mt-2 font-semibold text-[#0B1F3A]">
                        {formatGenderScope(questionDraft.gender)}
                      </p>
                    </Card>
                  </div>
                </div>

                <Card className="border-2 p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg font-bold text-[#0B1F3A]">
                      Existing Questions
                    </h3>

                    <select
                      value={questionExamFilter}
                      onChange={(event) => setQuestionExamFilter(event.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none md:w-[280px]"
                    >
                      {medicalData.exams.map((exam) => (
                        <option key={exam.id} value={exam.id}>
                          {exam.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-6 space-y-4">
                    {filteredQuestions.map((question) => {
                      const areaMeta = BODY_AREAS.find(
                        (area) => area.value === question.bodyArea,
                      );
                      return (
                        <div
                          key={question.id}
                          className="rounded-3xl border border-slate-200 p-5"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex-1">
                              <div className="flex flex-wrap gap-2">
                                <span
                                  className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                                  style={{
                                    backgroundColor: areaMeta?.color ?? "#64748b",
                                  }}
                                >
                                  {areaMeta?.label ?? question.bodyArea}
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                  {formatGenderScope(question.gender)}
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                  Pass: {question.passingAnswers.join(", ")}
                                </span>
                                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                  Weight: {question.weight}
                                </span>
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                  {formatResolutionType(
                                    question.resolutionType ?? "correctable",
                                  )}
                                </span>
                              </div>

                              <h4 className="mt-4 text-lg font-bold text-[#0B1F3A]">
                                {question.question}
                              </h4>
                              {question.helper ? (
                                <p className="mt-2 text-sm text-gray-600">
                                  Hint: {question.helper}
                                </p>
                              ) : null}
                              <p className="mt-3 text-sm text-slate-700">
                                <span className="font-semibold">Fail summary:</span>{" "}
                                {question.failSummary}
                              </p>
                              <p className="mt-2 text-sm text-slate-700">
                                <span className="font-semibold">Treatment:</span>{" "}
                                {question.treatment}
                              </p>
                              {question.alternativeAdvice ? (
                                <p className="mt-2 text-sm text-slate-700">
                                  <span className="font-semibold">
                                    Alternative advice:
                                  </span>{" "}
                                  {question.alternativeAdvice}
                                </p>
                              ) : null}
                            </div>

                            <div className="flex gap-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                                onClick={() => handleEditQuestion(question)}
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2 text-red-600"
                                onClick={() => handleDeleteQuestion(question.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {filteredQuestions.length === 0 ? (
                      <div className="rounded-3xl border-2 border-dashed border-slate-200 p-8 text-center text-gray-500">
                        No questions have been added for this exam.
                      </div>
                    ) : null}
                  </div>
                </Card>
              </div>
            )
          ) : null}

          {activeTab === "articles" ? (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
              <Card className="border-2 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0B1F3A]">
                    {editingArticleId ? "Edit Article" : "Add New Article"}
                  </h3>
                  {editingArticleId ? (
                    <Button variant="ghost" onClick={resetArticleDraft}>
                      Cancel
                    </Button>
                  ) : null}
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Article image
                    </label>
                    <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[#2E4A3F] hover:text-[#2E4A3F]">
                      <ImageIcon className="h-4 w-4" />
                      Upload image file
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) =>
                          readImageFile(event, (image) =>
                            setArticleDraft((draft) => ({ ...draft, image })),
                          )
                        }
                      />
                    </label>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Image URL (optional)
                    </label>
                    <Input
                      value={articleDraft.image}
                      onChange={(event) =>
                        setArticleDraft((draft) => ({
                          ...draft,
                          image: event.target.value,
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Article title
                    </label>
                    <Input
                      value={articleDraft.title}
                      onChange={(event) =>
                        setArticleDraft((draft) => ({
                          ...draft,
                          title: event.target.value,
                        }))
                      }
                      placeholder="How to improve physical fitness for NDA"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <Input
                      value={articleDraft.category}
                      onChange={(event) =>
                        setArticleDraft((draft) => ({
                          ...draft,
                          category: event.target.value,
                        }))
                      }
                      placeholder="Guide"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Article link
                    </label>
                    <Input
                      value={articleDraft.link}
                      onChange={(event) =>
                        setArticleDraft((draft) => ({
                          ...draft,
                          link: event.target.value,
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>

                  {articleDraft.image ? (
                    <div className="overflow-hidden rounded-3xl border border-slate-200">
                      <img
                        src={articleDraft.image}
                        alt="Article preview"
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <Button
                    onClick={handleSaveArticle}
                    className="w-full gap-2 bg-[#2E4A3F] text-white hover:bg-[#0B1F3A]"
                  >
                    <Save className="h-4 w-4" />
                    {editingArticleId ? "Update Article" : "Save Article"}
                  </Button>
                </div>
              </Card>

              <Card className="border-2 p-6">
                <h3 className="text-lg font-bold text-[#0B1F3A]">
                  Live articles on website
                </h3>

                <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {medicalData.articles.map((article) => (
                    <div
                      key={article.id}
                      className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm"
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-44 w-full object-cover"
                      />
                      <div className="p-5">
                        <span className="rounded-full bg-[#D4AF37]/20 px-3 py-1 text-xs font-semibold text-[#0B1F3A]">
                          {article.category}
                        </span>
                        <h4 className="mt-4 text-lg font-bold text-[#0B1F3A]">
                          {article.title}
                        </h4>
                        <p className="mt-2 line-clamp-1 text-sm text-gray-600">
                          {article.link}
                        </p>

                        <div className="mt-5 flex gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => handleEditArticle(article)}
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 text-red-600"
                            onClick={() => handleDeleteArticle(article.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {medicalData.articles.length === 0 ? (
                    <div className="xl:col-span-2 rounded-3xl border-2 border-dashed border-slate-200 p-8 text-center text-gray-500">
                      No articles have been added yet.
                    </div>
                  ) : null}
                </div>
              </Card>
            </div>
          ) : null}

          {activeTab === "sponsors" ? (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
              <Card className="border-2 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0B1F3A]">
                    {editingSponsorId ? "Edit Sponsor" : "Add New Sponsor"}
                  </h3>
                  {editingSponsorId ? (
                    <Button variant="ghost" onClick={resetSponsorDraft}>
                      Cancel
                    </Button>
                  ) : null}
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Sponsor banner
                    </label>
                    <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[#2E4A3F] hover:text-[#2E4A3F]">
                      <ImageIcon className="h-4 w-4" />
                      Upload banner file
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) =>
                          readImageFile(event, (image) =>
                            setSponsorDraft((draft) => ({ ...draft, image })),
                          )
                        }
                      />
                    </label>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Image URL (optional)
                    </label>
                    <Input
                      value={sponsorDraft.image}
                      onChange={(event) =>
                        setSponsorDraft((draft) => ({
                          ...draft,
                          image: event.target.value,
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Sponsor title
                    </label>
                    <Input
                      value={sponsorDraft.title}
                      onChange={(event) =>
                        setSponsorDraft((draft) => ({
                          ...draft,
                          title: event.target.value,
                        }))
                      }
                      placeholder="Top Defence Coaching Brand"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Sponsor link
                    </label>
                    <Input
                      value={sponsorDraft.link}
                      onChange={(event) =>
                        setSponsorDraft((draft) => ({
                          ...draft,
                          link: event.target.value,
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>

                  {sponsorDraft.image ? (
                    <div className="overflow-hidden rounded-3xl border border-slate-200">
                      <img
                        src={sponsorDraft.image}
                        alt="Sponsor preview"
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <Button
                    onClick={handleSaveSponsor}
                    className="w-full gap-2 bg-[#2E4A3F] text-white hover:bg-[#0B1F3A]"
                  >
                    <Save className="h-4 w-4" />
                    {editingSponsorId ? "Update Sponsor" : "Save Sponsor"}
                  </Button>
                </div>
              </Card>

              <Card className="border-2 p-6">
                <h3 className="text-lg font-bold text-[#0B1F3A]">
                  Live sponsors on website
                </h3>

                <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {medicalData.sponsors.map((sponsor) => (
                    <div
                      key={sponsor.id}
                      className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm"
                    >
                      <img
                        src={sponsor.image}
                        alt={sponsor.title}
                        className="h-44 w-full object-cover"
                      />
                      <div className="p-5">
                        <h4 className="text-lg font-bold text-[#0B1F3A]">
                          {sponsor.title}
                        </h4>
                        <p className="mt-2 line-clamp-1 text-sm text-gray-600">
                          {sponsor.link}
                        </p>

                        <div className="mt-5 flex gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => handleEditSponsor(sponsor)}
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 text-red-600"
                            onClick={() => handleDeleteSponsor(sponsor.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {medicalData.sponsors.length === 0 ? (
                    <div className="xl:col-span-2 rounded-3xl border-2 border-dashed border-slate-200 p-8 text-center text-gray-500">
                      No sponsors have been added yet.
                    </div>
                  ) : null}
                </div>
              </Card>
            </div>
          ) : null}

          {activeTab === "feedback" ? (
            <div className="space-y-6">
              <Card className="border-2 p-6">
                <h3 className="text-lg font-bold text-[#0B1F3A]">
                  Website Feedback Inbox
                </h3>
              </Card>

              {sortedFeedback.length === 0 ? (
                <Card className="border-2 border-dashed p-10 text-center text-gray-500">
                  No feedback has been received yet.
                </Card>
              ) : (
                <div className="space-y-4">
                  {sortedFeedback.map((item: FeedbackItem) => (
                    <Card key={item.id} className="border-2 p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="text-lg font-bold text-[#0B1F3A]">
                              {item.name}
                            </p>
                            {item.email ? (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {item.email}
                              </span>
                            ) : (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                No email shared
                              </span>
                            )}
                            <span className="rounded-full bg-[#D4AF37]/20 px-3 py-1 text-xs font-semibold text-[#0B1F3A]">
                              {formatDateTime(item.createdAt)}
                            </span>
                          </div>
                          <p className="mt-4 text-sm leading-7 text-gray-700">
                            {item.message}
                          </p>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 text-red-600"
                          onClick={() => handleDeleteFeedback(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
