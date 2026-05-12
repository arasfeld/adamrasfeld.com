import type { ProjectKind } from '@/types';

interface DeviceWireProps {
  type: ProjectKind;
}

/**
 * Wireframe SVG (phone / browser / desktop) rendered in the radial-dot
 * portfolio card header. Uses `currentColor` so the parent's `text-…` decides
 * the accent hue (e.g. mobile → syntax-green, web → primary, desktop → purple).
 */
export function DeviceWire({ type }: DeviceWireProps) {
  if (type === 'mobile') return <PhoneWire />;
  if (type === 'desktop') return <DesktopWire />;
  return <BrowserWire />;
}

function PhoneWire() {
  return (
    <svg
      width="54"
      height="96"
      viewBox="0 0 54 96"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="50"
        height="92"
        rx="9"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="19"
        y1="6"
        x2="35"
        y2="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="27" cy="88" r="4" stroke="currentColor" strokeWidth="1.5" />
      <rect
        x="8"
        y="16"
        width="38"
        height="4"
        rx="1"
        fill="currentColor"
        opacity="0.2"
      />
      <rect
        x="8"
        y="24"
        width="28"
        height="3"
        rx="1"
        fill="currentColor"
        opacity="0.12"
      />
      <rect
        x="8"
        y="33"
        width="38"
        height="14"
        rx="2"
        fill="currentColor"
        opacity="0.1"
      />
      <rect
        x="8"
        y="51"
        width="38"
        height="14"
        rx="2"
        fill="currentColor"
        opacity="0.1"
      />
      <rect
        x="8"
        y="69"
        width="38"
        height="8"
        rx="2"
        fill="currentColor"
        opacity="0.07"
      />
    </svg>
  );
}

function BrowserWire() {
  return (
    <svg
      width="118"
      height="80"
      viewBox="0 0 118 80"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="114"
        height="76"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="2"
        y1="22"
        x2="116"
        y2="22"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="11" cy="12" r="3.5" fill="currentColor" opacity="0.45" />
      <circle cx="21" cy="12" r="3.5" fill="currentColor" opacity="0.3" />
      <circle cx="31" cy="12" r="3.5" fill="currentColor" opacity="0.18" />
      <rect
        x="40"
        y="8"
        width="56"
        height="8"
        rx="3"
        fill="currentColor"
        opacity="0.12"
      />
      <rect
        x="8"
        y="30"
        width="102"
        height="4"
        rx="1"
        fill="currentColor"
        opacity="0.15"
      />
      <rect
        x="8"
        y="38"
        width="76"
        height="4"
        rx="1"
        fill="currentColor"
        opacity="0.1"
      />
      <rect
        x="8"
        y="50"
        width="102"
        height="20"
        rx="2"
        fill="currentColor"
        opacity="0.08"
      />
    </svg>
  );
}

function DesktopWire() {
  return (
    <svg
      width="118"
      height="80"
      viewBox="0 0 118 80"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="114"
        height="76"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="2"
        y1="24"
        x2="116"
        y2="24"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="11" cy="13" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="21" cy="13" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="31" cy="13" r="3" fill="currentColor" opacity="0.18" />
      <text
        x="44"
        y="17"
        fill="currentColor"
        fontSize="7"
        fontFamily="monospace"
        opacity="0.35"
      >
        untitled-app
      </text>
      <line
        x1="32"
        y1="24"
        x2="32"
        y2="78"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
      />
      <rect
        x="6"
        y="31"
        width="21"
        height="3"
        rx="1"
        fill="currentColor"
        opacity="0.2"
      />
      <rect
        x="6"
        y="39"
        width="18"
        height="3"
        rx="1"
        fill="currentColor"
        opacity="0.14"
      />
      <rect
        x="6"
        y="47"
        width="21"
        height="3"
        rx="1"
        fill="currentColor"
        opacity="0.18"
      />
      <rect
        x="38"
        y="31"
        width="74"
        height="4"
        rx="1"
        fill="currentColor"
        opacity="0.14"
      />
      <rect
        x="38"
        y="39"
        width="54"
        height="4"
        rx="1"
        fill="currentColor"
        opacity="0.1"
      />
      <rect
        x="38"
        y="51"
        width="74"
        height="20"
        rx="2"
        fill="currentColor"
        opacity="0.07"
      />
    </svg>
  );
}
