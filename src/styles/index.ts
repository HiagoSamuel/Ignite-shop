import { createStitches } from '@stitches/react'

export const { styled, css, globalCss, keyframes, getCssText, theme, createTheme, config } =
  createStitches({
    media: {
      sm: '(max-width: 640px)',
      md: '(max-width: 900px)',
    },
    theme: {
      colors: {
        gray950: '#050507',
        gray900: '#09090c',
        gray850: '#101014',
        gray800: '#17171d',
        gray700: '#20202a',
        gray400: '#8d8d99',
        gray300: '#c4c4cc',
        gray100: '#e1e1e6',
        green500: '#00b37e',
        green300: '#00f2a6',
        mint500: '#66e6d1',
        cyan500: '#4ea8de',
        white: '#fff',
      },
      fontSizes: {
        sm: '0.875rem',
        md: '1.125rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.75rem',
      },
      radii: {
        sm: '8px',
        md: '14px',
        lg: '22px',
        pill: '999px',
      },
      space: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
      },
    },
  })

export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  body: {
    background:
      'radial-gradient(circle at top left, rgba(102, 230, 209, 0.16), transparent 20%), linear-gradient(180deg, $gray950 0%, $gray900 100%)',
    color: '$gray100',
    WebkitFontSmoothing: 'antialiased',
    minHeight: '100vh',
  },
  'body, input, textarea, button': {
    fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif",
    fontWeight: 400,
  },
  '#__next': {
    minHeight: '100vh',
  },
  button: {
    cursor: 'pointer',
  },
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
})
