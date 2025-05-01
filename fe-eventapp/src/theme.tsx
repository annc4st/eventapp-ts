import { createTheme } from '@mui/material/styles';
import { grey, red } from '@mui/material/colors';


export const lightTheme = createTheme({
  
  cssVariables: true,
  palette: {
    mode: 'light',

    primary: {
      main:  '#015668', //dark teal
      light: '#3698ad', // #3698ad
    },
    secondary: {
      main: '#f0aa32',   //dark yellow
      light:'#FFF1CF', //light yellow
    },
    error: {
      main: red.A400,
    },
    
    background: {
      default: '#fff',  
      paper: '#f8f9fa',
    },
    text: {
      primary: '#263F44',
      secondary: grey[900],
    },
    },
 
  
  typography: {
    fontFamily: 'Roboto',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },

  // ✅ Add a custom spacing object
  // customSpacing: {
  //   xs: 4,  // 4px
  //   sm: 8,  // 8px
  //   md: 16, // 16px
  //   lg: 24, // 24px
  //   xl: 32, // 32px
  // },
 
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8f9fa', // Matches `panelBackground="solid"`
         "& input:-webkit-autofill": {
                      "-webkit-box-shadow": "0 0 0px 100px #FFF inset", //  autofill bg  
                      "-webkit-text-fill-color": "#575456 !important", // autofill text color 
                      caretColor: "#575456", // Cursor color
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',

    primary: {
      main: '#3698ad', 
      light:  '#90caf9',  
 
    },
    secondary: {
      main: '#f0aa32', //dark yellow
      light:'#FFF1CF', //light yellow
      // main: '#f48fb1', // pinkish
      
    },
    background: {
      default: '#121212', // dark background
      paper: '#242323',    // slightly lighter
    },
    text: {
      // primary: '#ffffff',
      primary: grey[50],
      secondary: grey[300],
    },
    error: {
      main: red.A400,
    },
    
  },
  typography: {
    fontFamily: 'Roboto',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'background.paper', // Matches `panelBackground="solid"`
         "& input:-webkit-autofill": {
                      "-webkit-box-shadow": "0 0 0px 100px #424242 inset", //  autofill bg  
                      "-webkit-text-fill-color": " #757575 !important", // autofill text color 
                      caretColor:  '#fafafa', // Cursor color
          },
        },
      },
    },
  },
});