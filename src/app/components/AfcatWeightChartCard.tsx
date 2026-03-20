import { Ruler, Scale } from "lucide-react";
import { Card } from "./ui/card";
import type { CandidateGender } from "../lib/medicalData";
import {
  AFCAT_WEIGHT_BUCKET_LABELS,
  AFCAT_WEIGHT_CHARTS,
  getAfcatWeightAgeBucket,
  getAfcatWeightCellValue,
} from "../lib/afcatWeightCharts";

interface AfcatWeightChartCardProps {
  gender: CandidateGender;
  age: string;
  height: number;
}

export default function AfcatWeightChartCard({
  gender,
  age,
  height,
}: AfcatWeightChartCardProps) {
  const chart = AFCAT_WEIGHT_CHARTS[gender];
  const ageValue = Number(age);
  const ageBucket =
    Number.isFinite(ageValue) && ageValue > 0
      ? getAfcatWeightAgeBucket(ageValue)
      : null;
  const matchedRow =
    chart.find((row) => row.height === height) ??
    chart.find((row) => row.height >= height) ??
    chart[chart.length - 1];

  return (
    <Card className="mt-6 overflow-hidden border-2 border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Official AFCAT Weight Chart
        </p>
        <h3 className="mt-2 text-xl font-bold text-[#0B1F3A]">
          {gender === "male"
            ? "Male weight-for-height chart"
            : "Female weight-for-height chart"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Match your height row with your age-group column before answering.
          Your current profile is highlighted below for quick comparison.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            <Ruler className="h-4 w-4" />
            Height: {height} cm
          </div>
          {ageBucket ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/15 px-4 py-2 text-sm font-medium text-[#0B1F3A]">
              <Scale className="h-4 w-4" />
              Age group: {AFCAT_WEIGHT_BUCKET_LABELS[ageBucket]}
            </div>
          ) : null}
          {matchedRow && ageBucket ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-[#2E4A3F]/10 px-4 py-2 text-sm font-medium text-[#2E4A3F]">
              Allowed range: {matchedRow.min} to{" "}
              {getAfcatWeightCellValue(matchedRow, ageBucket)} kg
            </div>
          ) : null}
        </div>
      </div>

      <div className="max-h-[540px] overflow-auto">
        <table className="min-w-[760px] w-full border-collapse text-sm">
          <thead className="bg-[#0B1F3A] text-white">
            <tr>
              <th className="sticky left-0 bg-[#0B1F3A] px-4 py-3 text-left font-semibold">
                Height
              </th>
              <th className="px-4 py-3 text-left font-semibold">Min Weight</th>
              <th
                className={`px-4 py-3 text-left font-semibold ${
                  ageBucket === "below20" ? "bg-[#D4AF37] text-[#0B1F3A]" : ""
                }`}
              >
                Max Below 20
              </th>
              <th
                className={`px-4 py-3 text-left font-semibold ${
                  ageBucket === "age20to25" ? "bg-[#D4AF37] text-[#0B1F3A]" : ""
                }`}
              >
                Max 20 to 25
              </th>
              <th
                className={`px-4 py-3 text-left font-semibold ${
                  ageBucket === "above25" ? "bg-[#D4AF37] text-[#0B1F3A]" : ""
                }`}
              >
                Max Above 25
              </th>
            </tr>
          </thead>
          <tbody>
            {chart.map((row, index) => {
              const isCurrentHeight = row.height === height;
              return (
                <tr
                  key={`${row.height}-${index}`}
                  className={`border-b border-slate-200 ${
                    isCurrentHeight ? "bg-[#D4AF37]/10" : "bg-white"
                  }`}
                >
                  <td
                    className={`sticky left-0 px-4 py-3 font-semibold ${
                      isCurrentHeight ? "bg-[#f8e7a7]" : "bg-white"
                    } text-[#0B1F3A]`}
                  >
                    {row.height} cm
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.min} kg</td>
                  <td
                    className={`px-4 py-3 text-slate-700 ${
                      ageBucket === "below20" ? "bg-[#fff7d6] font-semibold" : ""
                    }`}
                  >
                    {row.below20} kg
                  </td>
                  <td
                    className={`px-4 py-3 text-slate-700 ${
                      ageBucket === "age20to25"
                        ? "bg-[#fff7d6] font-semibold"
                        : ""
                    }`}
                  >
                    {row.age20to25} kg
                  </td>
                  <td
                    className={`px-4 py-3 text-slate-700 ${
                      ageBucket === "above25" ? "bg-[#fff7d6] font-semibold" : ""
                    }`}
                  >
                    {row.above25} kg
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
