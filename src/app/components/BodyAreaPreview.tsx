import {
  type BodyArea,
  type CandidateGender,
  getBodyAreaMeta,
} from "../lib/medicalData";

interface BodyAreaPreviewProps {
  activeArea: BodyArea;
  title?: string;
  description?: string;
  size?: "default" | "compact";
  showBadge?: boolean;
  bodyGender?: CandidateGender;
}

const inactiveFill = "#e5e7eb";
const inactiveStroke = "#cbd5e1";

export default function BodyAreaPreview({
  activeArea,
  title,
  description,
  size = "default",
  showBadge = true,
  bodyGender = "male",
}: BodyAreaPreviewProps) {
  const activeMeta = getBodyAreaMeta(activeArea);
  const isCompact = size === "compact";
  const isFemale = bodyGender === "female";

  const fillFor = (area: BodyArea) =>
    area === activeArea ? activeMeta.color : inactiveFill;
  const strokeFor = (area: BodyArea) =>
    area === activeArea ? activeMeta.color : inactiveStroke;

  const torsoX = isFemale ? 58 : 52;
  const torsoWidth = isFemale ? 64 : 76;
  const torsoRadius = isFemale ? 32 : 36;
  const skinX = isFemale ? 61 : 56;
  const skinWidth = isFemale ? 58 : 68;
  const skinRadius = isFemale ? 28 : 30;
  const heightX = isFemale ? 64 : 62;
  const heightWidth = isFemale ? 52 : 56;
  const armLeftPath = isFemale
    ? "M58 112 L36 170 L48 178 L64 136"
    : "M52 112 L28 172 L42 180 L62 136";
  const armRightPath = isFemale
    ? "M122 112 L144 170 L132 178 L116 136"
    : "M128 112 L152 172 L138 180 L118 136";
  const leftLegPath = isFemale ? "M90 202 L74 320" : "M90 202 L70 318";
  const rightLegPath = isFemale ? "M90 202 L106 320" : "M90 202 L110 318";
  const leftFootPath = isFemale ? "M74 320 L62 340" : "M70 318 L56 340";
  const rightFootPath = isFemale ? "M106 320 L118 340" : "M110 318 L124 340";

  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-slate-50 ${
        isCompact ? "p-4" : "p-5"
      }`}
    >
      <div className={isCompact ? "mb-3" : "mb-5"}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {title ?? "Body Preview"}
        </p>
        <h3
          className={`mt-2 font-bold text-[#0B1F3A] ${
            isCompact ? "text-lg" : "text-xl"
          }`}
        >
          {activeMeta.label}
        </h3>
        <p
          className={`mt-2 text-slate-600 ${
            isCompact ? "text-xs leading-5" : "text-sm leading-6"
          }`}
        >
          {description ?? activeMeta.description}
        </p>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          {bodyGender === "female" ? "Female body preview" : "Male body preview"}
        </p>
      </div>

      <div
        className={`rounded-[1.5rem] bg-white shadow-sm ${
          isCompact ? "p-3" : "p-4"
        }`}
      >
        <svg
          viewBox="0 0 180 360"
          className={`mx-auto w-full ${
            isCompact
              ? "h-[165px] max-w-[92px]"
              : "h-[240px] max-w-[135px]"
          }`}
          aria-label={`${activeMeta.label} highlighted on body`}
          role="img"
        >
          <circle cx="90" cy="36" r="24" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
          <ellipse
            cx="90"
            cy="30"
            rx="12"
            ry="7"
            fill={fillFor("brain")}
            stroke={strokeFor("brain")}
            strokeWidth="2"
          />
          <circle
            cx="81"
            cy="38"
            r="4"
            fill={fillFor("eyes")}
            stroke={strokeFor("eyes")}
            strokeWidth="2"
          />
          <circle
            cx="99"
            cy="38"
            r="4"
            fill={fillFor("eyes")}
            stroke={strokeFor("eyes")}
            strokeWidth="2"
          />
          <circle
            cx="63"
            cy="38"
            r="5"
            fill={fillFor("ears")}
            stroke={strokeFor("ears")}
            strokeWidth="2"
          />
          <circle
            cx="117"
            cy="38"
            r="5"
            fill={fillFor("ears")}
            stroke={strokeFor("ears")}
            strokeWidth="2"
          />
          <rect
            x="80"
            y="47"
            width="20"
            height="6"
            rx="3"
            fill={fillFor("mouth")}
            stroke={strokeFor("mouth")}
            strokeWidth="2"
          />

          <rect x="82" y="60" width="16" height="18" rx="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
          <path d="M90 78 L90 102" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />

          <rect
            x={torsoX}
            y="96"
            width={torsoWidth}
            height="108"
            rx={torsoRadius}
            fill="#f8fafc"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <ellipse
            cx="74"
            cy="138"
            rx="18"
            ry="32"
            fill={fillFor("lungs")}
            stroke={strokeFor("lungs")}
            strokeWidth="2"
          />
          <ellipse
            cx="106"
            cy="138"
            rx="18"
            ry="32"
            fill={fillFor("lungs")}
            stroke={strokeFor("lungs")}
            strokeWidth="2"
          />
          <path
            d="M94 125 C103 117 113 123 113 136 C113 150 103 156 94 163 C85 156 75 150 75 136 C75 123 85 117 94 125 Z"
            fill={fillFor("heart")}
            stroke={strokeFor("heart")}
            strokeWidth="2"
          />
          <rect
            x="66"
            y="164"
            width="48"
            height="30"
            rx="15"
            fill={fillFor("abdomen")}
            stroke={strokeFor("abdomen")}
            strokeWidth="2"
          />
          <rect
            x={heightX}
            y="96"
            width={heightWidth}
            height="108"
            rx="24"
            fill="transparent"
            stroke={strokeFor("height_weight")}
            strokeWidth="4"
            strokeDasharray="6 6"
          />
          <rect
            x={skinX}
            y="96"
            width={skinWidth}
            height="108"
            rx={skinRadius}
            fill="transparent"
            stroke={strokeFor("skin")}
            strokeWidth="3"
          />

          <path d={armLeftPath} stroke={strokeFor("bones")} strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d={armRightPath} stroke={strokeFor("bones")} strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M90 202 L90 322" stroke="#94a3b8" strokeWidth="10" strokeLinecap="round" />
          <path d={leftLegPath} stroke={strokeFor("legs")} strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d={rightLegPath} stroke={strokeFor("legs")} strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d={leftFootPath} stroke={strokeFor("feet")} strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d={rightFootPath} stroke={strokeFor("feet")} strokeWidth="12" strokeLinecap="round" fill="none" />

          <path d="M90 84 L90 322" stroke={strokeFor("bones")} strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle
            cx="90"
            cy="180"
            r="72"
            fill="transparent"
            stroke={strokeFor("general")}
            strokeWidth="3"
            strokeDasharray="8 8"
          />
        </svg>
      </div>

      {showBadge ? (
        <div
          className={`mt-4 rounded-2xl text-sm font-medium text-white ${
            isCompact ? "px-3 py-2" : "px-4 py-3"
          }`}
          style={{ backgroundColor: activeMeta.color }}
        >
          {activeMeta.label} active
        </div>
      ) : null}
    </div>
  );
}
