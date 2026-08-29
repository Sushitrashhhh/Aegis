/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "var(--bg)",
          dark: "#05070A",
          elevated: "#0B0E14",
        },
        surface: {
          DEFAULT: "var(--surface)",
          subtle: "#0D1117",
          raised: "var(--surface-raised)",
          overlay: "rgba(13, 17, 23, 0.85)",
        },
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
          glow: "rgba(245, 169, 0, 0.3)",
          cyan: "rgba(6, 182, 212, 0.3)",
          critical: "rgba(255, 77, 90, 0.35)",
        },
        text: {
          DEFAULT: "var(--text)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          bright: "#FFFFFF",
        },
        cyber: {
          amber: "#F5A900",
          "amber-dim": "#8A6300",
          "amber-light": "#FFC233",
          cyan: "#06B6D4",
          "cyan-dim": "#0891B2",
          "cyan-light": "#67E8F9",
          violet: "#8B5CF6",
          "violet-dim": "#6D28D9",
          "violet-light": "#C4B5FD",
          emerald: "#10B981",
          "emerald-dim": "#059669",
          "emerald-light": "#34D399",
          rose: "#F43F5E",
          "rose-dim": "#BE123C",
          critical: "#FF4D5A",
        },
        critical: "var(--critical)",
        warning: "var(--warning)",
        info: "var(--info)",
        success: "var(--success)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
        display: "var(--font-display)",
      },
      boxShadow: {
        'glow-amber': '0 0 20px -3px rgba(245, 169, 0, 0.25)',
        'glow-amber-lg': '0 0 35px -5px rgba(245, 169, 0, 0.4)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.25)',
        'glow-critical': '0 0 20px -3px rgba(255, 77, 90, 0.3)',
        'glow-success': '0 0 20px -3px rgba(16, 185, 129, 0.25)',
        'glow-violet': '0 0 20px -3px rgba(139, 92, 246, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      },
      borderRadius: {
        DEFAULT: "6px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        '2xl': "16px",
      }
    },
  },
  plugins: [],
}
