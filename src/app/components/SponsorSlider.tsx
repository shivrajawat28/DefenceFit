import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { loadMedicalCmsData, type SponsorItem } from "../lib/medicalData";

export default function SponsorSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sponsors, setSponsors] = useState<SponsorItem[]>(() =>
    loadMedicalCmsData().sponsors,
  );
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    setSponsors(loadMedicalCmsData().sponsors);
  }, []);

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (!ref) {
      return;
    }

    ref.addEventListener("scroll", checkScroll);
    return () => ref.removeEventListener("scroll", checkScroll);
  }, [sponsors.length]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTo({
      left:
        scrollRef.current.scrollLeft + (direction === "left" ? -380 : 380),
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 py-16 md:py-20">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232E4A3F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
            <span className="text-sm font-medium text-[#0B1F3A]">
              Sponsored Partners
            </span>
          </div>
          <h2 className="text-3xl font-bold text-[#0B1F3A] md:text-4xl">
            Coaching Brands & Partner Banners
          </h2>
        </motion.div>

        {sponsors.length === 0 ? (
          <Card className="border-2 border-dashed p-10 text-center">
            <p className="text-lg font-semibold text-[#0B1F3A]">
              No sponsors available yet
            </p>
          </Card>
        ) : (
          <div className="relative">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`absolute top-1/2 left-0 z-10 hidden h-12 w-12 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-xl transition-all md:flex ${
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
              className={`absolute top-1/2 right-0 z-10 hidden h-12 w-12 translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-xl transition-all md:flex ${
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
              {sponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  viewport={{ once: true }}
                  className="w-[88%] flex-shrink-0 snap-start sm:w-[380px]"
                >
                  <Card className="group h-full overflow-hidden border-2 transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-2xl">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={sponsor.image}
                        alt={sponsor.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      <div className="absolute top-4 right-4 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-[#0B1F3A]">
                        SPONSOR
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#0B1F3A] transition-colors group-hover:text-[#2E4A3F]">
                        {sponsor.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        Open the sponsor website in a new tab.
                      </p>

                      <a
                        href={sponsor.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 block"
                      >
                        <Button className="w-full border-2 border-[#2E4A3F] bg-transparent text-[#2E4A3F] hover:bg-[#2E4A3F] hover:text-white">
                          Visit Sponsor
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-2 md:hidden">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="h-2 w-2 rounded-full bg-gray-300" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
