export type CandidateGender = "male" | "female";
export type GenderScope = "all" | CandidateGender;
export type ResolutionType =
  | "correctable"
  | "specialist_review"
  | "likely_permanent";

export type BodyArea =
  | "brain"
  | "eyes"
  | "ears"
  | "mouth"
  | "heart"
  | "lungs"
  | "abdomen"
  | "bones"
  | "legs"
  | "feet"
  | "height_weight"
  | "skin"
  | "general";

export interface DefenceExam {
  id: string;
  title: string;
  tags: string[];
  image: string;
  countdownEndsAt: string;
}

export interface MedicalQuestion {
  id: string;
  examId: string;
  question: string;
  helper?: string;
  bodyArea: BodyArea;
  gender: GenderScope;
  options: string[];
  passingAnswers: string[];
  failSummary: string;
  treatment: string;
  weight: number;
  resolutionType?: ResolutionType;
  alternativeAdvice?: string;
}

export interface AppArticle {
  id: string;
  title: string;
  image: string;
  link: string;
  category: string;
}

export interface SponsorItem {
  id: string;
  title: string;
  image: string;
  link: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface MedicalCmsData {
  exams: DefenceExam[];
  questions: MedicalQuestion[];
  articles: AppArticle[];
  sponsors: SponsorItem[];
  feedback: FeedbackItem[];
}

export interface CandidateProfile {
  name: string;
  age: string;
  gender: CandidateGender;
  height: number;
}

export interface FailedQuestion {
  id: string;
  bodyArea: BodyArea;
  question: string;
  answer: string;
  expectedAnswers: string[];
  summary: string;
  treatment: string;
  weight: number;
  resolutionType: ResolutionType;
  alternativeAdvice?: string;
}

export interface MedicalResult {
  verdict: "qualified" | "not_qualified";
  status: "perfect" | "improve" | "high_risk";
  score: number;
  passedCount: number;
  failedCount: number;
  failedItems: FailedQuestion[];
  treatments: string[];
  alternativeAdvice: string[];
  hasLikelyPermanentIssue: boolean;
}

export const BODY_AREAS: Array<{
  value: BodyArea;
  label: string;
  description: string;
  color: string;
}> = [
  {
    value: "brain",
    label: "Brain",
    description: "Mental focus, neuro, memory, and psychological readiness.",
    color: "#8b5cf6",
  },
  {
    value: "eyes",
    label: "Eyes",
    description: "Vision, color perception, and eye health checks.",
    color: "#0ea5e9",
  },
  {
    value: "ears",
    label: "Ears",
    description: "Hearing clarity and ENT related questions.",
    color: "#06b6d4",
  },
  {
    value: "mouth",
    label: "Mouth / Teeth",
    description: "Dental points, jaw alignment, and oral health.",
    color: "#f97316",
  },
  {
    value: "heart",
    label: "Heart",
    description: "Cardio history, murmur, and heart performance.",
    color: "#ef4444",
  },
  {
    value: "lungs",
    label: "Lungs / Chest",
    description: "Breathing, asthma, chest expansion, and stamina.",
    color: "#14b8a6",
  },
  {
    value: "abdomen",
    label: "Abdomen",
    description: "Digestive, surgical, or internal organ concerns.",
    color: "#f59e0b",
  },
  {
    value: "bones",
    label: "Bones / Joints",
    description: "Spine, shoulder, arm, or joint mobility issues.",
    color: "#6366f1",
  },
  {
    value: "legs",
    label: "Legs",
    description: "Running, knee, gait, and lower limb stability.",
    color: "#22c55e",
  },
  {
    value: "feet",
    label: "Feet",
    description: "Flat foot, toe shape, and ankle/foot balance.",
    color: "#84cc16",
  },
  {
    value: "height_weight",
    label: "Height / Weight",
    description: "BMI, body proportion, and official measurement checks.",
    color: "#0891b2",
  },
  {
    value: "skin",
    label: "Skin",
    description: "Tattoo, scars, and visible skin conditions.",
    color: "#f43f5e",
  },
  {
    value: "general",
    label: "General",
    description: "Any question that affects overall medical suitability.",
    color: "#64748b",
  },
];

const STORAGE_KEY = "defence-medical-cms-v3";
const NDA_EXAM_ID = "exam-army-nda";
const NAVY_EXAM_ID = "exam-navy-ssr";
const AFCAT_EXAM_ID = "exam-airforce-afcat";

const nowPlusDays = (days: number) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

const NDA_OFFICIAL_QUESTION_BANK: MedicalQuestion[] = [
  {
    id: "nda-q-general-constitution",
    examId: NDA_EXAM_ID,
    question:
      "Do you have weak body build, incomplete physical development, or any major congenital deformity or syndrome that affects normal function?",
    helper:
      "Self-check: include any long-standing body weakness, major developmental defect, or congenital problem that limits training, movement, or normal function.",
    bodyArea: "general",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "General body build or congenital developmental issues may not meet NDA entry standards.",
    treatment:
      "Take a physician review with all past records. If the issue is structural or congenital, it often needs specialist clearance and may not be correctable for NDA.",
    weight: 18,
    resolutionType: "likely_permanent",
    alternativeAdvice:
      "If a confirmed congenital or major developmental issue remains, check roles whose physical standards match your condition better.",
  },
  {
    id: "nda-q-swelling-lymph",
    examId: NDA_EXAM_ID,
    question:
      "Do you currently have any unexplained swelling, cyst, tumor, fistula, or enlarged lymph node anywhere on the body?",
    helper:
      "Self-check: include neck lumps, chronic cysts, swollen glands, or any untreated mass anywhere on the body.",
    bodyArea: "general",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Unexplained swelling or enlarged glands can lead to rejection until properly diagnosed.",
    treatment:
      "Get the swelling examined early and carry the diagnosis, scans, and treatment notes before relying on your medical readiness.",
    weight: 12,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-skin-pigmentation",
    examId: NDA_EXAM_ID,
    question:
      "Do you have vitiligo, major skin pigmentation change, or any skin disease that is more than a minor temporary rash?",
    helper:
      "Self-check: include vitiligo, spreading pigmentation disorders, chronic dermatitis, or visible skin disease likely to affect service conditions.",
    bodyArea: "skin",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Visible or chronic skin disease may not meet NDA medical standards.",
    treatment:
      "Take a dermatologist review and identify whether the condition is temporary, controlled, or disqualifying before the official medical.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-hernia",
    examId: NDA_EXAM_ID,
    question:
      "Do you currently have any hernia, or a past hernia surgery that is not fully healed and stable?",
    helper:
      "Self-check: include inguinal, abdominal-wall, or any other hernia. If you had surgery, it must be fully recovered as per policy timelines.",
    bodyArea: "abdomen",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Hernia or incomplete recovery after hernia surgery can affect NDA medical fitness.",
    treatment:
      "Get a surgeon review and wait for the required recovery period with no recurrence before trying again.",
    weight: 16,
    resolutionType: "correctable",
  },
  {
    id: "nda-q-disfiguring-scars",
    examId: NDA_EXAM_ID,
    question:
      "Do you have any scar that clearly limits movement, damages function, or causes major disfigurement?",
    helper:
      "Self-check: ignore small healed marks. Focus on scars that restrict joints, affect posture, or look significantly deforming.",
    bodyArea: "skin",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Function-limiting or severely disfiguring scars may not meet NDA standards.",
    treatment:
      "Take a surgical or dermatology review. Some scars are acceptable if fully healed and not function-limiting, but major ones need formal assessment.",
    weight: 10,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-av-malformation",
    examId: NDA_EXAM_ID,
    question:
      "Have you ever been diagnosed with an arteriovenous malformation or unusual blood-vessel malformation anywhere in the body?",
    helper:
      "Self-check: include any confirmed vascular malformation, abnormal vessel cluster, or AV malformation noted on scan or surgery records.",
    bodyArea: "heart",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A vascular malformation may create risk during service and can affect NDA fitness.",
    treatment:
      "Take vascular-surgery or specialist advice with all imaging reports before assuming fitness.",
    weight: 16,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-head-face-deformity",
    examId: NDA_EXAM_ID,
    question:
      "Do you have skull, face, or jaw asymmetry, old fracture deformity, sinus, or fistula affecting the head and face area?",
    helper:
      "Self-check: include visible asymmetry, depressed skull fracture history, chronic sinus/fistula near the face, or deformity after surgery or trauma.",
    bodyArea: "bones",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Head or face deformity can affect NDA medical clearance.",
    treatment:
      "Take maxillofacial or orthopaedic review with scans if the deformity is structural or due to old trauma.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-congenital-hereditary",
    examId: NDA_EXAM_ID,
    question:
      "Do you have any known congenital or hereditary disease, syndrome, or disability that is still active or functionally important?",
    helper:
      "Self-check: answer Yes if a doctor has diagnosed a hereditary or congenital condition that still matters clinically.",
    bodyArea: "general",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A congenital or hereditary disorder may not fit NDA entry standards.",
    treatment:
      "Get a formal specialist opinion with current functional status. Many confirmed structural syndromes are difficult to clear for NDA.",
    weight: 18,
    resolutionType: "likely_permanent",
    alternativeAdvice:
      "If a hereditary or congenital disorder remains clinically significant, consider roles with standards better matched to your profile.",
  },
  {
    id: "nda-q-psychological-traits",
    examId: NDA_EXAM_ID,
    question:
      "Do you have any ongoing behavioural, emotional, or psychological instability that can affect judgement, discipline, or training performance?",
    helper:
      "Self-check: include current severe anxiety, uncontrolled anger, unstable behaviour, or any condition already affecting daily function.",
    bodyArea: "brain",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Psychological instability can affect SSB and medical suitability for NDA.",
    treatment:
      "Take early mental-health support and get a professional opinion before depending on this self-check outcome.",
    weight: 16,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-speech-impediment",
    examId: NDA_EXAM_ID,
    question:
      "Do you have a speech impediment, pronounced stammer, or any speech issue that affects clear communication?",
    helper:
      "Self-check: minor occasional hesitation is different from a speech problem that regularly affects expression.",
    bodyArea: "brain",
    gender: "all",
    options: ["No", "Mild only", "Yes"],
    passingAnswers: ["No", "Mild only"],
    failSummary:
      "A significant speech impediment may affect NDA medical and service suitability.",
    treatment:
      "Take speech assessment if needed. Mild issues may still be acceptable, but pronounced impairment needs expert review.",
    weight: 10,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-vision-standard",
    examId: NDA_EXAM_ID,
    question:
      "Do you meet the NDA visual standard from the official chart for 10+2 / NDA entries?",
    helper:
      "Self-check: compare your latest eye prescription with the NDA chart shown below before answering Yes or No.",
    bodyArea: "eyes",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Your current vision may not match the NDA entry standard.",
    treatment:
      "Get a full eye checkup with visual acuity, refraction, and colour-perception testing, then compare it again with the NDA chart.",
    weight: 18,
    resolutionType: "specialist_review",
    alternativeAdvice:
      "If your vision misses NDA limits, compare whether another entry has a different visual standard.",
  },
  {
    id: "nda-q-major-eye-disease",
    examId: NDA_EXAM_ID,
    question:
      "Have you ever been diagnosed with squint, ptosis, or a serious cornea, lens, retina, or eye-structure problem?",
    helper:
      "Self-check: include old ophthalmology reports mentioning corneal lesion, cataract-like lens opacity, retinal lesion, ptosis, or squint.",
    bodyArea: "eyes",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A major eye disease can make you unfit for NDA medicals.",
    treatment:
      "Take an ophthalmologist review with updated reports. Structural eye diseases often need specialist clearance and some are disqualifying.",
    weight: 18,
    resolutionType: "likely_permanent",
    alternativeAdvice:
      "If a structural eye disease is confirmed, explore roles with more suitable visual criteria.",
  },
  {
    id: "nda-q-hearing-standard",
    examId: NDA_EXAM_ID,
    question:
      "Can you hear normal conversation and forced whisper clearly from 610 cm with each ear, without using any hearing aid?",
    helper:
      "Self-check: the policy uses a 610 cm hearing benchmark for conversational voice and forced whisper in each ear.",
    bodyArea: "ears",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Your hearing may not meet the NDA standard.",
    treatment:
      "Take an ENT review and hearing test. Do not guess if you already have reduced hearing, ear discharge, or past ear surgery.",
    weight: 16,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-ent-structural",
    examId: NDA_EXAM_ID,
    question:
      "Do you have any ear, nose, or throat structural problem such as eardrum disease, middle-ear issue, deviated nose causing trouble, nasal polyp, adenoid, or congenital ENT abnormality?",
    helper:
      "Self-check: include chronic ear disease, tympanic membrane problem, recurring sinus or adenoid issue, nasal deformity, or palate/lip abnormality.",
    bodyArea: "ears",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "ENT structural disease may affect NDA medical eligibility.",
    treatment:
      "Get an ENT assessment with reports. Some conditions improve after treatment, but untreated structural disease needs formal review.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-throat-jaw-gums",
    examId: NDA_EXAM_ID,
    question:
      "Do you have any throat, palate, tonsil, gum, or jaw-joint problem that affects chewing, speaking, swallowing, or normal mouth function?",
    helper:
      "Self-check: include recurrent tonsil disease, gum disease, painful jaw movement, or any throat condition affecting function.",
    bodyArea: "mouth",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Throat, gum, or jaw-function problems can affect NDA medical fitness.",
    treatment:
      "Take ENT or dental review and complete treatment before depending on the result.",
    weight: 12,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-heart-bp",
    examId: NDA_EXAM_ID,
    question:
      "Have you ever been told that you have heart disease, a murmur, high blood pressure, vessel disease, or a heart rhythm / conduction disorder?",
    helper:
      "Self-check: include congenital heart disease, persistent hypertension, rhythm issue, or any cardiac finding already noted by a doctor.",
    bodyArea: "heart",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A heart or blood-pressure issue can affect NDA medical clearance.",
    treatment:
      "Take a cardiology review with ECG, blood-pressure record, and past reports before relying on the result.",
    weight: 18,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-lung-tb-chronic",
    examId: NDA_EXAM_ID,
    question:
      "Do you have current or past tuberculosis, chronic lung disease, severe chest allergy, or any chest condition that affects breathing or endurance?",
    helper:
      "Self-check: include asthma-like chronic issues, repeated chest disease, connective-tissue chest disorders, or chronic breathlessness.",
    bodyArea: "lungs",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Chronic lung or chest disease may not meet NDA standards.",
    treatment:
      "Take a chest physician review and keep X-ray or breathing-test records ready. Service conditions demand stable respiratory health.",
    weight: 18,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-digestive-liver-pancreas",
    examId: NDA_EXAM_ID,
    question:
      "Do you have any digestive, liver, or pancreas disease, or a hereditary / genetic abdominal condition that is still active?",
    helper:
      "Self-check: include chronic liver disease, pancreatic disease, bowel disease, or inherited abdominal disorders already diagnosed.",
    bodyArea: "abdomen",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Digestive or hepatobiliary disease may affect NDA medical fitness.",
    treatment:
      "Get a physician or gastro review with ultrasound and lab reports if you already know of any abdominal disease.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-endocrine-system",
    examId: NDA_EXAM_ID,
    question:
      "Have you ever been diagnosed with thyroid disease or any other endocrine or reticuloendothelial disorder?",
    helper:
      "Self-check: include thyroid disorders, hormone disorders, or major blood-cell / lymphoid system disorders already diagnosed.",
    bodyArea: "general",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Endocrine or systemic blood-related disease can affect NDA eligibility.",
    treatment:
      "Take a physician or endocrinology review with current medication and lab records.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-genitourinary-system",
    examId: NDA_EXAM_ID,
    question:
      "Do you have any urinary, kidney, or genital-organ disease, or any malformation, atrophy, or enlargement of a related organ or gland?",
    helper:
      "Self-check: include urinary symptoms, kidney disease, genital-organ deformity, or doctor-confirmed organ abnormality.",
    bodyArea: "abdomen",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Genito-urinary disease may not meet NDA entry standards.",
    treatment:
      "Take a urology review with urine tests and ultrasound if any issue is already known.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-sti-history",
    examId: NDA_EXAM_ID,
    question:
      "Do you have any active, latent, or congenital sexually transmitted infection?",
    helper:
      "Self-check: answer Yes only if a doctor has diagnosed it. If you are unsure but have old treatment history, choose Not sure and verify.",
    bodyArea: "general",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "An active or latent sexually transmitted infection can affect medical clearance.",
    treatment:
      "Take proper treatment and keep specialist records. Do not hide any confirmed diagnosis.",
    weight: 10,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-mental-epilepsy-enuresis",
    examId: NDA_EXAM_ID,
    question:
      "Do you have any history of mental illness, epilepsy, insanity, urine incontinence, or bedwetting after the normal childhood age?",
    helper:
      "Self-check: include diagnosed epilepsy, major psychiatric history, current incontinence, or persistent enuresis history.",
    bodyArea: "brain",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Neurological or psychiatric history of this kind can affect NDA fitness.",
    treatment:
      "Take neurology or psychiatry review with past treatment papers if any such history exists.",
    weight: 20,
    resolutionType: "likely_permanent",
    alternativeAdvice:
      "If epilepsy or major psychiatric illness is confirmed, consider other career paths with safer medical requirements.",
  },
  {
    id: "nda-q-musculoskeletal-general",
    examId: NDA_EXAM_ID,
    question:
      "Do you have any diagnosed bone, joint, spine, or limb disorder that still affects strength, posture, or movement?",
    helper:
      "Self-check: this is a broad screen. Answer Yes if you already know of a musculoskeletal diagnosis that affects function.",
    bodyArea: "bones",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A musculoskeletal disorder may affect NDA physical suitability.",
    treatment:
      "Take an orthopaedic review and keep X-rays or treatment records ready if you have any known diagnosis.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-spine-chest-pelvis",
    examId: NDA_EXAM_ID,
    question:
      "Do you have scoliosis, kyphosis, torticollis, chest or pelvis deformity, deformed ribs, or any malunited fracture affecting posture?",
    helper:
      "Self-check: include spinal curvature, visible chest asymmetry, pelvic deformity, or old fracture healing in a bad position.",
    bodyArea: "bones",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Spine, chest, or pelvis deformity may not meet NDA standards.",
    treatment:
      "Get an orthopaedic assessment with imaging. Structural deformities often need formal measurement and may limit eligibility.",
    weight: 18,
    resolutionType: "likely_permanent",
    alternativeAdvice:
      "If a fixed structural deformity is confirmed, explore entries with less demanding structural standards.",
  },
  {
    id: "nda-q-upper-limb-joints",
    examId: NDA_EXAM_ID,
    question:
      "Do you have upper-limb deformity or joint problem such as cubitus valgus, cubitus varus, hypermobile joints, or fixed deformity of fingers or arms?",
    helper:
      "Self-check: include abnormal carrying angle, fingers bending abnormally, fixed joint shape, or any upper-limb deformity affecting drills and weapons handling.",
    bodyArea: "bones",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Upper-limb deformity or joint instability may not meet NDA standards.",
    treatment:
      "Take orthopaedic review and functional assessment. Fixed deformity usually needs detailed specialist opinion.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-lower-limb-deformity",
    examId: NDA_EXAM_ID,
    question:
      "Do you have knock knees, bow legs, shortened limb, hypermobile lower-limb joints, deformed toes, or any leg deformity affecting gait?",
    helper:
      "Self-check: include visible leg alignment problems, limp, shortened limb, or lower-limb deformity affecting running and balance.",
    bodyArea: "legs",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Lower-limb deformity or gait issue may affect NDA medical fitness.",
    treatment:
      "Take an orthopaedic examination and gait assessment. Fixed alignment issues can be difficult to clear.",
    weight: 16,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-amputation-shortening",
    examId: NDA_EXAM_ID,
    question:
      "Do you have any amputation, missing finger or toe, or a clearly shortened limb segment?",
    helper:
      "Self-check: include any loss of finger, toe, or limb segment, even if you function well in daily life.",
    bodyArea: "legs",
    gender: "all",
    options: ["No", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Amputation or shortened limb is usually not compatible with NDA entry standards.",
    treatment:
      "This is generally structural and not correctable for NDA. Take an official specialist opinion if you believe your case is exceptional.",
    weight: 20,
    resolutionType: "likely_permanent",
    alternativeAdvice:
      "If limb loss or shortening is confirmed, focus on roles and career paths with suitable physical criteria.",
  },
  {
    id: "nda-q-dental-jaw-discrepancy",
    examId: NDA_EXAM_ID,
    question:
      "Do you have any pathological jaw condition or a major upper-lower jaw mismatch that affects chewing or speech?",
    helper:
      "Self-check: include clearly uneven jaws, severe bite mismatch, or any jaw disease already diagnosed by a dentist or surgeon.",
    bodyArea: "mouth",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Jaw pathology or major jaw discrepancy can affect NDA dental fitness.",
    treatment:
      "Take a dental or maxillofacial review with current bite and jaw-function assessment.",
    weight: 12,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-tmj-opening",
    examId: NDA_EXAM_ID,
    question:
      "Do you have painful jaw clicking, jaw tenderness, jaw dislocation, or mouth opening less than about 30 mm?",
    helper:
      "Self-check: if you cannot fit roughly three fingers vertically between your teeth, or the jaw locks or dislocates, answer accordingly.",
    bodyArea: "mouth",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "TMJ dysfunction or restricted mouth opening may not meet NDA standards.",
    treatment:
      "Take TMJ or dental evaluation and complete treatment before the official medical.",
    weight: 12,
    resolutionType: "correctable",
  },
  {
    id: "nda-q-oral-fibrosis-lesion",
    examId: NDA_EXAM_ID,
    question:
      "Do you have oral submucous fibrosis, a suspicious oral lesion, or a mouth condition that restricts opening?",
    helper:
      "Self-check: include any pre-cancerous oral condition, tobacco-related fibrosis, or visible lesion inside the mouth.",
    bodyArea: "mouth",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A serious oral lesion or fibrosis may affect NDA fitness.",
    treatment:
      "Take an oral surgeon or dental specialist review immediately and do not delay treatment.",
    weight: 16,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-poor-oral-hygiene",
    examId: NDA_EXAM_ID,
    question:
      "Do you currently have gross calculus, deep gum pockets, bleeding gums, or generally poor oral hygiene?",
    helper:
      "Self-check: include visible tartar buildup, swollen gums, gum bleeding while brushing, or untreated periodontal disease.",
    bodyArea: "mouth",
    gender: "all",
    options: ["No", "Mild only", "Yes"],
    passingAnswers: ["No", "Mild only"],
    failSummary:
      "Poor oral hygiene or gum disease can affect NDA dental fitness.",
    treatment:
      "Take scaling, dental cleaning, and periodontal treatment early. Many oral-hygiene issues improve well with timely care.",
    weight: 8,
    resolutionType: "correctable",
  },
  {
    id: "nda-q-loose-teeth",
    examId: NDA_EXAM_ID,
    question:
      "Do you have more than two loose or mobile teeth right now?",
    helper:
      "Self-check: teeth that visibly move or feel unstable while chewing count here.",
    bodyArea: "mouth",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "More than two mobile teeth can lead to dental rejection.",
    treatment:
      "Take urgent dental treatment and stabilise the teeth before the official medical.",
    weight: 12,
    resolutionType: "correctable",
  },
  {
    id: "nda-q-maxillofacial-surgery",
    examId: NDA_EXAM_ID,
    question:
      "Have you had cosmetic or post-traumatic facial or jaw surgery within the last 24 weeks, or is the area still not fully healed?",
    helper:
      "Self-check: include maxillofacial surgery after trauma, cosmetic facial bone surgery, or jaw surgery with recent recovery.",
    bodyArea: "mouth",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Recent maxillofacial surgery needs more healing time before NDA medical fitness can be assumed.",
    treatment:
      "Wait for the required recovery period and ensure the surgical area is fully healed and stable before retrying.",
    weight: 10,
    resolutionType: "correctable",
  },
  {
    id: "nda-q-malocclusion",
    examId: NDA_EXAM_ID,
    question:
      "Does your bite or tooth alignment interfere with chewing, oral hygiene, nutrition, or normal daily function?",
    helper:
      "Self-check: include severe malocclusion that clearly affects chewing or makes cleaning teeth very difficult.",
    bodyArea: "mouth",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Severe malocclusion may affect NDA dental acceptance.",
    treatment:
      "Take orthodontic or maxillofacial advice early. Functional bite issues need treatment before relying on eligibility.",
    weight: 10,
    resolutionType: "correctable",
  },
  {
    id: "nda-q-chest-lesions",
    examId: NDA_EXAM_ID,
    question:
      "Have you ever been told you have tuberculosis, a lung lesion, heart lesion, or a chest-wall musculoskeletal lesion?",
    helper:
      "Self-check: include any scan finding involving the chest wall, lungs, or heart that has not been fully cleared.",
    bodyArea: "lungs",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Chest lesions or tuberculosis history can affect NDA medical fitness.",
    treatment:
      "Take chest-specialist review and carry imaging or treatment proof before appearing for the official medical.",
    weight: 16,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-abdomen-gu-specific",
    examId: NDA_EXAM_ID,
    question:
      "Do you have any of these: undescended testis, varicocele, organ enlargement, solitary or horseshoe kidney, abdominal cyst, stone, genital lesion, piles, fissure, or lymphadenitis?",
    helper:
      "Self-check: answer Yes if any of these conditions are diagnosed now or still unresolved. If you are female, answer based on the conditions relevant to you.",
    bodyArea: "abdomen",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Abdominal, renal, or genital conditions listed in the policy may affect NDA fitness.",
    treatment:
      "Take specialist review and updated scan or surgical records if any of these conditions are known.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-nervous-system",
    examId: NDA_EXAM_ID,
    question:
      "Do you have tremors, balance problems, or any nervous-system issue that affects control, coordination, or stability?",
    helper:
      "Self-check: include visible tremor, poor balance, recurring unsteadiness, or any diagnosed nervous-system disorder.",
    bodyArea: "brain",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Nervous-system issues can affect NDA medical fitness.",
    treatment:
      "Take a neurology review with current symptoms and treatment records before relying on the result.",
    weight: 16,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-skin-growths",
    examId: NDA_EXAM_ID,
    question:
      "Do you have haemangioma, multiple warts, corns, chronic dermatitis, skin infection, abnormal growth, or troublesome excessive sweating?",
    helper:
      "Self-check: include visible skin growths, persistent infection, or palmar/plantar hyperhidrosis that affects grip or function.",
    bodyArea: "skin",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Listed skin conditions may affect NDA medical clearance.",
    treatment:
      "Take dermatology treatment early. Some skin conditions are correctable, but uncontrolled chronic ones need formal review.",
    weight: 10,
    resolutionType: "correctable",
  },
  {
    id: "nda-q-weight-chart",
    examId: NDA_EXAM_ID,
    question:
      "Is your current weight within the NDA height-and-age chart for your height and age group?",
    helper:
      "Self-check: use the official chart shown below. If you are below 17 years, use the pediatric growth-chart note mentioned in the policy.",
    bodyArea: "height_weight",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Weight outside the NDA height-and-age chart can affect medical clearance.",
    treatment:
      "Use a structured diet and training plan, then re-check your latest weight against the official chart before the board.",
    weight: 12,
    resolutionType: "correctable",
  },
  {
    id: "nda-q-athlete-exception",
    examId: NDA_EXAM_ID,
    question:
      "If your weight is above the chart because of sports or body-building, do you still meet the exception checks like BMI below 25 and normal waist and metabolic limits?",
    helper:
      "Self-check: choose Not applicable if your weight is already within the chart. Otherwise compare BMI, waist-hip ratio, waist circumference, and metabolic test status.",
    bodyArea: "height_weight",
    gender: "all",
    options: [
      "Not applicable - my weight is already within the chart",
      "Yes, all exception checks are normal",
      "No or not sure",
    ],
    passingAnswers: [
      "Not applicable - my weight is already within the chart",
      "Yes, all exception checks are normal",
    ],
    failSummary:
      "If your weight is above the chart, you still need to satisfy the policy exception checks.",
    treatment:
      "Get BMI, waist ratio, waist measurement, and metabolic testing documented properly before depending on the exception.",
    weight: 10,
    resolutionType: "specialist_review",
  },
  {
    id: "nda-q-lasik-radial-keratotomy",
    examId: NDA_EXAM_ID,
    question:
      "Have you ever had LASIK, SMILE, PRK, or radial keratotomy eye surgery?",
    helper:
      "Self-check: for NDA / 10+2 entry standards in this policy chart, LASIK or equivalent is not permitted, and radial keratotomy is a permanent disqualifier.",
    bodyArea: "eyes",
    gender: "all",
    options: ["No", "Yes", "Not sure"],
    passingAnswers: ["No"],
    failSummary:
      "Refractive surgery history may make you unfit for NDA under this vision policy.",
    treatment:
      "Verify your exact procedure type and official entry standard. For NDA chart values here, LASIK-equivalent surgery is not permitted.",
    weight: 18,
    resolutionType: "likely_permanent",
    alternativeAdvice:
      "If you have had refractive surgery, compare whether another entry route has a different policy.",
  },
  {
    id: "nda-q-post-surgery-recovery",
    examId: NDA_EXAM_ID,
    question:
      "Have you had any recent surgery or joint injury that has not completed the required recovery period, or any ligament / meniscus tear of a joint?",
    helper:
      "Self-check: include recent open or laparoscopic surgery, hernia or gall-bladder surgery, and any ligament or meniscus tear. The policy gives minimum recovery timelines and treats joint ligament/meniscus injuries seriously.",
    bodyArea: "abdomen",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Recent surgery, incomplete healing, or ligament / meniscus injury may affect NDA medical fitness.",
    treatment:
      "Wait for the required recovery period, ensure scar healing and functional recovery, and keep surgeon documents ready before re-checking.",
    weight: 16,
    resolutionType: "correctable",
  },
];

const AFCAT_OFFICIAL_QUESTION_BANK: MedicalQuestion[] = [
  {
    id: "afcat-q-height-branch",
    examId: AFCAT_EXAM_ID,
    question: "Does your current height meet the AFCAT minimum for the branch you want?",
    helper:
      "Self-check: measure barefoot against a wall. Ground duty minimum is 157 cm for men and 152 cm for women. Flying branches are 157 cm, but pilots, FTE, and WSO on Su-30 need 162 cm.",
    bodyArea: "height_weight",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary: "Your height may be below the AFCAT minimum for the branch you want.",
    treatment:
      "Re-measure your height correctly once. If you still remain below the required minimum, this is usually not correctable for AFCAT and you should focus on roles with matching height criteria.",
    weight: 18,
    resolutionType: "likely_permanent",
    alternativeAdvice:
      "Consider branches or other defence exams whose height criteria match your profile.",
  },
  {
    id: "afcat-q-flying-anthropometry",
    examId: AFCAT_EXAM_ID,
    question:
      "For AFCAT, are you either applying only for ground duty, or already within the flying anthropometry limits?",
    helper:
      "Self-check: if you want flying duty, sitting height must be 81.5-96 cm, leg length 99-120 cm, and thigh length 64 cm or less. If you want only ground duty, answer Yes.",
    bodyArea: "height_weight",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Your body measurements may not match the flying-duty anthropometry limits.",
    treatment:
      "Get sitting height, leg length, and thigh length measured accurately once. If the values stay outside the flying limits, you should avoid flying roles and focus on eligible ground branches.",
    weight: 14,
    resolutionType: "likely_permanent",
    alternativeAdvice:
      "If only flying anthropometry fails, consider AFCAT ground duty branches or another defence role.",
  },
  {
    id: "afcat-q-weight-chart",
    examId: AFCAT_EXAM_ID,
    question:
      "Is your current weight inside the official AFCAT height-and-age chart for your gender?",
    helper:
      "Self-check: use the official AFCAT chart shown below and compare your latest weight with the row for your height and the column for your age group.",
    bodyArea: "height_weight",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Weight outside the official chart can affect AFCAT medical clearance.",
    treatment:
      "Work on a structured diet and training plan, then compare your updated weight with the official chart again before the medical board.",
    weight: 10,
    resolutionType: "correctable",
  },
  {
    id: "afcat-q-chest-male",
    examId: AFCAT_EXAM_ID,
    question:
      "Is your chest at least 77 cm, with at least 5 cm expansion after a deep breath?",
    helper:
      "Self-check: this applies to male candidates. Measure chest circumference at rest, then after full inhalation. Both the base chest size and expansion matter.",
    bodyArea: "lungs",
    gender: "male",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Your chest measurement may fall short of the male AFCAT standard.",
    treatment:
      "Repeat the measurement correctly and get an official reading done. Chest expansion can improve with breathing drills, but a repeated shortfall may still affect eligibility.",
    weight: 12,
    resolutionType: "specialist_review",
  },
  {
    id: "afcat-q-vision-standard",
    examId: AFCAT_EXAM_ID,
    question:
      "Do you meet the AFCAT vision and colour-vision standard for your intended branch?",
    helper:
      "Self-check: use your latest eye prescription or ophthalmology report and compare it with the branch-wise chart shown below before answering.",
    bodyArea: "eyes",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Your present visual standard may not match the AFCAT branch requirements.",
    treatment:
      "Take a full eye checkup with visual acuity, refraction, and colour-vision testing. Confirm the exact standard for your intended branch before attempting the official medical.",
    weight: 18,
    resolutionType: "specialist_review",
    alternativeAdvice:
      "If your vision does not meet one branch standard, check whether another Air Force branch or another exam has different limits.",
  },
  {
    id: "afcat-q-major-eye-condition",
    examId: AFCAT_EXAM_ID,
    question:
      "Have you ever been diagnosed with squint, night blindness, keratoconus, serious corneal disease, or a central retinal problem?",
    helper:
      "Self-check: check old eye reports if you are unsure. These are major eye rejection points in Air Force medicals.",
    bodyArea: "eyes",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A major eye condition may make you unfit for AFCAT medicals.",
    treatment:
      "Take a specialist ophthalmology opinion with updated cornea and retina evaluation. Some minor findings can be reviewed, but conditions like proven night blindness or keratoconus are usually disqualifying.",
    weight: 20,
    resolutionType: "likely_permanent",
    alternativeAdvice:
      "If this diagnosis is confirmed, consider a different branch or exam with more suitable visual criteria.",
  },
  {
    id: "afcat-q-refractive-surgery",
    examId: AFCAT_EXAM_ID,
    question:
      "If you had LASIK, PRK, SMILE, or similar surgery, was it done after age 20 and more than 12 months ago without complications?",
    helper:
      "Self-check: if you never had refractive surgery, answer Yes. If you had it, also confirm corneal thickness is at least 450 microns, axial length is 26 mm or less, and previous power was not above 6D.",
    bodyArea: "eyes",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Your refractive-surgery history may not satisfy AFCAT conditions.",
    treatment:
      "Collect your surgery records and get corneal thickness, axial length, residual power, and current visual status checked by an ophthalmologist before the medical board.",
    weight: 12,
    resolutionType: "specialist_review",
  },
  {
    id: "afcat-q-hearing-whisper",
    examId: AFCAT_EXAM_ID,
    question:
      "Can you hear whispered speech clearly with both ears and do you feel your hearing is normal?",
    helper:
      "Self-check: ask someone to speak softly or whisper from a distance after checking both ears are clear. Official testing may include audiometry.",
    bodyArea: "ears",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Hearing performance may not meet the AFCAT ENT standard.",
    treatment:
      "Get an ENT review and a formal hearing test. Wax or infection may improve, but persistent hearing loss needs specialist clearance.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "afcat-q-ear-disease",
    examId: AFCAT_EXAM_ID,
    question:
      "Do you have tinnitus, repeated ear infections, eardrum problems, ear surgery history, or any hearing device?",
    helper:
      "Self-check: include old tympanoplasty, mastoid surgery, chronic ear discharge, tinnitus, and implanted hearing devices while answering.",
    bodyArea: "ears",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "An ear disease or ear-procedure history may affect AFCAT fitness.",
    treatment:
      "Take all old ENT records for specialist review. Some healed cases are accepted only when PTA and tympanometry are normal, while other conditions remain disqualifying.",
    weight: 16,
    resolutionType: "specialist_review",
  },
  {
    id: "afcat-q-ent-nasal",
    examId: AFCAT_EXAM_ID,
    question:
      "Do you have allergic rhinitis, major nasal blockage, nasal polyps, or trouble breathing freely through the nose?",
    helper:
      "Self-check: notice whether one or both sides stay blocked, you breathe mainly through the mouth, or you already use treatment for chronic nasal allergy.",
    bodyArea: "ears",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Chronic ENT blockage or nasal allergy can affect AFCAT clearance.",
    treatment:
      "Get an ENT assessment. Some structural issues improve after treatment or corrective surgery, but chronic allergic rhinitis and polyps need formal review before you appear.",
    weight: 12,
    resolutionType: "specialist_review",
  },
  {
    id: "afcat-q-asthma-wheeze",
    examId: AFCAT_EXAM_ID,
    question:
      "Do you have asthma, repeated wheezing, chronic bronchitis, or breathing trouble during exercise?",
    helper:
      "Self-check: include past diagnosed asthma, inhaler use, repeated wheeze, or exercise-related chest tightness while answering.",
    bodyArea: "lungs",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Asthma or repeated wheezing can be a major AFCAT rejection point.",
    treatment:
      "Take a respiratory specialist opinion with spirometry if advised. Persistent asthma history often remains a serious issue for Air Force entry.",
    weight: 18,
    resolutionType: "specialist_review",
    alternativeAdvice:
      "If asthma remains active or documented, explore roles or exams with less restrictive respiratory criteria.",
  },
  {
    id: "afcat-q-heart-history",
    examId: AFCAT_EXAM_ID,
    question:
      "Do you have any congenital heart condition, heart surgery history, intervention history, or unexplained chest pain under medical review?",
    helper:
      "Self-check: include murmur under treatment, congenital defects, angioplasty or cardiac procedures, and any ongoing cardiology follow-up.",
    bodyArea: "heart",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A heart condition or cardiac history may make you unfit for AFCAT.",
    treatment:
      "Take a cardiology opinion with ECG, echo, or other records if advised. Significant structural or surgical cardiac history is often disqualifying for Air Force entry.",
    weight: 20,
    resolutionType: "likely_permanent",
    alternativeAdvice:
      "If the cardiac issue is confirmed, consider other roles only after specialist guidance and eligibility review.",
  },
  {
    id: "afcat-q-spine-history",
    examId: AFCAT_EXAM_ID,
    question:
      "Do you have recurrent back pain, spinal deformity, slipped disc, spine fracture, or spine surgery history?",
    helper:
      "Self-check: stand straight, bend forward, and note any restriction, visible asymmetry, or old spine-treatment records before answering.",
    bodyArea: "bones",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A spinal issue may affect AFCAT military fitness assessment.",
    treatment:
      "Get an orthopaedic or spine specialist review with old X-rays or MRI if available. Many spinal disorders need formal clearance and some remain disqualifying.",
    weight: 18,
    resolutionType: "specialist_review",
  },
  {
    id: "afcat-q-upper-limb-stability",
    examId: AFCAT_EXAM_ID,
    question:
      "Do you have recurrent shoulder dislocation, finger hypermobility, fixed deformity, or loss of upper-limb function?",
    helper:
      "Self-check: include repeated shoulder slipping, fingers bending backward excessively, fixed finger deformity, or trouble gripping and lifting.",
    bodyArea: "bones",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Upper-limb instability or deformity may not meet AFCAT standards.",
    treatment:
      "Take an orthopaedic review with movement testing. If the joint is unstable, fixed, or functionally weak, you may need specialist advice before attempting the exam.",
    weight: 12,
    resolutionType: "specialist_review",
  },
  {
    id: "afcat-q-flat-feet",
    examId: AFCAT_EXAM_ID,
    question:
      "When you stand on your toes, do your foot arches return and can you balance or run without pain?",
    helper:
      "Self-check: rise on your toes barefoot. Flexible, painless arches are better; rigid flat feet, heel eversion, or painful balance problems are warning signs.",
    bodyArea: "feet",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Your foot arch pattern may not meet AFCAT lower-limb standards.",
    treatment:
      "Take an orthopaedic or sports-medicine review. Flexible feet may still pass, but rigid or painful flat feet need formal assessment.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "afcat-q-knee-leg-alignment",
    examId: AFCAT_EXAM_ID,
    question:
      "Do you have knock knees, bow legs, ACL reconstruction history, ligament laxity, or major knee instability?",
    helper:
      "Self-check: stand with knees or ankles together and note the gap. Males with more than 5 cm knock-knee gap and females with more than 8 cm are unfit; bow legs above 7 cm are also unfit.",
    bodyArea: "legs",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Knee alignment, ligament, or stability issues may affect AFCAT fitness.",
    treatment:
      "Get an orthopaedic assessment with measurements and old surgical papers if any. Some alignment or ligament conditions remain major obstacles for service entry.",
    weight: 16,
    resolutionType: "specialist_review",
  },
  {
    id: "afcat-q-neuro-psych",
    examId: AFCAT_EXAM_ID,
    question:
      "Do you have a history of epilepsy, fainting fits, severe migraine, stammering, or serious mental-health disorder?",
    helper:
      "Self-check: include seizures, repeated unexplained fainting, migraine with visual symptoms, psychosis, chronic mental instability, or a clear stammer.",
    bodyArea: "brain",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A neurological or psychological condition may make you unfit for AFCAT.",
    treatment:
      "Take a neurologist or psychiatrist review with documented history. Several of these conditions are treated as major rejection points in Air Force medicals.",
    weight: 20,
    resolutionType: "likely_permanent",
    alternativeAdvice:
      "If this history is confirmed, consider a different role or exam after specialist guidance.",
  },
  {
    id: "afcat-q-dental",
    examId: AFCAT_EXAM_ID,
    question:
      "Do you have at least 14 dental points and no major untreated dental or jaw problem?",
    helper:
      "Self-check: AFCAT expects a minimum of 14 dental points and healthy usable teeth. Loose teeth, many cavities, major jaw issues, or gum disease can reduce the count.",
    bodyArea: "mouth",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Your dental condition may fall short of AFCAT medical standards.",
    treatment:
      "Visit a dentist for cleaning, fillings, extractions, gum treatment, or a full dental-point evaluation before the official medical examination.",
    weight: 10,
    resolutionType: "correctable",
  },
  {
    id: "afcat-q-abdomen-surgery",
    examId: AFCAT_EXAM_ID,
    question:
      "Do you currently have hernia, piles, fistula, fissure, or a recent abdominal surgery without the required recovery gap?",
    helper:
      "Self-check: current hernia is unfit. Laparoscopic appendectomy usually needs 4 weeks, open appendectomy 12 weeks, and many open abdominal surgeries need longer recovery before review.",
    bodyArea: "abdomen",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Current abdominal disease or insufficient recovery time can affect AFCAT clearance.",
    treatment:
      "Take a surgeon or gastro review, complete the required healing period, and carry operative records plus recovery proof before the medical board.",
    weight: 14,
    resolutionType: "correctable",
  },
  {
    id: "afcat-q-skin-scars",
    examId: AFCAT_EXAM_ID,
    question:
      "Do you have large or multiple keloids, or extensive scars that limit movement or create major deformity?",
    helper:
      "Self-check: minor healed superficial scars usually do not matter, but large keloids or extensive scarring over the torso or limbs are warning signs.",
    bodyArea: "skin",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Significant keloids or extensive scars may lead to AFCAT rejection.",
    treatment:
      "Take a dermatologist or surgeon opinion. Minor scars may pass, but large keloids or function-limiting scars often remain difficult to clear.",
    weight: 12,
    resolutionType: "specialist_review",
    alternativeAdvice:
      "If specialist review confirms a permanent limitation, consider another role with less restrictive medical demand.",
  },
  {
    id: "afcat-q-male-genital",
    examId: AFCAT_EXAM_ID,
    question:
      "Do you currently have varicocele, hydrocele, undescended testis, or any active scrotal or testicular swelling?",
    helper:
      "Self-check: this applies to male candidates. Current varicocele or hydrocele is unfit. Operated cases are usually reviewed only after the required healing period.",
    bodyArea: "abdomen",
    gender: "male",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A current male urogenital condition may delay or block AFCAT medical clearance.",
    treatment:
      "Take a surgery or urology opinion, complete treatment if advised, and wait for the required recovery period before the official medical review.",
    weight: 12,
    resolutionType: "correctable",
  },
  {
    id: "afcat-q-female-gyn",
    examId: AFCAT_EXAM_ID,
    question:
      "Do you currently have pregnancy, active gynecological disease, significant prolapse, endometriosis, or marked male-pattern hirsutism?",
    helper:
      "Self-check: this applies to female candidates. Current pregnancy is a rejection point for the present attempt, and some gynecological conditions need specialist review before clearance.",
    bodyArea: "abdomen",
    gender: "female",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A current female-specific medical condition may affect AFCAT fitness.",
    treatment:
      "Take a gynecologist review with current reports. Time-based conditions like pregnancy can be reassessed after the official waiting period, while persistent diseases need specialist clearance.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "afcat-q-hb-male",
    examId: AFCAT_EXAM_ID,
    question: "Is your latest haemoglobin 13 g/dL or higher?",
    helper:
      "Self-check: this applies to male candidates. Use a recent CBC or haemoglobin test instead of guessing.",
    bodyArea: "general",
    gender: "male",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Low haemoglobin can make you temporarily unfit for AFCAT medicals.",
    treatment:
      "Repeat CBC testing, identify the reason for low haemoglobin, and correct it with medical treatment, diet changes, or supplements advised by your doctor.",
    weight: 10,
    resolutionType: "correctable",
  },
  {
    id: "afcat-q-hb-female",
    examId: AFCAT_EXAM_ID,
    question: "Is your latest haemoglobin 12 g/dL or higher?",
    helper:
      "Self-check: this applies to female candidates. Use a recent CBC or haemoglobin test instead of estimating.",
    bodyArea: "general",
    gender: "female",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Low haemoglobin can make you temporarily unfit for AFCAT medicals.",
    treatment:
      "Repeat CBC testing, identify the reason for low haemoglobin, and correct it with medical treatment, diet changes, or supplements advised by your doctor.",
    weight: 10,
    resolutionType: "correctable",
  },
];

const NAVY_OFFICIAL_QUESTION_BANK: MedicalQuestion[] = [
  {
    id: "navy-q-build",
    examId: NAVY_EXAM_ID,
    question:
      "Is your current body build neither underweight, overweight, nor obese for Navy entry?",
    helper:
      "Self-check: use your latest height and weight. Navy checks for a healthy build, not weak constitution, not underweight, and not obesity.",
    bodyArea: "height_weight",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Your present body build may not match Indian Navy entry standards.",
    treatment:
      "Measure your height and weight accurately, improve nutrition or training as needed, and re-check your body profile before the official medical board.",
    weight: 12,
    resolutionType: "correctable",
  },
  {
    id: "navy-q-hearing-whisper",
    examId: NAVY_EXAM_ID,
    question:
      "Can you hear a forced whisper clearly from about 6 metres with each ear separately?",
    helper:
      "Self-check: stand with your back to the speaker and test one ear at a time from about 610 cm. Navy still confirms this with formal ENT checks.",
    bodyArea: "ears",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Your hearing may not meet the Indian Navy whisper-test standard.",
    treatment:
      "Take an ENT review and formal audiometry. Wax, infection, or temporary blockage may improve, but persistent hearing loss needs specialist clearance.",
    weight: 16,
    resolutionType: "specialist_review",
  },
  {
    id: "navy-q-ear-history",
    examId: NAVY_EXAM_ID,
    question:
      "Do you have repeated ear pain, tinnitus, vertigo, ear discharge, eardrum perforation, or past middle-ear surgery?",
    helper:
      "Self-check: include chronic otitis media, perforated eardrum, tympanoplasty, myringoplasty, mastoid surgery, or any hearing implant.",
    bodyArea: "ears",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "An ear disease or ear-surgery history may affect Navy medical fitness.",
    treatment:
      "Carry old ENT records and get a specialist review with PTA and tympanometry. Some healed minor cases may pass, but many middle-ear surgeries remain disqualifying.",
    weight: 18,
    resolutionType: "specialist_review",
    alternativeAdvice:
      "If a permanent hearing problem or disqualifying ear surgery is confirmed, consider another role with safer hearing criteria.",
  },
  {
    id: "navy-q-nose-throat",
    examId: NAVY_EXAM_ID,
    question:
      "Do you have marked nasal allergy, nasal polyps, chronic sinus disease, large septal perforation, or jaw/throat disease affecting normal function?",
    helper:
      "Self-check: include chronic blocked nose from allergy, past nasal-polyp surgery, septal perforation, persistent sinus disease, or trouble opening and using the jaw normally.",
    bodyArea: "ears",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A chronic nose or throat condition may not meet Navy medical standards.",
    treatment:
      "Take an ENT assessment. Some treatable conditions improve after proper surgery or recovery, but nasal polyposis and significant chronic allergy need formal review.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "navy-q-vision-standard",
    examId: NAVY_EXAM_ID,
    question:
      "Do you meet the required Navy visual standard for the entry category you are applying for?",
    helper:
      "Self-check: compare your latest eye prescription with the vision standards shown below before answering Yes or No.",
    bodyArea: "eyes",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Your current vision may not match the required Navy entry standard.",
    treatment:
      "Get a full eye checkup with refraction and colour-vision testing, then compare the result with the standard for your entry category before the official board.",
    weight: 18,
    resolutionType: "specialist_review",
  },
  {
    id: "navy-q-major-eye-disease",
    examId: NAVY_EXAM_ID,
    question:
      "Have you ever been diagnosed with manifest squint, keratoconus, pseudophakia, serious lens opacity, optic nerve drusen, or unsafe retinal lattice degeneration?",
    helper:
      "Self-check: check your old eye reports if needed. These are major Navy eye rejection points and should not be guessed.",
    bodyArea: "eyes",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A major eye condition may make you unfit for Indian Navy entry.",
    treatment:
      "Take an ophthalmologist review with current retina, cornea, and lens findings. Some mild peripheral findings can be reassessed, but many listed conditions are disqualifying.",
    weight: 20,
    resolutionType: "likely_permanent",
    alternativeAdvice:
      "If this diagnosis is confirmed, focus on a different role or exam with eye criteria closer to your profile.",
  },
  {
    id: "navy-q-refractive-surgery",
    examId: NAVY_EXAM_ID,
    question:
      "If you had PRK, LASIK, or SMILE, was it done after age 20 and more than 12 months ago with all allowed limits satisfied?",
    helper:
      "Self-check: if you never had refractive surgery, answer Yes. If you had it, surgery must be after age 20, over 12 months old, pre-op power not above +/-6D, retina normal, axial length 26 mm or less, cornea at least 450 microns, and residual power within the permitted entry limit.",
    bodyArea: "eyes",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Your refractive-surgery history may not meet Navy entry rules.",
    treatment:
      "Carry the surgery certificate, pre-operative power details, current axial length, corneal thickness, and retina report for specialist review before the medical board.",
    weight: 14,
    resolutionType: "specialist_review",
    alternativeAdvice:
      "Kerato-refractive surgery is not accepted for submarine, diving, and MARCO-related roles. Choose your role accordingly.",
  },
  {
    id: "navy-q-speech",
    examId: NAVY_EXAM_ID,
    question: "Is your speech clear without a pronounced stammer?",
    helper:
      "Self-check: mild stammering that does not affect expression may still be acceptable, but pronounced stammering is usually rejected.",
    bodyArea: "mouth",
    gender: "all",
    options: ["Yes, speech is clear", "Mild stammer only", "Pronounced stammer"],
    passingAnswers: ["Yes, speech is clear", "Mild stammer only"],
    failSummary:
      "Speech impediment may affect your Navy medical suitability.",
    treatment:
      "If speech difficulty is noticeable, take a speech specialist or ENT opinion and assess whether it materially affects expression before the official medical.",
    weight: 10,
    resolutionType: "specialist_review",
  },
  {
    id: "navy-q-chest-expansion",
    examId: NAVY_EXAM_ID,
    question:
      "Is your chest well formed and does it expand by at least 5 cm on full breathing?",
    helper:
      "Self-check: measure chest size after normal exhalation and after deep inhalation. Navy expects the difference to be at least 5 cm.",
    bodyArea: "lungs",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Chest form or chest expansion may not meet Navy standards.",
    treatment:
      "Re-check the measurement correctly and take a doctor or physiotherapist opinion if chest movement feels restricted or poorly formed.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "navy-q-respiratory",
    examId: NAVY_EXAM_ID,
    question:
      "Do you have chronic cough, bronchial asthma, tuberculosis history, or any lung or pleural disease?",
    helper:
      "Self-check: include inhaler use, repeated wheezing, old pulmonary TB, chronic bronchitis, or any abnormal chest X-ray history.",
    bodyArea: "lungs",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A respiratory condition may affect Navy service fitness.",
    treatment:
      "Take a respiratory specialist opinion with current chest evaluation if needed. Persistent asthma, TB, or lung disease needs formal review before you continue.",
    weight: 18,
    resolutionType: "specialist_review",
    alternativeAdvice:
      "If a chronic respiratory diagnosis remains active, you may need to explore another role or exam.",
  },
  {
    id: "navy-q-cardiovascular",
    examId: NAVY_EXAM_ID,
    question:
      "Do you have heart disease, murmur, click, abnormal ECG history, repeated BP above 140/90, or an abnormal resting pulse?",
    helper:
      "Self-check: include persistent rest pulse above 96 or below 40, old cardiology review, chest murmur, abnormal ECG, or known blood-pressure treatment.",
    bodyArea: "heart",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A cardiovascular issue may stop Navy medical clearance.",
    treatment:
      "Take a cardiologist review with ECG, echo, and blood-pressure records. Some benign ECG findings pass only after normal specialist evaluation.",
    weight: 20,
    resolutionType: "specialist_review",
  },
  {
    id: "navy-q-abdomen-hernia",
    examId: NAVY_EXAM_ID,
    question:
      "Do you currently have hernia, abdominal-organ disease, peptic-ulcer history, or recent abdominal surgery without the required recovery gap?",
    helper:
      "Self-check: current hernia is not acceptable. Navy also checks recovery gap after surgeries like hernia repair, cholecystectomy, appendectomy, fistula, fissure, hemorrhoids, hydrocele, and varicocele operations.",
    bodyArea: "abdomen",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Current abdominal disease or incomplete post-surgery recovery may affect Navy fitness.",
    treatment:
      "Take surgical records, complete the required healing period, and confirm there is no recurrence or incisional hernia before the official medical board.",
    weight: 16,
    resolutionType: "correctable",
  },
  {
    id: "navy-q-renal-urinary",
    examId: NAVY_EXAM_ID,
    question:
      "Do you have kidney stones, urinary incontinence, abnormal urine tests, or kidney/urethra disease?",
    helper:
      "Self-check: include any history of renal calculi, albumin or sugar in urine, nocturnal enuresis, bladder diverticulum, or kidney cyst found in reports.",
    bodyArea: "abdomen",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A renal or urinary issue may make you unfit for Navy entry.",
    treatment:
      "Take a urology review with urine reports, ultrasound, and old treatment records. Even past kidney-stone history needs proper evaluation.",
    weight: 16,
    resolutionType: "specialist_review",
    alternativeAdvice:
      "If a permanent renal issue is confirmed, consider another role or exam after specialist advice.",
  },
  {
    id: "navy-q-dental",
    examId: NAVY_EXAM_ID,
    question:
      "Do you have at least 14 dental points and enough sound natural teeth for proper chewing?",
    helper:
      "Self-check: Navy expects at least 14 dental points, at least 4 of 6 front teeth and 6 of 10 back teeth in each jaw, and no severe pyorrhea. Artificial dentures are not counted.",
    bodyArea: "mouth",
    gender: "all",
    options: ["Yes", "No", "Not sure"],
    passingAnswers: ["Yes"],
    failSummary:
      "Your dental condition may be below Navy minimum standards.",
    treatment:
      "Take a dental checkup for cleaning, fillings, gum treatment, or point assessment before the official medical examination.",
    weight: 12,
    resolutionType: "correctable",
  },
  {
    id: "navy-q-skin-sti",
    examId: NAVY_EXAM_ID,
    question:
      "Do you have major skin disease, hyperhidrosis, disfiguring scars, or any present or past sexually transmitted disease concern?",
    helper:
      "Self-check: include severe skin disease, heavy sweating of palms/soles/armpits, scars causing disability or disfigurement, or old groin/genital scars suggestive of STI.",
    bodyArea: "skin",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A skin or STI-related issue may affect Navy medical clearance.",
    treatment:
      "Take a dermatologist or physician review with current reports. Some trivial skin issues settle, but disfiguring scars or persistent conditions need formal clearance.",
    weight: 12,
    resolutionType: "specialist_review",
  },
  {
    id: "navy-q-spine-scoliosis",
    examId: NAVY_EXAM_ID,
    question:
      "Do you have significant scoliosis, spinal deformity, skeletal disease, or joint problems that limit function?",
    helper:
      "Self-check: mild asymptomatic scoliosis can sometimes be acceptable, but pain, movement restriction, chest asymmetry, nerve symptoms, or obvious structural deformity are warning signs.",
    bodyArea: "bones",
    gender: "all",
    options: [
      "No issue",
      "Mild only, no symptoms",
      "Yes, significant or movement is restricted",
    ],
    passingAnswers: ["No issue", "Mild only, no symptoms"],
    failSummary:
      "A spine or skeletal issue may not meet Navy entry standards.",
    treatment:
      "Take an orthopaedic review with X-rays if needed. Mild asymptomatic cases may pass, but painful or structurally significant deformity needs specialist clearance.",
    weight: 16,
    resolutionType: "specialist_review",
  },
  {
    id: "navy-q-upper-limb-function",
    examId: NAVY_EXAM_ID,
    question:
      "Do you have hyperextensible finger joints, fixed finger deformity, complex syndactyly, elbow hyperextension above 10 degrees, or impaired joint movement?",
    helper:
      "Self-check: fingers bending back beyond 90 degrees, fixed mallet finger, complex syndactyly, or elbow hyperextension beyond 10 degrees are important Navy rejection points.",
    bodyArea: "bones",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Upper-limb instability or deformity may affect Navy medical fitness.",
    treatment:
      "Take an orthopaedic or hand-surgery review. Some mild post-operative or minor old issues may be accepted only after proper healing and normal function.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "navy-q-fracture-gait",
    examId: NAVY_EXAM_ID,
    question:
      "Do you have amputation, abnormal gait, major limb asymmetry, intra-articular fracture history, implant still in place, or recent long-bone fracture recovery?",
    helper:
      "Self-check: intra-articular fractures are major problems, implants in place are not acceptable, and long-bone fractures need proper healing time and full function before review.",
    bodyArea: "legs",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Old fractures, implants, or gait problems may not meet Navy standards.",
    treatment:
      "Take orthopaedic records, X-rays, and recovery proof. Navy usually checks alignment, nerve status, soft tissue loss, and full function before declaring such cases fit.",
    weight: 16,
    resolutionType: "specialist_review",
  },
  {
    id: "navy-q-lower-limb-feet",
    examId: NAVY_EXAM_ID,
    question:
      "Do you have foot or toe deformity, painful flat feet, knock knees, major leg curvature, mild varicose veins only, or joint movement problems?",
    helper:
      "Self-check: mild knock knees under 5 cm, mild leg curvature not affecting walking/running, and mild varicose veins may still be accepted. Painful deformity or restricted movement is not.",
    bodyArea: "feet",
    gender: "all",
    options: [
      "No issue",
      "Mild only, no effect on walking or running",
      "Yes, significant or painful",
    ],
    passingAnswers: ["No issue", "Mild only, no effect on walking or running"],
    failSummary:
      "Lower-limb or foot structure may not meet Navy entry standards.",
    treatment:
      "Take an orthopaedic or vascular review if symptoms exist. Mild cases may pass, but painful or function-limiting deformity needs specialist clearance.",
    weight: 14,
    resolutionType: "specialist_review",
  },
  {
    id: "navy-q-neuro-psych",
    examId: NAVY_EXAM_ID,
    question:
      "Do you have tremors, fits, recurrent severe headaches or migraine, or a history of psychiatric illness or nervous instability?",
    helper:
      "Self-check: include epilepsy, repeated migraine, visible tremors, diagnosed psychiatric illness, or strong documented instability in you or your close family history if already known.",
    bodyArea: "brain",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A neurological or psychiatric concern may affect Navy medical clearance.",
    treatment:
      "Take a neurologist or psychiatrist review with proper history and reports. These conditions are reviewed strictly before Navy entry.",
    weight: 18,
    resolutionType: "specialist_review",
    alternativeAdvice:
      "If this history is confirmed and persistent, consider another role or exam after specialist guidance.",
  },
  {
    id: "navy-q-blood-report",
    examId: NAVY_EXAM_ID,
    question:
      "Has any recent blood report shown very high haemoglobin, high eosinophils, or high monocytes?",
    helper:
      "Self-check: use a recent complete hemogram if you have one. Navy flags polycythemia, eosinophilia, and monocytosis during medical investigations.",
    bodyArea: "general",
    gender: "all",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "Your blood report may need further review before Navy medical fitness can be confirmed.",
    treatment:
      "Repeat the blood test and get a physician review to find the cause before you rely on the self-check result.",
    weight: 10,
    resolutionType: "specialist_review",
  },
  {
    id: "navy-q-male-gynaecomastia",
    examId: NAVY_EXAM_ID,
    question:
      "Do you have significant gynaecomastia, or did you recently have chest surgery without full recovery?",
    helper:
      "Self-check: this applies to male candidates. Candidates may be reassessed after 12 weeks post-op if wound healing, endocrine workup, and recovery are normal.",
    bodyArea: "lungs",
    gender: "male",
    options: ["No", "Operated and fully recovered", "Yes, significant or recent"],
    passingAnswers: ["No", "Operated and fully recovered"],
    failSummary:
      "Male chest profile may currently affect Navy fitness.",
    treatment:
      "If surgery was done, carry wound-healing proof, endocrine workup, and recovery records. If untreated, take a surgical or endocrine review before the official medical.",
    weight: 12,
    resolutionType: "correctable",
  },
  {
    id: "navy-q-male-genital",
    examId: NAVY_EXAM_ID,
    question:
      "Do you have active genital disease, retained undescended testis, or more than a mild varicocele problem?",
    helper:
      "Self-check: this applies to male candidates. Mild varicocele may still be acceptable, but retained undescended testis or active genital disease needs specialist review.",
    bodyArea: "abdomen",
    gender: "male",
    options: [
      "No issue",
      "Mild varicocele only, no major symptoms",
      "Yes, significant or active issue",
    ],
    passingAnswers: ["No issue", "Mild varicocele only, no major symptoms"],
    failSummary:
      "A male genito-urinary condition may affect Navy medical eligibility.",
    treatment:
      "Take a urology review with examination findings and old reports. Significant or untreated conditions should be corrected or fully evaluated before the official medical.",
    weight: 12,
    resolutionType: "specialist_review",
  },
  {
    id: "navy-q-female-gyn",
    examId: NAVY_EXAM_ID,
    question:
      "Are you currently pregnant or dealing with active gynecological problems such as amenorrhoea, dysmenorrhoea, or menorrhagia?",
    helper:
      "Self-check: this applies to female candidates. Navy expects women candidates to be free from current pregnancy and active gynecological disorders during the medical process.",
    bodyArea: "abdomen",
    gender: "female",
    options: ["No", "Not sure", "Yes"],
    passingAnswers: ["No"],
    failSummary:
      "A current gynecological issue may affect Navy medical clearance.",
    treatment:
      "Take a gynecologist review with ultrasound or treatment records if required. Pregnancy or active gynecological disease should be settled before the official medical assessment.",
    weight: 14,
    resolutionType: "specialist_review",
  },
];

const AFCAT_LEGACY_QUESTION_IDS = new Set([
  "airforce-q-1",
  "airforce-q-2",
  "airforce-q-3",
]);

const NDA_LEGACY_QUESTION_IDS = new Set([
  "army-q-1",
  "army-q-2",
  "army-q-3",
  "army-q-4",
]);

const NAVY_LEGACY_QUESTION_IDS = new Set([
  "navy-q-1",
  "navy-q-2",
  "navy-q-3",
]);

const NDA_SEEDED_QUESTION_IDS = new Set(
  NDA_OFFICIAL_QUESTION_BANK.map((question) => question.id),
);

const AFCAT_SEEDED_QUESTION_IDS = new Set(
  AFCAT_OFFICIAL_QUESTION_BANK.map((question) => question.id),
);

const NAVY_SEEDED_QUESTION_IDS = new Set(
  NAVY_OFFICIAL_QUESTION_BANK.map((question) => question.id),
);

const DEFAULT_MEDICAL_CMS_DATA: MedicalCmsData = {
  exams: [
    {
      id: NDA_EXAM_ID,
      title: "Indian Army NDA",
      tags: ["Army", "NDA", "Officer Entry"],
      image:
        "https://images.unsplash.com/photo-1585802540432-60662b65ca62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBhcm15JTIwc29sZGllcnMlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzM5MDcyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      countdownEndsAt: nowPlusDays(45),
    },
    {
      id: NAVY_EXAM_ID,
      title: "Indian Navy SSR",
      tags: ["Navy", "SSR", "Sailor Entry"],
      image:
        "https://images.unsplash.com/photo-1763359837802-d603c312cdc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXZ5JTIwb2ZmaWNlciUyMHVuaWZvcm18ZW58MXx8fHwxNzczOTA3MjAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      countdownEndsAt: nowPlusDays(52),
    },
    {
      id: AFCAT_EXAM_ID,
      title: "Indian Air Force AFCAT",
      tags: ["Air Force", "AFCAT", "Flying Branch"],
      image:
        "https://images.unsplash.com/photo-1549970712-b91970150efc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJmb3JjZSUyMHBpbG90JTIwY29ja3BpdHxlbnwxfHx8fDE3NzM5MDcyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      countdownEndsAt: nowPlusDays(39),
    },
    {
      id: "exam-agniveer-gd",
      title: "Agniveer GD",
      tags: ["Agniveer", "GD", "All Forces"],
      image:
        "https://images.unsplash.com/photo-1769529077450-bf0e14e394a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxpdGFyeSUyMGZpdG5lc3MlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzM5MDcyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      countdownEndsAt: nowPlusDays(28),
    },
  ],
  questions: [
    ...NDA_OFFICIAL_QUESTION_BANK,
    ...NAVY_OFFICIAL_QUESTION_BANK,
    ...AFCAT_OFFICIAL_QUESTION_BANK,
    {
      id: "agniveer-q-1",
      examId: "exam-agniveer-gd",
      question: "Can you run and squat without knee or leg pain?",
      helper: "Agniveer GD requires reliable lower-body movement and recovery.",
      bodyArea: "legs",
      gender: "all",
      options: ["Yes", "Pain after effort", "Pain during movement"],
      passingAnswers: ["Yes"],
      failSummary: "Lower-body movement may not be match-ready for Agniveer GD.",
      treatment:
        "Start mobility work, strengthen knees and quads, and take an ortho or physio review if pain is recurring.",
      weight: 16,
    },
    {
      id: "agniveer-q-2",
      examId: "exam-agniveer-gd",
      question: "Do you have visible tattoos in restricted areas like face, neck, or hands?",
      helper: "Visible tattoo placement is reviewed carefully in many entries.",
      bodyArea: "skin",
      gender: "all",
      options: ["No", "Small but visible", "Yes, clearly visible"],
      passingAnswers: ["No"],
      failSummary: "Visible tattoo placement may create eligibility issues.",
      treatment:
        "Verify the latest rule for your entry and plan removal or documentation early if the tattoo falls in a restricted zone.",
      weight: 12,
    },
    {
      id: "agniveer-q-3",
      examId: "exam-agniveer-gd",
      question: "Have you had any major surgery that still affects fitness?",
      helper: "Recovery status and current functionality matter more than the history alone.",
      bodyArea: "abdomen",
      gender: "all",
      options: ["No", "Recovered fully", "Yes, still affects me"],
      passingAnswers: ["No", "Recovered fully"],
      failSummary: "Post-surgery recovery may need proof and follow-up.",
      treatment:
        "Collect discharge records, surgeon fitness advice, and current recovery notes before appearing for the official exam medical.",
      weight: 14,
    },
    {
      id: "agniveer-q-4",
      examId: "exam-agniveer-gd",
      question: "Have you been diagnosed with PCOS or menstrual-cycle related fitness limitations recently?",
      helper: "This question only appears for women-specific flows when relevant.",
      bodyArea: "abdomen",
      gender: "female",
      options: ["No", "Managed", "Yes, active issue"],
      passingAnswers: ["No", "Managed"],
      failSummary: "Women-specific abdominal health may need review before the attempt.",
      treatment:
        "Discuss current symptoms with a gynecologist, keep treatment records ready, and assess whether the issue affects your physical readiness.",
      weight: 12,
    },
  ],
  articles: [
    {
      id: "article-1",
      title: "How to Improve Physical Fitness for Defence Exams",
      image:
        "https://images.unsplash.com/photo-1759476532819-e37ac3d05cff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwaGVhbHRoJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzczODg0OTg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      link: "https://example.com/fitness-guide",
      category: "Fitness",
    },
    {
      id: "article-2",
      title: "Common Medical Disqualifications and How to Fix Them",
      image:
        "https://images.unsplash.com/photo-1666886573419-aaaca27447de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2hlY2t1cCUyMHN0ZXRob3Njb3BlfGVufDF8fHx8MTc3MzkwNzIwMnww&ixlib=rb-4.1.0&q=80&w=1080",
      link: "https://example.com/disqualifications",
      category: "Medical",
    },
    {
      id: "article-3",
      title: "Complete Guide to Defence Medical Standards 2026",
      image:
        "https://images.unsplash.com/photo-1631558554770-74e921444006?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBtZWRpY2FsJTIwZXhhbWluYXRpb258ZW58MXx8fHwxNzczOTA3MjAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      link: "https://example.com/medical-standards",
      category: "Guide",
    },
  ],
  sponsors: [
    {
      id: "sponsor-1",
      title: "Defence Academy Elite",
      image:
        "https://images.unsplash.com/photo-1585802540432-60662b65ca62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBhcm15JTIwc29sZGllcnMlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzM5MDcyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      link: "https://example.com/academy",
    },
    {
      id: "sponsor-2",
      title: "Fitness Pro Warriors",
      image:
        "https://images.unsplash.com/photo-1769529077450-bf0e14e394a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxpdGFyeSUyMGZpdG5lc3MlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzM5MDcyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      link: "https://example.com/fitness-warriors",
    },
    {
      id: "sponsor-3",
      title: "Medical Prep Institute",
      image:
        "https://images.unsplash.com/photo-1666886573419-aaaca27447de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2hlY2t1cCUyMHN0ZXRob3Njb3BlfGVufDF8fHx8MTc3MzkwNzIwMnww&ixlib=rb-4.1.0&q=80&w=1080",
      link: "https://example.com/medical-prep",
    },
  ],
  feedback: [],
};

const cloneData = (data: MedicalCmsData): MedicalCmsData =>
  JSON.parse(JSON.stringify(data)) as MedicalCmsData;

const normalizeStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value
        .map((item) => String(item).trim())
        .filter(Boolean)
    : [];

const sanitizeExam = (exam: Partial<DefenceExam>): DefenceExam | null => {
  if (!exam.id || !exam.title || !exam.image || !exam.countdownEndsAt) {
    return null;
  }

  return {
    id: String(exam.id),
    title: String(exam.title),
    image: String(exam.image),
    countdownEndsAt: String(exam.countdownEndsAt),
    tags: normalizeStringArray(exam.tags),
  };
};

const sanitizeQuestion = (
  question: Partial<MedicalQuestion>,
): MedicalQuestion | null => {
  if (
    !question.id ||
    !question.examId ||
    !question.question ||
    !question.bodyArea ||
    !question.failSummary ||
    !question.treatment
  ) {
    return null;
  }

  const options = normalizeStringArray(question.options);
  const passingAnswers = normalizeStringArray(question.passingAnswers);

  if (options.length === 0 || passingAnswers.length === 0) {
    return null;
  }

  return {
    id: String(question.id),
    examId: String(question.examId),
    question: String(question.question),
    helper: question.helper ? String(question.helper) : "",
    bodyArea: question.bodyArea as BodyArea,
    gender:
      question.gender === "male" || question.gender === "female"
        ? question.gender
        : "all",
    options,
    passingAnswers,
    failSummary: String(question.failSummary),
    treatment: String(question.treatment),
    weight: Number(question.weight) > 0 ? Number(question.weight) : 10,
    resolutionType:
      question.resolutionType === "specialist_review" ||
      question.resolutionType === "likely_permanent"
        ? question.resolutionType
        : "correctable",
    alternativeAdvice: question.alternativeAdvice
      ? String(question.alternativeAdvice)
      : "",
  };
};

const sanitizeArticle = (article: Partial<AppArticle>): AppArticle | null => {
  if (!article.id || !article.title || !article.image || !article.link) {
    return null;
  }

  return {
    id: String(article.id),
    title: String(article.title),
    image: String(article.image),
    link: String(article.link),
    category: article.category ? String(article.category) : "Guide",
  };
};

const sanitizeSponsor = (sponsor: Partial<SponsorItem>): SponsorItem | null => {
  if (!sponsor.id || !sponsor.title || !sponsor.image || !sponsor.link) {
    return null;
  }

  return {
    id: String(sponsor.id),
    title: String(sponsor.title),
    image: String(sponsor.image),
    link: String(sponsor.link),
  };
};

const sanitizeFeedback = (feedback: Partial<FeedbackItem>): FeedbackItem | null => {
  if (!feedback.id || !feedback.message || !feedback.createdAt) {
    return null;
  }

  return {
    id: String(feedback.id),
    name: feedback.name ? String(feedback.name) : "Anonymous",
    email: feedback.email ? String(feedback.email) : "",
    message: String(feedback.message),
    createdAt: String(feedback.createdAt),
  };
};

const withOfficialQuestionBanks = (data: MedicalCmsData): MedicalCmsData => {
  const examBanks = [
    {
      examId: NDA_EXAM_ID,
      questions: NDA_OFFICIAL_QUESTION_BANK,
      legacyIds: NDA_LEGACY_QUESTION_IDS,
      seededIds: NDA_SEEDED_QUESTION_IDS,
    },
    {
      examId: NAVY_EXAM_ID,
      questions: NAVY_OFFICIAL_QUESTION_BANK,
      legacyIds: NAVY_LEGACY_QUESTION_IDS,
      seededIds: NAVY_SEEDED_QUESTION_IDS,
    },
    {
      examId: AFCAT_EXAM_ID,
      questions: AFCAT_OFFICIAL_QUESTION_BANK,
      legacyIds: AFCAT_LEGACY_QUESTION_IDS,
      seededIds: AFCAT_SEEDED_QUESTION_IDS,
    },
  ];

  return examBanks.reduce((nextData, bank) => {
    const examQuestions = nextData.questions.filter(
      (question) => question.examId === bank.examId,
    );
    const hasSeededQuestions = examQuestions.some((question) =>
      bank.seededIds.has(question.id),
    );
    const shouldRefresh =
      examQuestions.length === 0 ||
      examQuestions.some((question) => bank.legacyIds.has(question.id)) ||
      (!hasSeededQuestions && examQuestions.length <= 3);

    if (!shouldRefresh) {
      return nextData;
    }

    return {
      ...nextData,
      questions: [
        ...nextData.questions.filter((question) => question.examId !== bank.examId),
        ...bank.questions,
      ],
    };
  }, data);
};

export const getBodyAreaMeta = (area: BodyArea) =>
  BODY_AREAS.find((item) => item.value === area) ?? BODY_AREAS[BODY_AREAS.length - 1];

export const loadMedicalCmsData = (): MedicalCmsData => {
  if (typeof window === "undefined") {
    return withOfficialQuestionBanks(cloneData(DEFAULT_MEDICAL_CMS_DATA));
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return withOfficialQuestionBanks(cloneData(DEFAULT_MEDICAL_CMS_DATA));
    }

    const parsed = JSON.parse(raw) as Partial<MedicalCmsData>;

    return withOfficialQuestionBanks({
      exams: Array.isArray(parsed.exams)
        ? (parsed.exams
            .map((exam) => sanitizeExam(exam))
            .filter(Boolean) as DefenceExam[])
        : cloneData(DEFAULT_MEDICAL_CMS_DATA).exams,
      questions: Array.isArray(parsed.questions)
        ? (parsed.questions
            .map((question) => sanitizeQuestion(question))
            .filter(Boolean) as MedicalQuestion[])
        : cloneData(DEFAULT_MEDICAL_CMS_DATA).questions,
      articles: Array.isArray(parsed.articles)
        ? (parsed.articles
            .map((article) => sanitizeArticle(article))
            .filter(Boolean) as AppArticle[])
        : cloneData(DEFAULT_MEDICAL_CMS_DATA).articles,
      sponsors: Array.isArray(parsed.sponsors)
        ? (parsed.sponsors
            .map((sponsor) => sanitizeSponsor(sponsor))
            .filter(Boolean) as SponsorItem[])
        : cloneData(DEFAULT_MEDICAL_CMS_DATA).sponsors,
      feedback: Array.isArray(parsed.feedback)
        ? (parsed.feedback
            .map((item) => sanitizeFeedback(item))
            .filter(Boolean) as FeedbackItem[])
        : [],
    });
  } catch {
    return withOfficialQuestionBanks(cloneData(DEFAULT_MEDICAL_CMS_DATA));
  }
};

export const saveMedicalCmsData = (data: MedicalCmsData) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const makeId = (prefix: string) => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const getCountdownParts = (countdownEndsAt: string, now = Date.now()) => {
  const target = new Date(countdownEndsAt).getTime();
  const remaining = Math.max(0, target - now);

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    expired: remaining === 0,
  };
};

