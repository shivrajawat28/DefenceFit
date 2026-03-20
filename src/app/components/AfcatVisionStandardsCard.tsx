import { Eye, ShieldCheck } from "lucide-react";
import { Card } from "./ui/card";
import { AFCAT_VISION_STANDARDS } from "../lib/afcatVisionStandards";

export default function AfcatVisionStandardsCard() {
  return (
    <Card className="mt-6 overflow-hidden border-2 border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Official AFCAT Visual Standards
        </p>
        <h3 className="mt-2 text-xl font-bold text-[#0B1F3A]">
          Branch-wise vision and colour-vision chart
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Compare your intended branch with your latest eye prescription or
          ophthalmology report before answering.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            <Eye className="h-4 w-4" />
            Distant vision, refractive limits, and colour vision
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#2E4A3F]/10 px-4 py-2 text-sm font-medium text-[#2E4A3F]">
            <ShieldCheck className="h-4 w-4" />
            Select Yes only if every limit matches your branch
          </div>
        </div>
      </div>

      <div className="max-h-[520px] overflow-auto">
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead className="bg-[#0B1F3A] text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Branch</th>
              <th className="px-4 py-3 text-left font-semibold">
                Distant Vision (Corrected)
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Max Refractive Error
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Astigmatism
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Colour Vision
              </th>
            </tr>
          </thead>
          <tbody>
            {AFCAT_VISION_STANDARDS.map((row, index) => (
              <tr
                key={row.branch}
                className={`border-b border-slate-200 align-top ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                }`}
              >
                <td className="px-4 py-4 font-semibold text-[#0B1F3A]">
                  {row.branch}
                </td>
                <td className="px-4 py-4 leading-6 text-slate-700">
                  {row.correctedVision}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  <div className="space-y-2">
                    {row.refractiveError.map((value) => (
                      <p key={value} className="leading-6">
                        {value}
                      </p>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 leading-6 text-slate-700">
                  {row.astigmatism}
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex rounded-full bg-[#D4AF37]/15 px-3 py-1 text-sm font-semibold text-[#0B1F3A]">
                    {row.colourVision}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
