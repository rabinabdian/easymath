import { APP_VERSION } from "../version";

type VersionBadgeProps = {
  variant?: "floating" | "inline";
};

export default function VersionBadge({ variant = "floating" }: VersionBadgeProps) {
  const label = `ניהול גרסאות · גרסה ${APP_VERSION}`;

  if (variant === "inline") {
    return <span className="version-pill">{label}</span>;
  }

  return (
    <div className="version-badge" role="status" aria-live="polite">
      {label}
    </div>
  );
}
