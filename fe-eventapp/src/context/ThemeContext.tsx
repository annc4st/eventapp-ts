import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline,  IconButton   } from '@mui/material';
import { lightTheme, darkTheme } from '../theme';
import useMediaQuery from '@mui/material/useMediaQuery';



type ThemeMode = 'light' | 'dark';

interface ThemeContextType { 
    mode: ThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType  | undefined> (undefined);

  export const useThemeContext = () =>{
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error ("useTheme must be used within a ThemeProvider");
    }
    return context;
  }  
 
  interface Props {
    children: ReactNode;
  }

//Provider
export const ThemeProvider: React.FC<{ children: ReactNode}> = ({ children }: Props) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const [mode, setMode] = useState<ThemeMode>(() => {
      const savedMode = localStorage.getItem('theme') as ThemeMode | null;
      return savedMode || (prefersDarkMode ? 'dark' : 'light');
    });


    useEffect(() => {
      localStorage.setItem('theme', mode);
    }, [mode]);


    const toggleTheme = () => {
        setMode((theme) => (theme === 'light' ? 'dark' : 'light'))
    };

    const theme = useMemo(() => ( mode ==='light'? lightTheme : darkTheme), [mode])

    return (
        <ThemeContext.Provider value = {{mode, toggleTheme}}>
              <MuiThemeProvider theme={theme}>
              <CssBaseline /> {/* ✅ Reset default CSS for MUI */}
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}