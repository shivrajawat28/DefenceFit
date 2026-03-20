import { cn } from "./ui/utils";

interface BrandLogoProps {
  className?: string;
  logoClassName?: string;
  textClassName?: string;
  subtitle?: string;
  subtitleClassName?: string;
}

export default function BrandLogo({
  className,
  logoClassName,
  textClassName,
  subtitle,
  subtitleClassName,
}: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src="/branding/defencefit-logo.svg"
        alt="DefenceFit logo"
        className={cn("h-10 w-10 object-contain", logoClassName)}
      />
      <div className="flex min-w-0 flex-col">
        <span className={cn("text-xl font-bold tracking-tight", textClassName)}>
          DefenceFit
        </span>
        {subtitle ? (
          <span className={cn("text-xs leading-tight opacity-80", subtitleClassName)}>
            {subtitle}
          </span>
        ) : null}
      </div>
    </div>
  );
}
