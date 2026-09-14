const LOGOS_BASE = "/logos";

/**
 * Structured registry of application static assets.
 * Mirrors the ROUTES pattern with grouped object fields and strict types.
 *
 * @author Maruf Bepary
 */
export const ASSETS = {
  LOGOS: {
    APP: { path: `${LOGOS_BASE}/logo.svg`, alt: "Nodebase logo" },
    OPENAI: { path: `${LOGOS_BASE}/openai.svg`, alt: "OpenAI logo" },
    ANTHROPIC: { path: `${LOGOS_BASE}/anthropic.svg`, alt: "Anthropic logo" },
    GEMINI: { path: `${LOGOS_BASE}/gemini.svg`, alt: "Gemini logo" },
    OPENROUTER: {
      path: `${LOGOS_BASE}/openrouter.svg`,
      alt: "OpenRouter logo",
    },
    GOOGLE_FORM: {
      path: `${LOGOS_BASE}/googleform.svg`,
      alt: "Google Form logo",
    },
    STRIPE: { path: `${LOGOS_BASE}/stripe.svg`, alt: "Stripe logo" },
    DISCORD: { path: `${LOGOS_BASE}/discord.svg`, alt: "Discord logo" },
    SLACK: { path: `${LOGOS_BASE}/slack.svg`, alt: "Slack logo" },
    GITHUB: { path: `${LOGOS_BASE}/github.svg`, alt: "GitHub logo" },
    GOOGLE: { path: `${LOGOS_BASE}/google.svg`, alt: "Google logo" },
  },
} as const;

export type Assets = typeof ASSETS;
