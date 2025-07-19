import { createTheme } from '@mantine/core';

const theme = createTheme({
  colors: {
    // Primary: Crimson Red (Energy, action)
    primary: [
      '#FFEBEE',
      '#FFCDD2',
      '#EF9A9A',
      '#E57373',
      '#EF5350',
      '#F44336',
      '#E53935',
      '#D72638',
      '#C62828',
      '#B71C1C',
    ],

    // Accent: Charcoal Black (Strength, focus)
    dark: [
      '#E0E0E0',
      '#BDBDBD',
      '#9E9E9E',
      '#757575',
      '#616161',
      '#424242',
      '#303030',
      '#1A1A1A',
      '#121212',
      '#000000',
    ],

    // Secondary: Warm Orange/Gold (Highlights)
    orange: [
      '#FFF3E0',
      '#FFE0B2',
      '#FFCC80',
      '#FFB74D',
      '#FFA726',
      '#FF9800',
      '#FB8C00',
      '#FF7A00',
      '#EF6C00',
      '#E65100',
    ],
    gold: [
      '#FFF8E1',
      '#FFECB3',
      '#FFE082',
      '#FFD54F',
      '#FFCA28',
      '#FFC857',
      '#FFB300',
      '#FFA000',
      '#FF8F00',
      '#FF6F00',
    ],
  },
  primaryColor: 'primary',
  primaryShade: 7, // Using the 8th shade (index 7) which is #D72638
  // Set background color
  white: '#FAFAFA',
  black: '#1A1A1A',
  components: {
    Modal: {
      defaultProps: {
        centered: true,
        overlayProps: {
          backgroundOpacity: 0.55,
          blur: 3,
        },
        transitionProps: {
          transition: 'fade',
          duration: 200,
        },
      },
    },
  },
});

export default theme;
