export type ProjectKind = 'mobile' | 'web' | 'desktop';
export type ProjectStatus = 'active' | 'live' | 'wip';

export interface Project {
  /** URL slug (e.g. `sprout`, `freebox`). */
  id: string;
  title: string;
  year: string;
  type: ProjectKind;
  status: ProjectStatus;
  /** Short one-line description shown on the portfolio card. */
  tagline: string;
  /** Longer description; if absent the card falls back to `tagline`. */
  description?: string;
  /** Tech stack as a flat list of labels. */
  stack: string[];
  github: string | null;
  live: string | null;
  /** Set to true when a dedicated detail page exists at `/portfolio/<id>`. */
  hasDetail: boolean;
  /**
   * Optional screenshot shown in the card header instead of the wireframe.
   * `dark` is optional — when omitted, `light` is shown in both themes.
   */
  image?: {
    light: string;
    dark?: string;
  };
}
