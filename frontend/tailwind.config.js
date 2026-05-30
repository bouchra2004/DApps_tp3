import forms from '@tailwindcss/forms'

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        muted: '#64748b',
        line: '#e5e7eb',
        surface: '#ffffff',
        canvas: '#f5f7fb',
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [forms],
}
