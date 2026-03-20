import type { CandidateGender } from "./medicalData";

export interface AfcatWeightChartRow {
  height: number;
  min: number;
  below20: number;
  age20to25: number;
  above25: number;
}

export type AfcatWeightAgeBucket = "below20" | "age20to25" | "above25";

export const AFCAT_WEIGHT_BUCKET_LABELS: Record<AfcatWeightAgeBucket, string> = {
  below20: "Below 20 years",
  age20to25: "20 to 25 years",
  above25: "Above 25 years",
};

export const getAfcatWeightAgeBucket = (age: number): AfcatWeightAgeBucket =>
  age < 20 ? "below20" : age <= 25 ? "age20to25" : "above25";

export const getAfcatWeightCellValue = (
  row: AfcatWeightChartRow,
  bucket: AfcatWeightAgeBucket,
) => {
  if (bucket === "below20") {
    return row.below20;
  }
  if (bucket === "age20to25") {
    return row.age20to25;
  }
  return row.above25;
};

export const AFCAT_WEIGHT_CHARTS: Record<CandidateGender, AfcatWeightChartRow[]> = {
  male: [
    { height: 152, min: 40, below20: 53, age20to25: 55, above25: 58 },
    { height: 153, min: 40, below20: 54, age20to25: 56, above25: 59 },
    { height: 154, min: 40, below20: 55, age20to25: 57, above25: 59 },
    { height: 155, min: 41, below20: 55, age20to25: 58, above25: 60 },
    { height: 156, min: 41, below20: 56, age20to25: 58, above25: 61 },
    { height: 157, min: 42, below20: 57, age20to25: 59, above25: 62 },
    { height: 158, min: 42, below20: 57, age20to25: 60, above25: 62 },
    { height: 159, min: 43, below20: 58, age20to25: 61, above25: 63 },
    { height: 160, min: 44, below20: 59, age20to25: 61, above25: 64 },
    { height: 161, min: 44, below20: 60, age20to25: 62, above25: 65 },
    { height: 162, min: 45, below20: 60, age20to25: 63, above25: 66 },
    { height: 163, min: 45, below20: 61, age20to25: 64, above25: 66 },
    { height: 164, min: 46, below20: 62, age20to25: 65, above25: 67 },
    { height: 165, min: 46, below20: 63, age20to25: 65, above25: 68 },
    { height: 166, min: 47, below20: 63, age20to25: 66, above25: 69 },
    { height: 167, min: 47, below20: 64, age20to25: 67, above25: 70 },
    { height: 168, min: 48, below20: 65, age20to25: 68, above25: 71 },
    { height: 169, min: 49, below20: 66, age20to25: 69, above25: 71 },
    { height: 170, min: 49, below20: 66, age20to25: 69, above25: 72 },
    { height: 171, min: 50, below20: 67, age20to25: 70, above25: 73 },
    { height: 172, min: 50, below20: 68, age20to25: 71, above25: 74 },
    { height: 173, min: 51, below20: 69, age20to25: 72, above25: 75 },
    { height: 174, min: 51, below20: 70, age20to25: 73, above25: 76 },
    { height: 175, min: 52, below20: 70, age20to25: 74, above25: 77 },
    { height: 176, min: 53, below20: 71, age20to25: 74, above25: 77 },
    { height: 177, min: 53, below20: 72, age20to25: 75, above25: 78 },
    { height: 178, min: 54, below20: 73, age20to25: 76, above25: 79 },
    { height: 179, min: 54, below20: 74, age20to25: 77, above25: 80 },
    { height: 180, min: 55, below20: 75, age20to25: 78, above25: 81 },
    { height: 181, min: 56, below20: 75, age20to25: 79, above25: 82 },
    { height: 182, min: 56, below20: 76, age20to25: 79, above25: 83 },
    { height: 183, min: 57, below20: 77, age20to25: 80, above25: 84 },
    { height: 184, min: 58, below20: 78, age20to25: 81, above25: 85 },
    { height: 185, min: 58, below20: 79, age20to25: 82, above25: 86 },
    { height: 186, min: 59, below20: 80, age20to25: 83, above25: 86 },
    { height: 187, min: 59, below20: 80, age20to25: 84, above25: 87 },
    { height: 188, min: 60, below20: 81, age20to25: 85, above25: 88 },
    { height: 189, min: 61, below20: 82, age20to25: 86, above25: 89 },
    { height: 190, min: 61, below20: 83, age20to25: 87, above25: 90 },
    { height: 191, min: 62, below20: 84, age20to25: 88, above25: 91 },
    { height: 192, min: 63, below20: 85, age20to25: 88, above25: 92 },
    { height: 193, min: 63, below20: 86, age20to25: 89, above25: 93 },
    { height: 194, min: 64, below20: 87, age20to25: 90, above25: 94 },
    { height: 195, min: 65, below20: 87, age20to25: 91, above25: 95 },
    { height: 196, min: 65, below20: 88, age20to25: 92, above25: 96 },
    { height: 197, min: 66, below20: 89, age20to25: 93, above25: 97 },
    { height: 198, min: 67, below20: 90, age20to25: 94, above25: 98 },
    { height: 199, min: 67, below20: 91, age20to25: 95, above25: 99 },
    { height: 200, min: 68, below20: 92, age20to25: 96, above25: 100 },
  ],
  female: [
    { height: 147, min: 37, below20: 45, age20to25: 48, above25: 51 },
    { height: 147, min: 37, below20: 45, age20to25: 48, above25: 51 },
    { height: 148, min: 37, below20: 46, age20to25: 48, above25: 51 },
    { height: 149, min: 37, below20: 47, age20to25: 49, above25: 52 },
    { height: 150, min: 37, below20: 47, age20to25: 50, above25: 53 },
    { height: 151, min: 37, below20: 48, age20to25: 50, above25: 54 },
    { height: 152, min: 37, below20: 49, age20to25: 51, above25: 54 },
    { height: 153, min: 37, below20: 49, age20to25: 51, above25: 55 },
    { height: 154, min: 38, below20: 50, age20to25: 52, above25: 56 },
    { height: 155, min: 38, below20: 50, age20to25: 53, above25: 56 },
    { height: 156, min: 39, below20: 51, age20to25: 54, above25: 57 },
    { height: 157, min: 39, below20: 52, age20to25: 54, above25: 58 },
    { height: 158, min: 40, below20: 52, age20to25: 55, above25: 59 },
    { height: 159, min: 40, below20: 53, age20to25: 56, above25: 59 },
    { height: 160, min: 41, below20: 54, age20to25: 56, above25: 60 },
    { height: 161, min: 41, below20: 54, age20to25: 57, above25: 61 },
    { height: 162, min: 42, below20: 55, age20to25: 58, above25: 62 },
    { height: 163, min: 43, below20: 56, age20to25: 58, above25: 62 },
    { height: 164, min: 43, below20: 56, age20to25: 59, above25: 63 },
    { height: 165, min: 44, below20: 57, age20to25: 60, above25: 64 },
    { height: 166, min: 44, below20: 58, age20to25: 61, above25: 65 },
    { height: 167, min: 45, below20: 59, age20to25: 61, above25: 66 },
    { height: 168, min: 45, below20: 59, age20to25: 62, above25: 66 },
    { height: 169, min: 46, below20: 60, age20to25: 63, above25: 67 },
    { height: 170, min: 46, below20: 61, age20to25: 64, above25: 68 },
    { height: 171, min: 47, below20: 61, age20to25: 64, above25: 69 },
    { height: 172, min: 47, below20: 62, age20to25: 65, above25: 70 },
    { height: 173, min: 48, below20: 63, age20to25: 66, above25: 70 },
    { height: 174, min: 48, below20: 64, age20to25: 67, above25: 71 },
    { height: 175, min: 49, below20: 64, age20to25: 67, above25: 72 },
    { height: 176, min: 50, below20: 65, age20to25: 68, above25: 73 },
    { height: 177, min: 50, below20: 66, age20to25: 69, above25: 74 },
    { height: 178, min: 51, below20: 67, age20to25: 70, above25: 74 },
    { height: 179, min: 51, below20: 67, age20to25: 70, above25: 75 },
    { height: 180, min: 52, below20: 68, age20to25: 71, above25: 76 },
    { height: 181, min: 52, below20: 69, age20to25: 72, above25: 77 },
    { height: 182, min: 53, below20: 70, age20to25: 73, above25: 78 },
    { height: 183, min: 54, below20: 70, age20to25: 74, above25: 79 },
    { height: 184, min: 54, below20: 71, age20to25: 74, above25: 80 },
    { height: 185, min: 55, below20: 72, age20to25: 75, above25: 80 },
    { height: 186, min: 55, below20: 73, age20to25: 76, above25: 81 },
    { height: 187, min: 56, below20: 73, age20to25: 77, above25: 82 },
    { height: 188, min: 57, below20: 74, age20to25: 78, above25: 83 },
    { height: 189, min: 57, below20: 75, age20to25: 79, above25: 84 },
    { height: 190, min: 58, below20: 76, age20to25: 79, above25: 85 },
    { height: 191, min: 58, below20: 77, age20to25: 80, above25: 86 },
    { height: 192, min: 59, below20: 77, age20to25: 81, above25: 87 },
    { height: 193, min: 60, below20: 78, age20to25: 82, above25: 88 },
    { height: 194, min: 60, below20: 79, age20to25: 83, above25: 88 },
    { height: 195, min: 61, below20: 80, age20to25: 84, above25: 89 },
  ],
};
