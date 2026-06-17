/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        cinema: {
          bg:       '#080810',
          surface:  '#0f0f1a',
          surface2: '#161625',
          surface3: '#1e1e30',
          border:   'rgba(255,255,255,0.07)',
          muted:    '#6b6b85',
          text:     '#f0f0f5',
        },
        gold: {
          DEFAULT: '#f5c518',
          dim:     '#b8960c',
          bright:  '#ffd700',
          glow:    'rgba(245,197,24,0.25)',
        },
        crimson: {
          DEFAULT: '#e63946',
          dim:     '#9b1d23',
          glow:    'rgba(230,57,70,0.25)',
        },
        teal: {
          cinema: '#2ec4b6',
        },
      },
      backgroundImage: {
        'gold-gradient':   'linear-gradient(135deg, #f5c518 0%, #ffd700 50%, #b8960c 100%)',
        'hero-gradient':   'radial-gradient(ellipse at 60% 0%, rgba(245,197,24,0.12) 0%, transparent 60%), radial-gradient(ellipse at 0% 100%, rgba(46,196,182,0.08) 0%, transparent 50%)',
        'card-gradient':   'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        'glass-border':    'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
      },
      boxShadow: {
        'gold-glow':   '0 0 30px rgba(245,197,24,0.3), 0 0 60px rgba(245,197,24,0.1)',
        'gold-soft':   '0 0 15px rgba(245,197,24,0.15)',
        'card-hover':  '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,197,24,0.15)',
        'glass':       '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        'form':        '0 24px 80px rgba(0,0,0,0.6)',
      },
      backdropBlur: {
        xs: '4px',
        glass: '20px',
      },
      animation: {
        'shimmer':      'shimmer 2.5s ease-in-out infinite',
        'float':        'float 6s ease-in-out infinite',
        'pulse-gold':   'pulse-gold 2s ease-in-out infinite',
        'slide-up':     'slide-up 0.4s ease-out forwards',
        'fade-in':      'fade-in 0.5s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(245,197,24,0.15)' },
          '50%':      { boxShadow: '0 0 30px rgba(245,197,24,0.35)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
