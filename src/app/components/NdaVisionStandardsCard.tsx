import { Eye, ShieldCheck } from "lucide-react";
import { Card } from "./ui/card";

export default function NdaVisionStandardsCard() {
  return (
    <Card className="mt-6 overflow-hidden border-2 border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Official NDA Vision Standard
        </p>
        <h3 className="mt-2 text-xl font-bold text-[#0B1F3A]">
          Compare the NDA / 10+2 entry column from the chart
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          For NDA, focus on the first standards column in the chart below. It
          includes uncorrected vision, corrected vision, refractive limits,
          colour perception, and LASIK restriction.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            <Eye className="h-4 w-4" />
            NDA vision standard comes from the 10+2 / NDA column
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#2E4A3F]/10 px-4 py-2 text-sm font-medium text-[#2E4A3F]">
            <ShieldCheck className="h-4 w-4" />
            LASIK is not permitted for NDA in this chart
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-500">Uncorrected Vision</p>
            <p className="mt-2 text-base font-semibold text-[#0B1F3A]">6/36 and 6/36</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-500">Best Corrected Vision</p>
            <p className="mt-2 text-base font-semibold text-[#0B1F3A]">R 6/6 and L 6/6</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-500">Myopia Limit</p>
            <p className="mt-2 text-base font-semibold text-[#0B1F3A]">
              Less than -2.5 D Sph with max astigmatism +/- 2.0 D Cyl
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-500">Hypermetropia Limit</p>
            <p className="mt-2 text-base font-semibold text-[#0B1F3A]">
              Less than +2.5 D Sph with max astigmatism +/- 2.0 D Cyl
            </p>
          </div>
        </div>

        <a
          href="/medical-charts/nda/vision-chart.png"
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#2E4A3F] hover:text-[#2E4A3F]"
        >
          Open full vision standards chart
        </a>
        <div className="overflow-auto rounded-2xl border border-slate-200 bg-white p-3">
          <img
            src="/medical-charts/nda/vision-chart.png"
            alt="NDA vision standards chart"
            className="h-auto w-[1180px] max-w-none rounded-xl"
          />
        </div>
      </div>
    </Card>
  );
}
