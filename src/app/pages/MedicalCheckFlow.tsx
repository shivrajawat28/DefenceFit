import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  HelpCircle,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BodyAreaPreview from "../components/BodyAreaPreview";
import AfcatVisionStandardsCard from "../components/AfcatVisionStandardsCard";
import AfcatWeightChartCard from "../components/AfcatWeightChartCard";
import ExamSelectionGrid from "../components/ExamSelectionGrid";
import NdaVisionStandardsCard from "../components/NdaVisionStandardsCard";
import NdaWeightChartCard from "../components/NdaWeightChartCard";
import NavyVisionStandardsCard from "../components/NavyVisionStandardsCard";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import {
  getBodyAreaMeta,
  getQuestionsForExam,
  loadMedicalCmsData,
  type CandidateGender,
  type MedicalCmsData,
} from "../lib/medicalData";
import { fetchMedicalCmsDataFromApi } from "../lib/cmsApi";

interface CandidateProfileForm {
  name: string;
  age: string;
  gender: CandidateGender | "";
  height: number;
}

const MANDATORY_STEPS = [
  "candidate-name",
  "candidate-age",
  "candidate-gender",
  "candidate-height",
] as const;

export default function MedicalCheckFlow() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [medicalData, setMedicalData] = useState<MedicalCmsData>(() =>
    loadMedicalCmsData(),
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [profile, setProfile] = useState<CandidateProfileForm>({
    name: "",
    age: "",
    gender: "",
    height: 170,
  });

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      const data = await fetchMedicalCmsDataFromApi();
      if (isMounted) {
        setMedicalData(data);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setCurrentStep(0);
    setAnswers({});
    setProfile({
      name: "",
      age: "",
      gender: "",
      height: 170,
    });
  }, [examId]);

  const selectedExam = useMemo(
    () => medicalData.exams.find((exam) => exam.id === examId),
    [medicalData.exams, examId],
  );

  const applicableQuestions = useMemo(
    () =>
      selectedExam
        ? getQuestionsForExam(
            selectedExam.id,
            medicalData.questions,
            profile.gender || undefined,
          )
        : [],
    [medicalData.questions, profile.gender, selectedExam],
  );

  const totalSteps = MANDATORY_STEPS.length + applicableQuestions.length;
  const isProfileStep = currentStep < MANDATORY_STEPS.length;
  const currentExamQuestion = isProfileStep
    ? null
    : applicableQuestions[currentStep - MANDATORY_STEPS.length];
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  const resolvedPreviewArea = isProfileStep
    ? currentStep === 3
      ? "height_weight"
      : "general"
    : currentExamQuestion?.bodyArea ?? "general";
  const previewMeta = getBodyAreaMeta(resolvedPreviewArea);
  const previewGender =
    !isProfileStep && currentExamQuestion?.gender && currentExamQuestion.gender !== "all"
      ? currentExamQuestion.gender
      : profile.gender || "male";
  const showAfcatWeightChart =
    !isProfileStep && currentExamQuestion?.id === "afcat-q-weight-chart";
  const showAfcatVisionChart =
    !isProfileStep && currentExamQuestion?.id === "afcat-q-vision-standard";
  const showNdaWeightChart =
    !isProfileStep &&
    ["nda-q-weight-chart", "nda-q-athlete-exception"].includes(
      currentExamQuestion?.id ?? "",
    );
  const showNdaVisionChart =
    !isProfileStep && currentExamQuestion?.id === "nda-q-vision-standard";
  const showNavyVisionChart =
    !isProfileStep && currentExamQuestion?.id === "navy-q-vision-standard";

  const handleQuestionAnswer = (answer: string) => {
    if (!currentExamQuestion) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [currentExamQuestion.id]: answer,
    }));
  };

  const isCurrentStepComplete = () => {
    if (!isProfileStep) {
      return Boolean(currentExamQuestion && answers[currentExamQuestion.id]);
    }

    switch (currentStep) {
      case 0:
        return profile.name.trim().length > 0;
      case 1:
        return Number(profile.age) > 0;
      case 2:
        return Boolean(profile.gender);
      case 3:
        return profile.height >= 120;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isCurrentStepComplete()) {
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }

    if (selectedExam && profile.gender) {
      navigate("/results", {
        state: {
          examId: selectedExam.id,
          answers,
          profile,
        },
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
      return;
    }

    navigate("/medical-check");
  };

  if (!examId) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24 pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#0B1F3A]">
                <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                Choose exam first, then start the right medical questions
              </div>
              <h1 className="text-4xl font-bold text-[#0B1F3A] md:text-5xl">
                Select Exam For Medical Check
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                Choose an exam to begin your medical screening.
              </p>
            </motion.div>

            <ExamSelectionGrid
              exams={medicalData.exams}
              emptyTitle="No exams available yet"
              emptyDescription="Exams will appear here once they are added."
              layout="stack"
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!selectedExam) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="flex min-h-[70vh] items-center justify-center px-4 pt-24 pb-16">
          <Card className="max-w-xl border-2 p-10 text-center">
            <h1 className="text-3xl font-bold text-[#0B1F3A]">Exam not found</h1>
            <p className="mt-3 text-gray-600">
              The selected exam is not available.
            </p>
            <Button asChild className="mt-6 bg-[#2E4A3F] text-white hover:bg-[#0B1F3A]">
              <Link to="/medical-check">Back to Exam Selection</Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (medicalData.questions.filter((question) => question.examId === selectedExam.id).length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="flex min-h-[70vh] items-center justify-center px-4 pt-24 pb-16">
          <Card className="max-w-2xl border-2 p-10 text-center">
            <ClipboardList className="mx-auto h-12 w-12 text-[#D4AF37]" />
            <h1 className="mt-4 text-3xl font-bold text-[#0B1F3A]">
              Questions not added yet
            </h1>
            <p className="mt-3 text-gray-600">
              No questions are currently available for{" "}
              <span className="font-semibold">{selectedExam.title}</span>.
            </p>
            <Button asChild className="mt-6 bg-[#2E4A3F] text-white hover:bg-[#0B1F3A]">
              <Link to="/medical-check">Choose Another Exam</Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const renderProfileStep = () => {
    if (currentStep === 0) {
      return (
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#2E4A3F]/10 px-3 py-2 text-sm font-medium text-[#2E4A3F]">
            <UserRound className="h-4 w-4" />
            Mandatory Profile Question
          </div>
          <h2 className="text-2xl font-bold text-[#0B1F3A] md:text-3xl">
            What is your name?
          </h2>
          <Input
            value={profile.name}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter your full name"
            className="h-12 border-2"
          />
        </div>
      );
    }

    if (currentStep === 1) {
      return (
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#2E4A3F]/10 px-3 py-2 text-sm font-medium text-[#2E4A3F]">
            <UserRound className="h-4 w-4" />
            Mandatory Profile Question
          </div>
          <h2 className="text-2xl font-bold text-[#0B1F3A] md:text-3xl">
            What is your age?
          </h2>
          <Input
            type="number"
            min="14"
            max="45"
            value={profile.age}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, age: e.target.value }))
            }
            placeholder="Enter your age"
            className="h-12 border-2"
          />
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#2E4A3F]/10 px-3 py-2 text-sm font-medium text-[#2E4A3F]">
            <UserRound className="h-4 w-4" />
            Mandatory Profile Question
          </div>
          <h2 className="text-2xl font-bold text-[#0B1F3A] md:text-3xl">
            Select your gender
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setProfile((prev) => ({
                    ...prev,
                    gender: option.value as CandidateGender,
                  }))
                }
                className={`rounded-2xl border-2 p-5 text-left transition-all ${
                  profile.gender === option.value
                    ? "border-[#2E4A3F] bg-[#2E4A3F]/10"
                    : "border-slate-200 hover:border-[#2E4A3F]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-[#0B1F3A]">
                    {option.label}
                  </span>
                  {profile.gender === option.value ? (
                    <CheckCircle2 className="h-5 w-5 text-[#2E4A3F]" />
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Questions will be filtered based on the selected gender.
                </p>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#2E4A3F]/10 px-3 py-2 text-sm font-medium text-[#2E4A3F]">
          <SlidersHorizontal className="h-4 w-4" />
          Mandatory Profile Question
        </div>
        <h2 className="text-2xl font-bold text-[#0B1F3A] md:text-3xl">
          Set your height
        </h2>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-[#0B1F3A]">
              {profile.height}
              <span className="ml-2 text-lg font-medium text-slate-500">cm</span>
            </div>
          </div>
          <input
            type="range"
            min="120"
            max="220"
            value={profile.height}
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                height: Number(e.target.value),
              }))
            }
            className="mt-6 h-2 w-full cursor-pointer accent-[#2E4A3F]"
          />
          <div className="mt-3 flex justify-between text-xs text-gray-500">
            <span>120 cm</span>
            <span>170 cm</span>
            <span>220 cm</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />

      <main className="pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white/80 p-6 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#2E4A3F]">
                Exam Selected
              </p>
              <h1 className="mt-2 text-3xl font-bold text-[#0B1F3A]">
                {selectedExam.title}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedExam.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#2E4A3F]/10 px-3 py-1 text-xs font-semibold text-[#2E4A3F]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <Button asChild variant="outline" className="border-2">
              <Link to="/medical-check">
                <ArrowLeft className="h-4 w-4" />
                Change Exam
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Question {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-[#2E4A3F]">
                {Math.round(progress)}% complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[235px_minmax(0,1fr)]">
            <motion.div
              key={`${resolvedPreviewArea}-${previewGender}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="md:sticky md:top-28"
            >
              <BodyAreaPreview
                activeArea={resolvedPreviewArea}
                bodyGender={previewGender}
                title={isProfileStep ? "Profile Body Preview" : "Question Body Area"}
                description={
                  isProfileStep
                    ? "Required profile information"
                    : `Current focus: ${previewMeta.description}`
                }
                size="compact"
              />
            </motion.div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isProfileStep ? `profile-${currentStep}` : currentExamQuestion?.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.28 }}
              >
                <Card className="border-2 p-8 shadow-xl md:p-10">
                  {isProfileStep ? (
                    renderProfileStep()
                  ) : currentExamQuestion ? (
                    <div className="mb-8">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Medical Question
                      </p>
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2E4A3F]/10 px-3 py-2 text-sm font-medium text-[#2E4A3F]">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: previewMeta.color }}
                        />
                        {previewMeta.label}
                      </div>
                      <h2 className="text-2xl font-bold leading-tight text-[#0B1F3A] md:text-3xl">
                        {currentExamQuestion.question}
                      </h2>
                      {currentExamQuestion.helper ? (
                        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                          <HelpCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                              Self-check hint
                            </p>
                            <p className="mt-2 text-sm leading-6 text-blue-950">
                              {currentExamQuestion.helper}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {showAfcatWeightChart && profile.gender ? (
                        <AfcatWeightChartCard
                          gender={profile.gender}
                          age={profile.age}
                          height={profile.height}
                        />
                      ) : null}
                      {showAfcatVisionChart ? <AfcatVisionStandardsCard /> : null}
                      {showNdaWeightChart ? (
                        <NdaWeightChartCard age={profile.age} height={profile.height} />
                      ) : null}
                      {showNdaVisionChart ? <NdaVisionStandardsCard /> : null}
                      {showNavyVisionChart ? <NavyVisionStandardsCard /> : null}

                      <div className="mt-6 space-y-3">
                        {currentExamQuestion.options.map((option) => {
                          const isSelected = answers[currentExamQuestion.id] === option;
                          return (
                            <motion.button
                              key={option}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => handleQuestionAnswer(option)}
                              className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                                isSelected
                                  ? "border-[#2E4A3F] bg-[#2E4A3F]/10 shadow-md"
                                  : "border-gray-200 hover:border-[#2E4A3F] hover:shadow-md"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-4">
                                <span className="font-medium text-gray-900">
                                  {option}
                                </span>
                                {isSelected ? (
                                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#2E4A3F]" />
                                ) : null}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-8 flex flex-col gap-4 border-t border-gray-200 pt-8 md:flex-row md:items-center md:justify-between">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="gap-2 border-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {currentStep === 0 ? "Back to Exams" : "Previous"}
                    </Button>

                    <div className="text-sm text-gray-500">
                      {isProfileStep
                        ? "Profile details are required and are not included in the score."
                        : answers[currentExamQuestion!.id]
                          ? "Answer captured. You can continue."
                          : "Select the option that matches your current medical status."}
                    </div>

                    <Button
                      onClick={handleNext}
                      disabled={!isCurrentStepComplete()}
                      className="gap-2 bg-[#2E4A3F] text-white hover:bg-[#0B1F3A]"
                    >
                      {currentStep === totalSteps - 1 ? "View Result" : "Next Question"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
