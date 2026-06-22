import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        brand: {
          DEFAULT: 'hsl(var(--brand-from))',
          from: 'hsl(var(--brand-from))',
          via: 'hsl(var(--brand-via))',
          to: 'hsl(var(--brand-to))',
          'soft-from': 'hsl(var(--brand-soft-from))',
          'soft-to': 'hsl(var(--brand-soft-to))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        gold: 'hsl(45, 95%, 55%)',
        success: 'hsl(150, 65%, 45%)',
        chip: {
          butter: 'hsl(var(--chip-butter))',
          lavender: 'hsl(var(--chip-lavender))',
          mint: 'hsl(var(--chip-mint))',
          cream: 'hsl(var(--chip-cream))',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
          to: { height: '0', opacity: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.22s cubic-bezier(0.22,1,0.36,1)',
        'accordion-up': 'accordion-up 0.18s cubic-bezier(0.22,1,0.36,1)',
        'fade-in': 'fade-in 0.28s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in-up': 'fade-in-up 0.42s cubic-bezier(0.22,1,0.36,1) both',
        'scale-in': 'scale-in 0.22s cubic-bezier(0.22,1,0.36,1) both',
        'slide-in-right': 'slide-in-right 0.32s cubic-bezier(0.22,1,0.36,1) both',
        'shimmer': 'shimmer 2s ease-in-out infinite'
      },
      boxShadow: {
        '2xs': 'var(--shadow-2xs)',
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)'
      },
      fontFamily: {
        sans: [
          'Satoshi',
          'Hind Siliguri',
          'Noto Sans Bengali',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ],
        display: [
          'Satoshi',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ],
        serif: [
          'Satoshi',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ],
        grotesk: [
          'Satoshi',
          'Hind Siliguri',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ],
        bangla: [
          'Hind Siliguri',
          'Noto Sans Bengali',
          'ui-sans-serif',
          'sans-serif'
        ],
        dot: [
          'Satoshi',
          'JetBrains Mono',
          'ui-monospace',
          'monospace'
        ],
        'dot-matrix': [
          'Satoshi',
          'JetBrains Mono',
          'ui-monospace',
          'monospace'
        ],
        mono: [
          'Satoshi',
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace'
        ]
      },
      fontSize: {
        // Refined editorial scale tuned for Noto Serif Display headlines
        // + Noto Sans body. Tighter tracking on large display sizes,
        // slightly looser tracking on small body for readability.
        'display-xl': ['4rem', { lineHeight: '1.02', letterSpacing: '-0.035em', fontWeight: '600' }],
        'display': ['2.75rem', { lineHeight: '1.06', letterSpacing: '-0.03em', fontWeight: '600' }],
        'h1': ['2.125rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '600' }],
        'h2': ['1.625rem', { lineHeight: '1.18', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h3': ['1.3125rem', { lineHeight: '1.28', letterSpacing: '-0.015em', fontWeight: '600' }],
        'caption': ['0.8125rem', { lineHeight: '1.45', letterSpacing: '0.005em' }]
      },
      maxWidth: {
        'container-apple': '1200px',
        'reading': '720px'
      },
      backgroundImage: {
        'brand-gradient': 'var(--gradient-primary)',
        'brand-gradient-soft': 'var(--gradient-primary-soft)',
        'brand-aurora': 'var(--gradient-aurora)',
        'brand-surface': 'var(--gradient-surface)',
        'brand-sheen': 'var(--gradient-sheen)',
        'brand-hairline': 'var(--gradient-hairline)'
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(({ addUtilities }) => {
      const card = {
        transition: "box-shadow 400ms ease, transform 400ms ease",
      };
      addUtilities({
        /* === Card depth variants — theme-aware. ===
           Drives from `--shadow-*` tokens defined in index.css, so the same
           class adapts to light (cream) and dark (black) surfaces. The
           foreground-tinted inset highlight + grounding shadow are subtle in
           light mode and richer in dark mode automatically. */
        ".hf-card-depth-subtle": {
          ...card,
          boxShadow: [
            "0 1px 0 0 hsl(var(--foreground) / 0.04) inset",
            "var(--shadow-xs)",
            "var(--shadow-sm)",
          ].join(", "),
        },
        ".hf-card-depth": {
          ...card,
          boxShadow: [
            "0 1px 0 0 hsl(var(--foreground) / 0.05) inset",
            "var(--shadow-sm)",
            "var(--shadow-md)",
          ].join(", "),
        },
        ".hf-card-depth-elevated": {
          ...card,
          boxShadow: [
            "0 1px 0 0 hsl(var(--foreground) / 0.06) inset",
            "var(--shadow-md)",
            "var(--shadow-xl)",
          ].join(", "),
        },
        ".hf-card-depth-none": {
          boxShadow: "none",
        },

        /* === Section depth variants — radial vignette + top seam. === */
        ".hf-section-depth-subtle": {
          position: "relative",
          isolation: "isolate",
          "--hf-section-top": "hsl(233 72% 18% / 0.08)",
          "--hf-section-bottom": "hsl(0 0% 0% / 0.3)",
          "--hf-section-seam": "hsl(0 0% 100% / 0.05)",
        },
        ".hf-section-depth": {
          position: "relative",
          isolation: "isolate",
          "--hf-section-top": "hsl(233 72% 18% / 0.18)",
          "--hf-section-bottom": "hsl(0 0% 0% / 0.5)",
          "--hf-section-seam": "hsl(0 0% 100% / 0.08)",
        },
        ".hf-section-depth-elevated": {
          position: "relative",
          isolation: "isolate",
          "--hf-section-top": "hsl(233 72% 22% / 0.32)",
          "--hf-section-bottom": "hsl(0 0% 0% / 0.7)",
          "--hf-section-seam": "hsl(0 0% 100% / 0.14)",
        },
        ".hf-section-depth-none": {
          "--hf-section-top": "transparent",
          "--hf-section-bottom": "transparent",
          "--hf-section-seam": "transparent",
        },
      });
    }),
  ],
} satisfies Config;
