// src/components/VersionBadge.tsx
import { CURRENT_VERSION, formatVersionLabel } from '../versioning/versionInfo';

type VersionBadgeProps = {
  context?: string;
  layout?: 'inline' | 'floating';
  showSummary?: boolean;
  className?: string;
};

export function VersionBadge({
  context,
  layout = 'inline',
  showSummary = false,
  className = '',
}: VersionBadgeProps) {
  const label = formatVersionLabel(context);

  const classes = [
    'version-badge',
    layout === 'floating' ? 'version-badge--floating' : 'version-badge--inline',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="status" aria-live="polite">
      <span className="version-badge__label">{label}</span>
      {showSummary && (
        <span className="version-badge__summary">{CURRENT_VERSION.summary}</span>
      )}
      <span className="version-badge__date">{CURRENT_VERSION.releaseDate}</span>
    </div>
  );
}

export default VersionBadge;
