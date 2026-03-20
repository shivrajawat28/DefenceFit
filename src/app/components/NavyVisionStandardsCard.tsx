import { Eye, ShieldCheck } from "lucide-react";
import { Card } from "./ui/card";
import { NAVY_VISION_STANDARDS } from "../lib/navyVisionStandards";

export default function NavyVisionStandardsCard() {
  return (
    <Card className="mt-6 overflow-hidden border-2 border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Navy Vision Standard
        </p>
        <h3 className="mt-2 text-xl font-bold text-[#0B1F3A]">
          Vision standard comparison table
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Match your latest eye report with each required limit before you
          answer this question.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            <Eye className="h-4 w-4" />
            Vision, refraction, colour perception, and binocular vision
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#2E4A3F]/10 px-4 py-2 text-sm font-medium text-[#2E4A3F]">
            <ShieldCheck className="h-4 w-4" />
            Select Yes only if every standard matches
          </div>
        </div>
      </div>

      <div className="max-h-[520px] overflow-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead className="bg-[#0B1F3A] text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Feature</th>
              <th className="px-4 py-3 text-left font-semibold">
                Required Standard (Navy)
              </th>
            </tr>
          </thead>
          <tbody>
            {NAVY_VISION_STANDARDS.map((row, index) => (
              <tr
                key={row.feature}
                className={`border-b border-slate-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                }`}
              >
                <td className="px-4 py-4 text-lg font-semibold text-[#0B1F3A]">
                  {row.feature}
                </td>
                <td className="px-4 py-4 text-lg leading-8 text-slate-700">
                  {row.standard}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
