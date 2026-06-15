import type { Config } from "tailwindcss";

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
        success: 'hsl(150, 65%, 45%)'
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
          'Plus Jakarta Sans',
          'Satoshi',
          'Hind Siliguri',
          'Noto Sans Bengali',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        display: [
          'Plus Jakarta Sans',
          'Edensor',
          'Satoshi',
          'Hind Siliguri',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ],
        serif: [
          'Sentient',
          'ui-serif',
          'Georgia',
          'serif'
        ],
        grotesk: [
          'Plus Jakarta Sans',
          'Edensor',
          'Satoshi',
          'Hind Siliguri',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ],
        bangla: [
          'Hind Siliguri',
          'Noto Sans Bengali',
          'Satoshi',
          'ui-sans-serif',
          'sans-serif'
        ],
        dot: [
          'Departure Mono',
          'JetBrains Mono',
          'ui-monospace',
          'monospace'
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace'
        ]
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display': ['2.5rem', { lineHeight: '1.08', letterSpacing: '-0.025em', fontWeight: '700' }],
        'h1': ['2rem', { lineHeight: '1.12', letterSpacing: '-0.022em', fontWeight: '600' }],
        'h2': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.018em', fontWeight: '600' }],
        'h3': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.014em', fontWeight: '600' }],
        'caption': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0' }]
      },
      maxWidth: {
        'container-apple': '1200px',
        'reading': '720px'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
