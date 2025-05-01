import { useThemeContext } from '../context/ThemeContext';
import { IconButton } from '@mui/material';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import Brightness7Icon from '@mui/icons-material/Brightness7';



export const DarkLightToggle = () => {
 
    const { mode, toggleTheme } = useThemeContext();
 
    return (
        <IconButton onClick={toggleTheme} >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness5Icon />}
      </IconButton>
  )
}

 