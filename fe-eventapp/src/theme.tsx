import { createTheme } from '@mui/material/styles';
import { grey, red } from '@mui/material/colors';


const theme = createTheme({
  
  cssVariables: true,
  palette: {
    primary: {
      main:  '#015668', //dark teal
      light: '#3698ad', //yellow #3698ad
      dark: '#263F44' //dark
    
    },
    secondary: {
      main: '#575456', //gray
      light:'#FFF1CF', //light yellow
       dark: '#f0aa32', //'#FFD369', //dark yellow
      contrastText: '#FFA725'
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',  
      paper: '#f8f9fa',
    },
    grey: {
      500: grey[500],
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

  // ✅ Add a custom spacing object
  // customSpacing: {
  //   xs: 4,  // 4px
  //   sm: 8,  // 8px
  //   md: 16, // 16px
  //   lg: 24, // 24px
  //   xl: 32, // 32px
  // },

  shape: {
    borderRadius: 8, // Medium border-radius
  },
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

export default theme;