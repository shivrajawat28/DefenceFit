export interface NavyVisionStandardRow {
  feature: string;
  standard: string;
}

export const NAVY_VISION_STANDARDS: NavyVisionStandardRow[] = [
  {
    feature: "Uncorrected Vision",
    standard: "Better eye: 6/6, worse eye: 6/12",
  },
  {
    feature: "Corrected Vision",
    standard: "6/6 in both eyes",
  },
  {
    feature: "Myopia",
    standard: "<= -1.5D to -1.75D",
  },
  {
    feature: "Hypermetropia",
    standard: "<= +1.5D to +2.5D",
  },
  {
    feature: "Astigmatism",
    standard: "Included in spherical limits",
  },
  {
    feature: "Colour Perception",
    standard: "CP I (High Grade)",
  },
  {
    feature: "Binocular Vision",
    standard: "Normal (Grade III)",
  },
];
