import { createTheme } from '@mui/material/styles';
import { grey, red } from '@mui/material/colors';


const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#c7165d',
      light: '#FF8A65',  
      dark: '#D84315',
    
    },
    secondary: {
      main:'#787376',
      light: '#F5EBFF',
      dark: '#A673D3',
      contrastText: '#47008F',
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
        },
      },
    },
  },
});

export default theme;