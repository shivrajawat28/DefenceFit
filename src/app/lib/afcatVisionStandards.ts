export interface AfcatVisionStandardRow {
  branch: string;
  correctedVision: string;
  refractiveError: string[];
  astigmatism: string;
  colourVision: string;
}

export const AFCAT_VISION_STANDARDS: AfcatVisionStandardRow[] = [
  {
    branch: "Flying Branch",
    correctedVision: "6/6 in one eye, 6/9 in the other eye, and correctable to 6/6",
    refractiveError: [
      "Hypermetropia: +2.0D Sph",
      "Myopia: Nil",
      "Retinoscopic myopia: -0.5D",
    ],
    astigmatism: "+0.75D Cyl (max)",
    colourVision: "CP-I (Perfect)",
  },
  {
    branch: "Ground Duty (Technical)",
    correctedVision: "6/36 in each eye, correctable to 6/6",
    refractiveError: [
      "Hypermetropia: +3.5D Sph",
      "Myopia: -3.5D Sph",
    ],
    astigmatism: "+2.5D Cyl",
    colourVision: "CP-II",
  },
  {
    branch: "Ground Duty (Non-Tech)",
    correctedVision: "6/36 in each eye, correctable to 6/6",
    refractiveError: [
      "Hypermetropia: +3.5D Sph",
      "Myopia: -3.5D Sph",
    ],
    astigmatism: "+2.5D Cyl",
    colourVision: "CP-III",
  },
];
