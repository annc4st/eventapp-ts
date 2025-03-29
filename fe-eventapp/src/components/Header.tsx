import React, { useEffect } from "react";

import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/userSlice";
import { RootState, AppDispatch } from "../store/store";
import { red } from "@mui/material/colors";
 
import Button from '@mui/material/Button';
import { useTheme } from "@mui/material/styles";
import { Avatar, AppBar, Toolbar, Box, IconButton, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import EventIcon from "@mui/icons-material/Event";
import AddIcon from "@mui/icons-material/Add";
import Person3Icon from "@mui/icons-material/Person3";
import MenuIcon from '@mui/icons-material/Menu';
import { alpha, styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';



// const StyledToolbar = styled(Toolbar)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   flexShrink: 0,
//   borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
//   backdropFilter: 'blur(24px)',
//   border: '1px solid',
//   borderColor: (theme.vars || theme).palette.divider,
//   backgroundColor: theme.vars
//     ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
//     : alpha(theme.palette.background.default, 0.4),
//   boxShadow: (theme.vars || theme).shadows[1],
//   padding: '8px 12px',
// }));



export const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
 const navigate = useNavigate();
 const theme = useTheme(); // Access theme inside the component
  
  const { user, tokenExpiresAt } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (tokenExpiresAt) {
      console.log("tokenExpiresAt >> ", tokenExpiresAt)
      const expirationTime = new Date(tokenExpiresAt).getTime();
      console.log("expirationTime >> ", expirationTime)
      const currentTime = Date.now();

      if(currentTime >= expirationTime){
        console.warn("Token expired! Logging out...");
        dispatch(logoutUser()); // Clear user from Redux & persisted storage
        alert("Your session has expired. Please log in again.");
        navigate("/login"); // Redirect to login
      }
    }
  }, [tokenExpiresAt, dispatch, navigate])

  return (
    <AppBar position="relative" sx={{ bgcolor: theme.palette.primary.main }}>

      <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>

        {/* Left side - Logo and Home Link */}
        <Box display="flex" alignItems="center" gap={2}>
               <Typography variant="h6" component={Link} to="/events" sx={{ textDecoration: "none", color: "white", fontWeight: "bold" }}>
            EventHub
          </Typography>
        </Box>


        {/* Middle - Navigation Links */}
        <Box display="flex" gap={3}>
          <Button component={Link} to="/events/create" startIcon={<AddIcon />} sx={{ color: "white" }}>
            Post Event
          </Button>
          <Button component={Link} to="/locations" startIcon={<EventIcon />} sx={{ color: "white" }}>
            Venues
          </Button>
          <Button component={Link} to="/groups" startIcon={<GroupsIcon />} sx={{ color: "white" }}>
            Groups
          </Button>
        </Box>


        {/* Right side - User Avatar & Authentication */}
        <Box display="flex" alignItems="center" gap={2}>
          {user ? (
            <>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>{user.email[0].toUpperCase()}</Avatar>
              <Button onClick={() => dispatch(logoutUser())} sx={{ color: "white" }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" sx={{ color: "white" }}>
                Login
              </Button>
              <Button component={Link} to="/register" variant="contained" color="secondary">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};