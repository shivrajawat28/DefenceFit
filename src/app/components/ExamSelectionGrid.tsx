import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { DefenceExam, getCountdownParts } from "../lib/medicalData";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface ExamSelectionGridProps {
  exams: DefenceExam[];
  emptyTitle?: string;
  emptyDescription?: string;
  layout?: "carousel" | "stack";
}

export default function ExamSelectionGrid({
  exams,
  emptyTitle = "No exams available right now",
  emptyDescription = "Add exams from the admin panel to display them here.",
  layout = "carousel",
}: ExamSelectionGridProps) {
  const [now, setNow] = useState(() => Date.now());
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const checkScroll = () => {
    if (!scrollRef.current) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (!ref) {
      return;
    }

    ref.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      ref.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [exams.length]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTo({
      left:
        scrollRef.current.scrollLeft + (direction === "left" ? -360 : 360),
      behavior: "smooth",
    });
  };

  if (exams.length === 0) {
    return (
      <Card className="border-dashed border-2 p-10 text-center">
        <h3 className="text-xl font-bold text-[#0B1F3A]">{emptyTitle}</h3>
        <p className="mt-3 text-sm text-gray-600">{emptyDescription}</p>
      </Card>
    );
  }

  const cards = exams.map((exam, index) => {
    const countdown = getCountdownParts(exam.countdownEndsAt, now);

    return (
      <motion.div
        key={exam.id}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: index * 0.08 }}
        viewport={{ once: true }}
        className={
          layout === "carousel"
            ? "w-[88%] max-w-[360px] flex-shrink-0 snap-start sm:w-[360px]"
            : ""
        }
      >
        <Card className="group h-full overflow-hidden border-2 transition-all hover:border-[#D4AF37] hover:shadow-2xl">
          <div className="relative h-48 overflow-hidden">
            <img
              src={exam.image}
              alt={exam.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/35 to-transparent" />
            <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
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

          <div className="p-6">
            <h3 className="text-xl font-bold text-[#0B1F3A]">{exam.title}</h3>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#2E4A3F]">
              <Clock className="h-4 w-4" />
              <span>
                {countdown.expired ? "Countdown closed" : "Live countdown"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <div className="text-xl font-bold text-[#2E4A3F]">
                  {countdown.days}
                </div>
                <div className="text-[11px] text-gray-500">Days</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <div className="text-xl font-bold text-[#2E4A3F]">
                  {countdown.hours}
                </div>
                <div className="text-[11px] text-gray-500">Hours</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <div className="text-xl font-bold text-[#2E4A3F]">
                  {countdown.minutes}
                </div>
                <div className="text-[11px] text-gray-500">Mins</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <div className="text-xl font-bold text-[#2E4A3F]">
                  {countdown.seconds}
                </div>
                <div className="text-[11px] text-gray-500">Secs</div>
              </div>
            </div>

            <Button
              asChild
              className="mt-5 w-full bg-[#2E4A3F] text-white transition-all hover:bg-[#0B1F3A] group-hover:bg-[#D4AF37] group-hover:text-[#0B1F3A]"
            >
              <Link to={`/medical-check/${exam.id}`}>
                Check Medical Fit
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  });

  if (layout === "stack") {
    return <div className="space-y-6">{cards}</div>;
  }

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className={`absolute top-1/2 left-0 z-10 hidden h-12 w-12 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-xl transition-all lg:flex ${
          canScrollLeft
            ? "cursor-pointer hover:border-[#2E4A3F] hover:bg-[#2E4A3F] hover:text-white"
            : "cursor-not-allowed opacity-50"
        }`}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className={`absolute top-1/2 right-0 z-10 hidden h-12 w-12 translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-xl transition-all lg:flex ${
          canScrollRight
            ? "cursor-pointer hover:border-[#2E4A3F] hover:bg-[#2E4A3F] hover:text-white"
            : "cursor-not-allowed opacity-50"
        }`}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {cards}
      </div>
    </div>
  );
}
