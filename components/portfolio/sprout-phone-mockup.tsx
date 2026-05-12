/**
 * Sprout app phone mockup — a labeled phone-frame SVG showing a sample day
 * (timeline with nap, bottle, diaper, etc.). Themes via CSS variables so it
 * adapts to light/dark mode.
 *
 * Color contract:
 *   bg          var(--background)
 *   surface     var(--card)
 *   border      var(--border)
 *   fg          var(--foreground)
 *   fg-bright   var(--foreground-bright)
 *   fg-dim      var(--muted-foreground)
 *   green/accent/yellow/purple  var(--syntax-…), var(--primary)
 */
export function SproutPhoneMockup() {
  return (
    <svg
      width="200"
      height="390"
      viewBox="0 0 200 390"
      className="block flex-shrink-0"
      aria-hidden="true"
    >
      {/* Shadow */}
      <rect
        x="8"
        y="8"
        width="186"
        height="378"
        rx="22"
        fill="rgba(0,0,0,0.18)"
      />

      {/* Body */}
      <rect
        x="4"
        y="4"
        width="186"
        height="378"
        rx="20"
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />

      {/* Notch */}
      <rect
        x="64"
        y="4"
        width="68"
        height="20"
        rx="10"
        fill="var(--background)"
      />
      <circle cx="130" cy="13" r="3" fill="var(--border)" />

      {/* Status bar */}
      <text
        x="16"
        y="17"
        fontSize="7.5"
        fill="var(--muted-foreground)"
        fontFamily="monospace"
      >
        9:41
      </text>
      <rect
        x="160"
        y="9"
        width="16"
        height="8"
        rx="2"
        fill="none"
        stroke="var(--muted-foreground)"
        strokeWidth="1"
      />
      <rect
        x="161"
        y="10"
        width="10"
        height="6"
        rx="1"
        fill="var(--syntax-green)"
      />

      {/* App header */}
      <rect x="4" y="24" width="186" height="38" fill="var(--card)" />
      <line
        x1="4"
        y1="62"
        x2="190"
        y2="62"
        stroke="var(--border)"
        strokeWidth="1"
      />
      <text
        x="16"
        y="46"
        fontSize="12"
        fontWeight="700"
        fill="var(--syntax-green)"
        fontFamily="monospace"
      >
        sprout
      </text>
      <rect
        x="128"
        y="35"
        width="52"
        height="16"
        rx="4"
        fill="color-mix(in srgb, var(--primary) 13%, transparent)"
      />
      <text
        x="154"
        y="47"
        fontSize="8.5"
        fill="var(--primary)"
        fontFamily="monospace"
        textAnchor="middle"
      >
        Oliver ▾
      </text>

      {/* Section label */}
      <text
        x="16"
        y="78"
        fontSize="8"
        fill="var(--muted-foreground)"
        fontFamily="monospace"
      >
        Today, May 11
      </text>

      {/* Timeline line */}
      <line
        x1="23"
        y1="88"
        x2="23"
        y2="285"
        stroke="var(--border)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {/* Event 1 — Nap (ongoing) */}
      <circle cx="23" cy="100" r="5" fill="var(--syntax-green)" />
      <text
        x="38"
        y="97"
        fontSize="9"
        fontWeight="600"
        fill="var(--foreground-bright)"
        fontFamily="monospace"
      >
        Nap
      </text>
      <rect
        x="130"
        y="90"
        width="36"
        height="13"
        rx="3"
        fill="color-mix(in srgb, var(--syntax-green) 13%, transparent)"
      />
      <text
        x="148"
        y="100"
        fontSize="7"
        fill="var(--syntax-green)"
        fontFamily="monospace"
        textAnchor="middle"
      >
        ongoing
      </text>
      <text
        x="38"
        y="109"
        fontSize="7.5"
        fill="var(--muted-foreground)"
        fontFamily="monospace"
      >
        started 2:30 PM
      </text>

      {/* Event 2 — Bottle */}
      <circle cx="23" cy="135" r="5" fill="var(--primary)" />
      <text
        x="38"
        y="132"
        fontSize="9"
        fontWeight="600"
        fill="var(--foreground-bright)"
        fontFamily="monospace"
      >
        Bottle
      </text>
      <text
        x="38"
        y="144"
        fontSize="7.5"
        fill="var(--muted-foreground)"
        fontFamily="monospace"
      >
        1:15 PM · 6 oz formula
      </text>

      {/* Event 3 — Diaper */}
      <circle
        cx="23"
        cy="170"
        r="5"
        stroke="var(--syntax-yellow)"
        strokeWidth="1.5"
        fill="none"
      />
      <text
        x="38"
        y="167"
        fontSize="9"
        fontWeight="600"
        fill="var(--foreground-bright)"
        fontFamily="monospace"
      >
        Diaper
      </text>
      <text
        x="38"
        y="179"
        fontSize="7.5"
        fill="var(--muted-foreground)"
        fontFamily="monospace"
      >
        12:00 PM · Wet
      </text>

      {/* Event 4 — Nap ended */}
      <circle
        cx="23"
        cy="205"
        r="5"
        fill="var(--syntax-green)"
        opacity="0.55"
      />
      <text
        x="38"
        y="202"
        fontSize="9"
        fontWeight="600"
        fill="var(--foreground)"
        fontFamily="monospace"
      >
        Nap ended
      </text>
      <text
        x="38"
        y="214"
        fontSize="7.5"
        fill="var(--muted-foreground)"
        fontFamily="monospace"
      >
        11:45 AM · 1h 12m
      </text>

      {/* Event 5 — Breakfast */}
      <circle cx="23" cy="240" r="5" fill="var(--primary)" opacity="0.5" />
      <text
        x="38"
        y="237"
        fontSize="9"
        fontWeight="600"
        fill="var(--foreground)"
        fontFamily="monospace"
      >
        Breakfast
      </text>
      <text
        x="38"
        y="249"
        fontSize="7.5"
        fill="var(--muted-foreground)"
        fontFamily="monospace"
      >
        10:30 AM
      </text>

      {/* Event 6 — Sleep */}
      <circle
        cx="23"
        cy="275"
        r="5"
        fill="var(--syntax-purple)"
        opacity="0.45"
      />
      <text
        x="38"
        y="272"
        fontSize="9"
        fontWeight="600"
        fill="var(--muted-foreground)"
        fontFamily="monospace"
      >
        Night sleep
      </text>
      <text
        x="38"
        y="284"
        fontSize="7.5"
        fill="var(--muted-foreground)"
        fontFamily="monospace"
      >
        yesterday · 8h 44m
      </text>

      {/* FAB */}
      <circle cx="166" cy="308" r="18" fill="var(--primary)" />
      <text
        x="166"
        y="313"
        fontSize="18"
        fontFamily="monospace"
        fill="var(--background)"
        textAnchor="middle"
        fontWeight="300"
      >
        +
      </text>

      {/* Tab bar */}
      <rect x="4" y="338" width="186" height="40" fill="var(--card)" />
      <line
        x1="4"
        y1="338"
        x2="190"
        y2="338"
        stroke="var(--border)"
        strokeWidth="1"
      />
      <text
        x="43"
        y="362"
        fontSize="7.5"
        fontFamily="monospace"
        textAnchor="middle"
        fill="var(--primary)"
      >
        Timeline
      </text>
      <text
        x="100"
        y="362"
        fontSize="7.5"
        fontFamily="monospace"
        textAnchor="middle"
        fill="var(--muted-foreground)"
      >
        Log
      </text>
      <text
        x="157"
        y="362"
        fontSize="7.5"
        fontFamily="monospace"
        textAnchor="middle"
        fill="var(--muted-foreground)"
      >
        Profile
      </text>
      <rect x="16" y="337" width="54" height="2" rx="1" fill="var(--primary)" />
    </svg>
  );
}
