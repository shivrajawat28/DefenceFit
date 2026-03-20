import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ExternalLink, Filter, Search } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { loadMedicalCmsData, type AppArticle } from "../lib/medicalData";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<AppArticle[]>(() =>
    loadMedicalCmsData().articles,
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setArticles(loadMedicalCmsData().articles);
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(articles.map((article) => article.category).filter(Boolean))],
    [articles],
  );

  const filteredArticles = useMemo(
    () =>
      articles.filter((article) => {
        const matchesCategory =
          selectedCategory === "All" || article.category === selectedCategory;
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          query === "" ||
          article.title.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      }),
    [articles, searchQuery, selectedCategory],
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-br from-[#0B1F3A] to-[#2E4A3F] pt-24 pb-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl font-bold md:text-5xl">
              DefenceFit Articles & Guides
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-200">
              Browse preparation guides, standards, and external resources in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto max-w-2xl"
          >
            <div className="relative">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles by title or category"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-14 rounded-xl border-0 bg-white pl-12 text-base text-[#0B1F3A] shadow-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-16 z-40 border-b bg-gray-50/95 py-8 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="h-5 w-5 flex-shrink-0 text-gray-600" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-[#2E4A3F] text-white shadow-lg"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredArticles.length === 0 ? (
            <Card className="border-2 border-dashed p-12 text-center">
              <p className="text-2xl font-bold text-[#0B1F3A]">
                {articles.length === 0
                  ? "No articles available yet"
                  : "No articles match your search"}
              </p>
              <p className="mt-3 text-gray-600">
                {articles.length === 0
                  ? "New articles will appear here when they are added."
                  : "Try changing the search term or category filter."}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                >
                  <Card className="group flex h-full flex-col overflow-hidden border-2 transition-all hover:border-[#D4AF37]/50 hover:shadow-2xl">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                      <div className="absolute top-4 left-4 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-semibold text-[#0B1F3A]">
                        {article.category}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-bold text-[#0B1F3A] transition-colors group-hover:text-[#2E4A3F]">
                        {article.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
                        Open the external article link to read the full guide.
                      </p>

                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 block"
                      >
                        <Button className="w-full bg-[#2E4A3F] text-white hover:bg-[#0B1F3A]">
                          Read Article
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
