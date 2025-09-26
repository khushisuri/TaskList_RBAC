import type { PaletteMode } from '@mui/material';
import { teal } from '@mui/material/colors';
const tokens = {
  black: {
    100: '#cecece',
    200: '#9d9d9e',
    300: '#6c6b6d',
    400: '#3b3a3d',
    500: '#0a090c',
    600: '#08070a',
    700: '#060507',
    800: '#040405',
    900: '#020202',
  },
  white: {
    100: '#fcfbfc',
    200: '#f9f8f8',
    300: '#f6f4f5',
    400: '#f3f1f1',
    500: '#f0edee',
    600: '#c0bebe',
    700: '#908e8f',
    800: '#605f5f',
    900: '#302f30',
  },
  primary: {
    100: '#cdd7d8',
    200: '#9cb0b1',
    300: '#6a888a',
    400: '#396163',
    500: '#07393c',
    600: '#062e30',
    700: '#042224',
    800: '#031718',
    900: '#010b0c',
  },
  primaryAlt: {
    100: '#d5e0e2',
    200: '#abc2c5',
    300: '#80a3a8',
    400: '#56858b',
    500: '#2c666e',
    600: '#235258',
    700: '#1a3d42',
    800: '#12292c',
    900: '#091416',
  },
  accent: {
    100: '#e9f8fc',
    200: '#d3f1f9',
    300: '#bcebf6',
    400: '#a6e4f3',
    500: '#90ddf0',
    600: '#73b1c0',
    700: '#568590',
    800: '#3a5860',
    900: '#1d2c30',
  },
  secondary: {
    100: '#fceeff',
    200: '#f9ddff',
    300: '#f5cdff',
    400: '#f2bcff',
    500: '#efabff',
    600: '#bf89cc',
    700: '#8f6799',
    800: '#604466',
    900: '#302233',
  },
  pink: {
   100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899', 
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
  },
   teal: {
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6', 
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },
};

export const themeSettings = (mode: PaletteMode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === 'light'
        ? {
            background: {
              default: tokens.white[500],
              alt: tokens.white[500],
            },
            primary: {
              light: tokens.primary[200],
              main: tokens.primaryAlt[500],
              dark: tokens.primaryAlt[500],
            },
            secondary: {
              light: tokens.secondary[200],
              main: tokens.secondary[500],
              dark: tokens.pink[800],
            },
            accent: {
              light: tokens.accent[400],
              main: tokens.accent[500],
              dark: tokens.accent[600],
            },
            text: { primary: tokens.black[800] },
          }
        : {
            background: {
              default: tokens.black[900],
              alt: tokens.primaryAlt[800],
            },
            primary: {
              light: tokens.primary[600],
              main: tokens.primaryAlt[500],
              dark: tokens.accent[500],
            },
            secondary: {
              light: tokens.pink[800],
              main: tokens.secondary[500],
              dark: tokens.pink[200],
            },
            accent: {
              light: tokens.accent[900],
              main: tokens.accent[500],
              dark: tokens.accent[200],
            },
            text: { primary: tokens.white[500] },
          }),
    },
    typography: {
      fontFamily: ['Rubik', 'sans-serif'].join(','),
      fontSize: 12,
      h1: {
        fontFamily: ['Rubik', 'sans-serif'].join(','),
        fontSize: 40,
      },
      h2: {
        fontFamily: ['Rubik', 'sans-serif'].join(','),
        fontSize: 32,
      },
      h3: {
        fontFamily: ['Rubik', 'sans-serif'].join(','),
        fontSize: 24,
      },
      h4: {
        fontFamily: ['Rubik', 'sans-serif'].join(','),
        fontSize: 20,
      },
      h5: {
        fontFamily: ['Rubik', 'sans-serif'].join(','),
        fontSize: 16,
      },
      h6: {
        fontFamily: ['Rubik', 'sans-serif'].join(','),
        fontSize: 14,
      },
    },
  };
};
