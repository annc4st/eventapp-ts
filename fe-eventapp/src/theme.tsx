import { createTheme } from '@mui/material/styles';
import { grey, red } from '@mui/material/colors';


const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main:  '#015668', //dark teal
      light: '#FFD369', //yellow
      dark: '#263F44' //dark
    
    },
    secondary: {
      main: '#575456', //gray
      light:'#FFF1CF', //light yellow
      dark: '#263F44',
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