export const getQuestionsForExam = (
  examId: string,
  questions: MedicalQuestion[],
  gender?: CandidateGender,
) =>
  questions.filter(
    (question) =>
      question.examId === examId &&
      (!gender || question.gender === "all" || question.gender === gender),
  );

export const getQuestionCountForExam = (
  examId: string,
  questions: MedicalQuestion[],
) => questions.filter((question) => question.examId === examId).length;

export const evaluateMedicalResult = (
  questions: MedicalQuestion[],
  answers: Record<string, string>,
): MedicalResult => {
  const totalWeight =
    questions.reduce((sum, question) => sum + Math.max(1, question.weight), 0) ||
    questions.length ||
    1;

  const failedItems = questions
    .filter((question) => {
      const selectedAnswer = answers[question.id];
      return (
        selectedAnswer !== undefined &&
        !question.passingAnswers.includes(selectedAnswer)
      );
    })
    .map((question) => ({
      id: question.id,
      bodyArea: question.bodyArea,
      question: question.question,
      answer: answers[question.id],
      expectedAnswers: question.passingAnswers,
      summary: question.failSummary,
      treatment: question.treatment,
      weight: Math.max(1, question.weight),
      resolutionType: question.resolutionType ?? "correctable",
      alternativeAdvice: question.alternativeAdvice?.trim() || "",
    }));

  const failedWeight = failedItems.reduce((sum, item) => sum + item.weight, 0);
  const score = Math.max(0, Math.round(((totalWeight - failedWeight) / totalWeight) * 100));
  const passedCount = Math.max(0, questions.length - failedItems.length);
  const treatments = Array.from(new Set(failedItems.map((item) => item.treatment)));
  const alternativeAdvice = Array.from(
    new Set(
      failedItems
        .map((item) => item.alternativeAdvice?.trim())
        .filter(Boolean) as string[],
    ),
  );
  const hasLikelyPermanentIssue = failedItems.some(
    (item) => item.resolutionType === "likely_permanent",
  );
  const verdict: MedicalResult["verdict"] =
    failedItems.length === 0 ? "qualified" : "not_qualified";

  let status: MedicalResult["status"] = "perfect";
  if (failedItems.length === 0) {
    status = "perfect";
  } else if (!hasLikelyPermanentIssue && score >= 60) {
    status = "improve";
  } else {
    status = "high_risk";
  }

  return {
    verdict,
    status,
    score,
    passedCount,
    failedCount: failedItems.length,
    failedItems,
    treatments,
    alternativeAdvice,
    hasLikelyPermanentIssue,
  };
};

export const getRemainingDaysFromCountdown = (countdownEndsAt: string) => {
  const target = new Date(countdownEndsAt).getTime();
  const remaining = Math.max(0, target - Date.now());
  return Math.ceil(remaining / (1000 * 60 * 60 * 24));
};

export const buildCountdownFromDays = (days: number) =>
  new Date(Date.now() + Math.max(0, days) * 24 * 60 * 60 * 1000).toISOString();
