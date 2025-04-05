import { extendTheme } from "@mui/joy/styles";

export const theme = extendTheme({
  colorSchemes: {},
});

// Then, pass it to `<CssVarsProvider theme={theme}>`.
// const theme = extendTheme({
//   colorSchemes: {
//     light: {
//       palette: {
//         secondary: {
//           // Credit:
//           // https://github.com/tailwindlabs/tailwindcss/blob/master/src/public/colors.js
//           50: '#fdf2f8',
//           100: '#fce7f3',
//           200: '#fbcfe8',
//           300: '#f9a8d4',
//           400: '#f472b6',
//           500: '#ec4899',
//           600: '#db2777',
//           700: '#be185d',
//           800: '#9d174d',
//           900: '#831843',
//           // Adjust the global variant tokens as you'd like.
//           // The tokens should be the same for all color schemes.
//           solidBg: 'var(--joy-palette-secondary-400)',
//           solidActiveBg: 'var(--joy-palette-secondary-500)',
//           outlinedBorder: 'var(--joy-palette-secondary-500)',
//           outlinedColor: 'var(--joy-palette-secondary-700)',
//           outlinedActiveBg: 'var(--joy-palette-secondary-100)',
//           softColor: 'var(--joy-palette-secondary-800)',
//           softBg: 'var(--joy-palette-secondary-200)',
//           softActiveBg: 'var(--joy-palette-secondary-300)',
//           plainColor: 'var(--joy-palette-secondary-700)',
//           plainActiveBg: 'var(--joy-palette-secondary-100)',
//         },
//       },
//     },
//     dark: {
//       palette: {
//         secondary: {
//           // Credit:
//           // https://github.com/tailwindlabs/tailwindcss/blob/master/src/public/colors.js
//           50: '#fdf2f8',
//           100: '#fce7f3',
//           200: '#fbcfe8',
//           300: '#f9a8d4',
//           400: '#f472b6',
//           500: '#ec4899',
//           600: '#db2777',
//           700: '#be185d',
//           800: '#9d174d',
//           900: '#831843',
//           // Adjust the global variant tokens as you'd like.
//           // The tokens should be the same for all color schemes.
//           solidBg: 'var(--joy-palette-secondary-400)',
//           solidActiveBg: 'var(--joy-palette-secondary-500)',
//           outlinedBorder: 'var(--joy-palette-secondary-700)',
//           outlinedColor: 'var(--joy-palette-secondary-600)',
//           outlinedActiveBg: 'var(--joy-palette-secondary-900)',
//           softColor: 'var(--joy-palette-secondary-500)',
//           softBg: 'var(--joy-palette-secondary-900)',
//           softActiveBg: 'var(--joy-palette-secondary-800)',
//           plainColor: 'var(--joy-palette-secondary-500)',
//           plainActiveBg: 'var(--joy-palette-secondary-900)',
//         },
//       },
//     },
//   },
// });

// // You can put this to any file that's included in your tsconfig
// import type { PaletteRange } from '@mui/joy/styles';

// declare module '@mui/joy/styles' {
//   interface ColorPalettePropOverrides {
//     // apply to all Joy UI components that support `color` prop
//     secondary: true;
//   }

//   interface Palette {
//     // this will make the node `secondary` configurable in `extendTheme`
//     // and add `secondary` to the theme's palette.
//     secondary: PaletteRange;
//   }
// }
