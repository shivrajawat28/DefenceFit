import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import { motion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Download,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import {
  evaluateMedicalResult,
  getBodyAreaMeta,
  getQuestionsForExam,
  loadMedicalCmsData,
  type CandidateProfile,
  type FailedQuestion,
  type MedicalCmsData,
} from "../lib/medicalData";

interface ResultLocationState {
  examId?: string;
  answers?: Record<string, string>;
  profile?: CandidateProfile;
}

const formatGender = (value: CandidateProfile["gender"]) =>
  value === "female" ? "Female" : "Male";

const getResolutionMeta = (value: FailedQuestion["resolutionType"]) => {
  if (value === "likely_permanent") {
    return {
      label: "Consider other role or exam",
      badge: "bg-red-100 text-red-700",
      note:
        "This issue is usually difficult to correct for the current exam standard.",
    };
  }

  if (value === "specialist_review") {
    return {
      label: "Needs specialist review",
      badge: "bg-amber-100 text-amber-700",
      note:
        "This point needs proper medical measurement or specialist clearance before you rely on the result.",
    };
  }

  return {
    label: "Can improve and retry",
    badge: "bg-emerald-100 text-emerald-700",
    note:
      "This point often improves after treatment, recovery time, or better conditioning.",
  };
};

export default function ResultDashboard() {
  const location = useLocation();
  const state = (location.state ?? {}) as ResultLocationState;
  const [medicalData, setMedicalData] = useState<MedicalCmsData>(() =>
    loadMedicalCmsData(),
  );
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    setMedicalData(loadMedicalCmsData());
  }, []);

  const selectedExam = useMemo(
    () => medicalData.exams.find((exam) => exam.id === state.examId),
    [medicalData.exams, state.examId],
  );

  const isProfileValid = useMemo(() => {
    if (!state.profile) {
      return false;
    }

    return (
      state.profile.name.trim().length > 0 &&
      Number(state.profile.age) > 0 &&
      Number(state.profile.height) >= 120
    );
  }, [state.profile]);

  const examQuestions = useMemo(
    () =>
      selectedExam && state.profile
        ? getQuestionsForExam(
            selectedExam.id,
            medicalData.questions,
            state.profile.gender,
          )
        : [],
    [medicalData.questions, selectedExam, state.profile],
  );

  const noApplicableQuestions =
    Boolean(selectedExam) && isProfileValid && examQuestions.length === 0;

  const hasValidAnswers = useMemo(() => {
    if (!state.answers || examQuestions.length === 0) {
      return false;
    }

    return examQuestions.every((question) => Boolean(state.answers?.[question.id]));
  }, [examQuestions, state.answers]);

  const result = useMemo(() => {
    if (!hasValidAnswers || !state.answers) {
      return null;
    }

    return evaluateMedicalResult(examQuestions, state.answers);
  }, [examQuestions, hasValidAnswers, state.answers]);

  const scoringMeta = useMemo(() => {
    const totalWeight = examQuestions.reduce(
      (sum, question) => sum + Math.max(1, question.weight),
      0,
    );
    const failedWeight =
      result?.failedItems.reduce((sum, item) => sum + item.weight, 0) ?? 0;

    return {
      totalWeight,
      failedWeight,
      areasCovered: new Set(examQuestions.map((question) => question.bodyArea)).size,
    };
  }, [examQuestions, result]);

  const statusConfig = result
    ? result.verdict === "qualified"
      ? {
          title: "Likely Qualified For This Exam",
          message:
            "Your current answers did not trigger any fail point in this self-check. The official medical board will still make the final decision.",
          color: "#22c55e",
          bg: "bg-green-50",
          border: "border-green-200",
          icon: CheckCircle2,
        }
      : result.hasLikelyPermanentIssue
        ? {
            title: "Currently Not Qualified For This Exam",
            message:
              "One or more failed areas look difficult to correct for this exam standard. Review alternative roles or entries as well.",
            color: "#ef4444",
            bg: "bg-red-50",
            border: "border-red-200",
            icon: ShieldAlert,
          }
        : {
            title: "Currently Not Qualified Yet",
            message:
              "Some failed areas may improve before the official medical if you treat them early and re-check.",
            color: "#f59e0b",
            bg: "bg-amber-50",
            border: "border-amber-200",
            icon: AlertTriangle,
          }
    : null;

  const handleShare = async () => {
    if (!result || !selectedExam) {
      return;
    }

    const shareText = `My ${selectedExam.title} medical readiness score is ${result.score}/100.`;

    if (navigator.share) {
      await navigator.share({
        title: `${selectedExam.title} Medical Readiness`,
        text: shareText,
        url: window.location.href,
      });
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2200);
    }
  };

  if (!selectedExam || !isProfileValid) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="flex min-h-[70vh] items-center justify-center px-4 pt-24 pb-16">
          <Card className="max-w-2xl border-2 p-10 text-center">
            <ShieldAlert className="mx-auto h-14 w-14 text-[#D4AF37]" />
            <h1 className="mt-4 text-3xl font-bold text-[#0B1F3A]">
              Result cannot be generated yet
            </h1>
            <p className="mt-4 text-gray-600">
              Complete the exam flow and required profile details before opening the result page.
            </p>
            <Button asChild className="mt-6 bg-[#2E4A3F] text-white hover:bg-[#0B1F3A]">
              <Link to="/medical-check">
                Start Medical Check
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (noApplicableQuestions) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="flex min-h-[70vh] items-center justify-center px-4 pt-24 pb-16">
          <Card className="max-w-2xl border-2 p-10 text-center">
            <AlertTriangle className="mx-auto h-14 w-14 text-[#D4AF37]" />
            <h1 className="mt-4 text-3xl font-bold text-[#0B1F3A]">
              No matched questions for this flow
            </h1>
            <p className="mt-4 text-gray-600">
              There are no applicable questions available for the{" "}
              <span className="font-semibold">{formatGender(state.profile.gender)}</span>{" "}
              flow in <span className="font-semibold">{selectedExam.title}</span>.
            </p>
            <Button asChild className="mt-6 bg-[#2E4A3F] text-white hover:bg-[#0B1F3A]">
              <Link to={`/medical-check/${selectedExam.id}`}>
                Take Check Again
                <RefreshCw className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!result || !statusConfig) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="flex min-h-[70vh] items-center justify-center px-4 pt-24 pb-16">
          <Card className="max-w-2xl border-2 p-10 text-center">
            <ShieldAlert className="mx-auto h-14 w-14 text-[#D4AF37]" />
            <h1 className="mt-4 text-3xl font-bold text-[#0B1F3A]">
              Result cannot be generated yet
            </h1>
            <p className="mt-4 text-gray-600">
              Answer every applicable question before generating the result.
            </p>
            <Button asChild className="mt-6 bg-[#2E4A3F] text-white hover:bg-[#0B1F3A]">
              <Link to={`/medical-check/${selectedExam.id}`}>
                Complete Medical Check
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />

      <main className="pt-24 pb-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="mb-8 text-center"
          >
            <div
              className={`mx-auto mb-5 inline-flex h-24 w-24 items-center justify-center rounded-full border-2 ${statusConfig.bg} ${statusConfig.border}`}
            >
              <StatusIcon
                className="h-12 w-12"
                style={{ color: statusConfig.color }}
              />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2E4A3F]">
              {selectedExam.title}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#0B1F3A] md:text-4xl">
              {statusConfig.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              {statusConfig.message}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <Card className="mb-8 border-2 p-8 shadow-xl">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Self-check score
                  </p>
                  <div className="mt-2 flex items-end gap-2">
                    <span
                      className="text-6xl font-bold"
                      style={{ color: statusConfig.color }}
                    >
                      {result.score}
                    </span>
                    <span className="pb-2 text-2xl text-gray-400">/100</span>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#0B1F3A]">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        result.verdict === "qualified"
                          ? "bg-green-500"
                          : result.hasLikelyPermanentIssue
                            ? "bg-red-500"
                            : "bg-amber-500"
                      }`}
                    />
                    {result.verdict === "qualified"
                      ? "Qualified for this self-check"
                      : "Not qualified for this self-check"}
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        Scored Questions
                      </p>
                      <p className="mt-2 text-2xl font-bold text-[#0B1F3A]">
                        {examQuestions.length}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-green-50 p-4">
                      <p className="text-xs font-semibold uppercase text-green-700">
                        Passed
                      </p>
                      <p className="mt-2 text-2xl font-bold text-green-700">
                        {result.passedCount}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-red-50 p-4">
                      <p className="text-xs font-semibold uppercase text-red-700">
                        Failed
                      </p>
                      <p className="mt-2 text-2xl font-bold text-red-700">
                        {result.failedCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-600">Readiness meter</span>
                      <span className="font-medium text-[#0B1F3A]">
                        {result.score}%
                      </span>
                    </div>
                    <Progress value={result.score} className="h-3" />
                    <div className="mt-3 flex justify-between text-xs text-gray-500">
                      <span>0</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      Candidate profile
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Name
                        </p>
                        <p className="mt-2 font-semibold text-[#0B1F3A]">
                          {state.profile.name}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Age
                        </p>
                        <p className="mt-2 font-semibold text-[#0B1F3A]">
                          {state.profile.age} years
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Gender
                        </p>
                        <p className="mt-2 font-semibold text-[#0B1F3A]">
                          {formatGender(state.profile.gender)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Height
                        </p>
                        <p className="mt-2 font-semibold text-[#0B1F3A]">
                          {state.profile.height} cm
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      Result basis
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      The score is based only on the {examQuestions.length} applicable
                      medical questions for this exam and selected gender. Name,
                      age, gender, and height are required but are not scored. Any
                      failed medical question marks this self-check as not qualified,
                      while the score shows how close you are overall.
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Total Weight
                        </p>
                        <p className="mt-2 font-semibold text-[#0B1F3A]">
                          {scoringMeta.totalWeight}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Failed Weight
                        </p>
                        <p className="mt-2 font-semibold text-[#0B1F3A]">
                          {scoringMeta.failedWeight}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Body Areas
                        </p>
                        <p className="mt-2 font-semibold text-[#0B1F3A]">
                          {scoringMeta.areasCovered}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.18 }}
            >
              <Card className="h-full border-2 p-6 shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    <ShieldAlert className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0B1F3A]">
                      Fail Summary
                    </h2>
                    <p className="text-sm text-gray-500">
                      Every failed item is listed below.
                    </p>
                  </div>
                </div>

                {result.failedItems.length === 0 ? (
                  <div className="rounded-2xl bg-green-50 p-5 text-center">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                    <p className="mt-3 font-semibold text-green-900">
                      No fail points detected for this exam set
                    </p>
                    <p className="mt-2 text-sm text-green-700">
                      Your answers show a strong medical readiness signal for this exam.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {result.failedItems.map((item) => {
                      const areaMeta = getBodyAreaMeta(item.bodyArea);
                      const resolutionMeta = getResolutionMeta(item.resolutionType);
                      return (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-red-100 bg-red-50 p-4"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                              style={{ backgroundColor: areaMeta.color }}
                            >
                              {areaMeta.label}
                            </span>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-red-700">
                              Impact weight: {item.weight}
                            </span>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${resolutionMeta.badge}`}
                            >
                              {resolutionMeta.label}
                            </span>
                          </div>
                          <p className="mt-3 font-semibold text-[#0B1F3A]">
                            {item.summary}
                          </p>
                          <p className="mt-2 text-sm text-gray-700">
                            <span className="font-medium">Question:</span> {item.question}
                          </p>
                          <p className="mt-1 text-sm text-gray-700">
                            <span className="font-medium">Your answer:</span>{" "}
                            {item.answer}
                          </p>
                          <p className="mt-3 text-sm text-gray-700">
                            <span className="font-medium">Can it improve?</span>{" "}
                            {resolutionMeta.note}
                          </p>
                          <p className="mt-2 text-sm text-gray-700">
                            <span className="font-medium">What to do next:</span>{" "}
                            {item.treatment}
                          </p>
                          {item.alternativeAdvice ? (
                            <p className="mt-2 text-sm text-gray-700">
                              <span className="font-medium">Alternative path:</span>{" "}
                              {item.alternativeAdvice}
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.22 }}
            >
              <Card className="h-full border-2 p-6 shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0B1F3A]">
                      Correction / Review Plan
                    </h2>
                    <p className="text-sm text-gray-500">
                      What you can work on before the official medical.
                    </p>
                  </div>
                </div>

                {result.treatments.length === 0 ? (
                  <div className="rounded-2xl bg-sky-50 p-5">
                    <Sparkles className="h-8 w-8 text-sky-600" />
                    <p className="mt-3 font-semibold text-sky-900">
                      Continue maintaining your current medical condition
                    </p>
                    <p className="mt-2 text-sm text-sky-800">
                      Maintain your routine with regular fitness, sleep, hydration,
                      and periodic medical checks.
                    </p>
                  </div>
                ) : (
                    <div className="space-y-4">
                      {result.treatments.map((treatment, index) => (
                        <div
                          key={treatment}
                          className="rounded-2xl border border-blue-100 bg-blue-50 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-700">
                            {index + 1}
                          </div>
                          <p className="text-sm leading-6 text-blue-950">
                            {treatment}
                          </p>
                        </div>
                      </div>
                    ))}
                    {result.alternativeAdvice.length > 0 ? (
                      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                        <p className="text-sm font-semibold text-amber-900">
                          Alternative role or exam guidance
                        </p>
                        <div className="mt-3 space-y-3">
                          {result.alternativeAdvice.map((advice, index) => (
                            <p
                              key={advice}
                              className="text-sm leading-6 text-amber-900"
                            >
                              {index + 1}. {advice}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.28 }}
          >
            <Card className="mt-6 border-2 p-6 shadow-lg">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#0B1F3A]">
                    Next Step Suggestion
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    {result.verdict === "qualified"
                      ? "Maintain your current condition, keep your reports ready, and remember that the official medical board gives the final decision."
                      : result.hasLikelyPermanentIssue
                        ? "Because one or more failed areas look difficult to correct for this exam, take specialist advice and also explore a different role or exam."
                        : "Work on the failed areas, complete treatment or recovery, and repeat this self-check before your official attempt."}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    className="gap-2 border-2"
                    onClick={() => window.print()}
                  >
                    <Download className="h-4 w-4" />
                    Download / Print
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 border-2"
                    onClick={handleShare}
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    {shareCopied ? "Link Copied" : "Share Result"}
                  </Button>
                  <Button asChild className="gap-2 bg-[#2E4A3F] text-white hover:bg-[#0B1F3A]">
                    <Link to={`/medical-check/${selectedExam.id}`}>
                      <RefreshCw className="h-4 w-4" />
                      Take Test Again
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
