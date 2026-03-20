import { Ruler, Scale, ShieldCheck } from "lucide-react";
import { Card } from "./ui/card";

interface NdaWeightChartCardProps {
  age: string;
  height: number;
}

const getAgeBandLabel = (age: string) => {
  const value = Number(age);

  if (!Number.isFinite(value) || value <= 0) {
    return "Match your age with the correct column before answering.";
  }

  if (value < 17) {
    return "Below 17 years: use the IAP-BMI growth chart note mentioned in the policy.";
  }

  if (value <= 20) {
    return "Use the 17 to 20 years column for your self-check.";
  }

  if (value <= 30) {
    return "Use the 20 years + 1 day to 30 years column.";
  }

  if (value <= 40) {
    return "Use the 30 years + 1 day to 40 years column.";
  }

  return "Use the above 40 years column.";
};

export default function NdaWeightChartCard({
  age,
  height,
}: NdaWeightChartCardProps) {
  return (
    <Card className="mt-6 overflow-hidden border-2 border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Official NDA Height And Weight Chart
        </p>
        <h3 className="mt-2 text-xl font-bold text-[#0B1F3A]">
          Compare your height row and age column
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          The chart below is taken from the NDA medical standards policy. Check
          your current weight against the correct age band before answering.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            <Ruler className="h-4 w-4" />
            Height entered: {height} cm
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/15 px-4 py-2 text-sm font-medium text-[#0B1F3A]">
            <Scale className="h-4 w-4" />
            {getAgeBandLabel(age)}
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#2E4A3F]/10 px-4 py-2 text-sm font-medium text-[#2E4A3F]">
            <ShieldCheck className="h-4 w-4" />
            Select Yes only if your weight is within the correct chart range
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <a
          href="/medical-charts/nda/weight-chart-1.png"
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#2E4A3F] hover:text-[#2E4A3F]"
        >
          Open full chart page 1
        </a>
        <div className="overflow-auto rounded-2xl border border-slate-200 bg-white p-3">
          <img
            src="/medical-charts/nda/weight-chart-1.png"
            alt="NDA weight chart page 1"
            className="h-auto w-[1180px] max-w-none rounded-xl"
          />
        </div>

        <a
          href="/medical-charts/nda/weight-chart-2.png"
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#2E4A3F] hover:text-[#2E4A3F]"
        >
          Open full chart page 2
        </a>
        <div className="overflow-auto rounded-2xl border border-slate-200 bg-white p-3">
          <img
            src="/medical-charts/nda/weight-chart-2.png"
            alt="NDA weight chart page 2"
            className="h-auto w-[1180px] max-w-none rounded-xl"
          />
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          If your weight is above the chart because of body-building or sports
          training, the policy also expects BMI below 25, waist-hip ratio
          within limit, waist circumference within limit, and normal biochemical
          metabolic parameters.
        </div>
      </div>
    </Card>
  );
}
