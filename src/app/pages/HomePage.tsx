import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Heart,
  Send,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SponsorSlider from "../components/SponsorSlider";
import ExamSelectionGrid from "../components/ExamSelectionGrid";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  loadMedicalCmsData,
  makeId,
  saveMedicalCmsData,
  type MedicalCmsData,
} from "../lib/medicalData";

interface FeedbackFormState {
  name: string;
  email: string;
  message: string;
}

const emptyFeedbackForm: FeedbackFormState = {
  name: "",
  email: "",
  message: "",
};

export default function HomePage() {
  const location = useLocation();
  const [medicalData, setMedicalData] = useState<MedicalCmsData>(() =>
    loadMedicalCmsData(),
  );
  const [feedbackForm, setFeedbackForm] =
    useState<FeedbackFormState>(emptyFeedbackForm);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 320], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 320], [1, 1.08]);

  useEffect(() => {
    setMedicalData(loadMedicalCmsData());
  }, []);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const target = document.querySelector(location.hash);
    if (target instanceof HTMLElement) {
      window.setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  }, [location.hash]);

  const featuredArticles = useMemo(
    () => medicalData.articles.slice(0, 3),
    [medicalData.articles],
  );

  const handleFeedbackSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!feedbackForm.message.trim()) {
      return;
    }

    const nextData = {
      ...medicalData,
      feedback: [
        {
          id: makeId("feedback"),
          name: feedbackForm.name.trim() || "Anonymous",
          email: feedbackForm.email.trim(),
          message: feedbackForm.message.trim(),
          createdAt: new Date().toISOString(),
        },
        ...medicalData.feedback,
      ],
    };

    setMedicalData(nextData);
    saveMedicalCmsData(nextData);
    setFeedbackForm(emptyFeedbackForm);
    setFeedbackSubmitted(true);
    window.setTimeout(() => {
      setFeedbackSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1585802540432-60662b65ca62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBhcm15JTIwc29sZGllcnMlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzM5MDcyMDB8MA&ixlib=rb-4.1.0&q=80&w=1200)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08172d]/80 via-[#0B1F3A]/70 to-[#2E4A3F]/80" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-5xl px-4 pt-24 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-4 py-2 backdrop-blur-sm"
          >
            <Shield className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-sm text-white">
              Exam-wise medical fit screening before your attempt
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.3 }}
            className="text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
          >
            Check Your DefenceFit Readiness{" "}
            <span className="text-[#D4AF37]">Before the Exam Window Closes</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.45 }}
            className="mx-auto mt-6 max-w-3xl text-lg text-slate-200 md:text-xl"
          >
            Choose your exam, complete the required profile details, and answer
            the medical questions that match your exam and gender.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.6 }}
            className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Button
              asChild
              className="bg-[#D4AF37] px-8 py-6 text-lg text-[#0B1F3A] shadow-2xl transition-all hover:scale-105 hover:bg-[#D4AF37]/90 hover:shadow-[#D4AF37]/35"
            >
              <Link to="/medical-check">
                Explore Medical Checks
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-white bg-transparent px-8 py-6 text-lg text-white hover:bg-white hover:text-[#0B1F3A]"
            >
              <Link to="/articles">Learn More</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.8 }}
            className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3"
          >
            <Card className="border-white/15 bg-white/10 p-5 text-white backdrop-blur-sm">
              <Sparkles className="mx-auto h-7 w-7 text-[#D4AF37]" />
              <div className="mt-3 text-3xl font-bold">{medicalData.exams.length}</div>
              <p className="mt-1 text-sm text-slate-200">Live exam tracks</p>
            </Card>
            <Card className="border-white/15 bg-white/10 p-5 text-white backdrop-blur-sm">
              <ClipboardCheck className="mx-auto h-7 w-7 text-[#D4AF37]" />
              <div className="mt-3 text-3xl font-bold">{medicalData.questions.length}</div>
              <p className="mt-1 text-sm text-slate-200">
                Exam and gender-aware medical questions
              </p>
            </Card>
            <Card className="border-white/15 bg-white/10 p-5 text-white backdrop-blur-sm">
              <Users className="mx-auto h-7 w-7 text-[#D4AF37]" />
              <div className="mt-3 text-3xl font-bold">{medicalData.sponsors.length}</div>
              <p className="mt-1 text-sm text-slate-200">Live sponsor banners</p>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="h-8 w-8 text-white/65" />
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-[#0B1F3A] md:text-4xl">
              Select Your Defence Exam
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Choose the exam you are preparing for and launch the matching
              medical check flow.
            </p>
          </motion.div>

          <ExamSelectionGrid exams={medicalData.exams} />
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <h2 className="text-3xl font-bold text-[#0B1F3A] md:text-4xl">
                Latest Articles & Guides
              </h2>
              <p className="mt-2 text-gray-600">
                Preparation guides, standards, and correction resources
              </p>
            </div>
            <Button asChild variant="outline" className="hidden md:inline-flex">
              <Link to="/articles">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {featuredArticles.length === 0 ? (
            <Card className="border-2 border-dashed p-10 text-center">
              <p className="text-xl font-bold text-[#0B1F3A]">
                No articles available yet
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                >
                  <Card className="group overflow-hidden border-2 transition-all hover:border-[#D4AF37]/50 hover:shadow-xl">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-semibold text-[#0B1F3A]">
                        {article.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-[#0B1F3A] transition-colors group-hover:text-[#2E4A3F]">
                        {article.title}
                      </h3>
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex"
                      >
                        <Button variant="link" className="px-0 text-[#2E4A3F]">
                          Read More
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link to="/articles">
                View All Articles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SponsorSlider />

      <section id="about" className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2E4A3F]">
              About
            </p>
            <h2 className="text-3xl font-bold text-[#0B1F3A] md:text-4xl">
              Why Aspirants Use This Platform
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Each defence entry follows different medical expectations, so the
              platform adapts the flow to the selected exam.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Activity,
                title: "Exam-wise Questions",
                description:
                  "Every defence entry can have its own medical question set.",
              },
              {
                icon: Shield,
                title: "Gender-aware Flow",
                description:
                  "Questions can be shown for all candidates or filtered by gender.",
              },
              {
                icon: Heart,
                title: "Treatment Guidance",
                description:
                  "Each failed area can include a correction plan and treatment guidance.",
              },
              {
                icon: Users,
                title: "Time Saver",
                description:
                  "Aspirants can assess readiness early and focus on the right next step.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 p-6 transition-all hover:border-[#D4AF37]/30 hover:shadow-xl">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2E4A3F]/10">
                    <item.icon className="h-6 w-6 text-[#2E4A3F]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0B1F3A]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#2E4A3F] to-[#0B1F3A] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div>
            <h3 className="text-2xl font-bold text-white">
              Ready to start your exam-wise medical screening?
            </h3>
            <p className="mt-2 text-slate-200">
              Choose an exam, complete your profile details, and begin the check.
            </p>
          </div>
          <Button
            asChild
            className="bg-[#D4AF37] px-8 py-6 text-lg text-[#0B1F3A] shadow-xl transition-all hover:scale-105 hover:bg-[#D4AF37]/90"
          >
            <Link to="/medical-check">
              Choose Exam
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-[#0B1F3A] md:text-4xl">
              We Value Your Feedback
            </h2>
            <p className="mt-3 text-gray-600">
              Share suggestions, report issues, or tell us what to improve.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 p-8">
              <form className="space-y-6" onSubmit={handleFeedbackSubmit}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Your Name{" "}
                      <span className="font-normal text-gray-400">(Optional)</span>
                    </label>
                    <Input
                      value={feedbackForm.name}
                      onChange={(event) =>
                        setFeedbackForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Enter your name"
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Email Address{" "}
                      <span className="font-normal text-gray-400">(Optional)</span>
                    </label>
                    <Input
                      type="email"
                      value={feedbackForm.email}
                      onChange={(event) =>
                        setFeedbackForm((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                      placeholder="your@email.com"
                      className="border-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Your Feedback
                  </label>
                  <Textarea
                    value={feedbackForm.message}
                    onChange={(event) =>
                      setFeedbackForm((prev) => ({
                        ...prev,
                        message: event.target.value,
                      }))
                    }
                    placeholder="Share your thoughts, suggestions, or report any issues..."
                    rows={5}
                    className="border-gray-300"
                    required
                  />
                </div>

                {feedbackSubmitted ? (
                  <div className="flex items-center gap-3 rounded-2xl border-2 border-green-200 bg-green-50 p-4">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">
                        Thank you for your feedback!
                      </p>
                      <p className="text-sm text-green-700">
                        Your message has been saved successfully.
                      </p>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    className="w-full bg-[#2E4A3F] text-white hover:bg-[#0B1F3A]"
                  >
                    <Send className="h-4 w-4" />
                    Submit Feedback
                  </Button>
                )}
              </form>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
