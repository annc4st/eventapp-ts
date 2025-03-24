import React, { useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Person3Icon from "@mui/icons-material/Person3";

import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "../store/userSlice";
import { RootState, AppDispatch } from "../store/store";
 
import { red } from "@mui/material/colors";
 
import Button from '@mui/material/Button';
import { useTheme } from "@mui/material/styles";

import { Stack, Avatar } from "@mui/material";
 



export const Header = () => {
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
    <>
  <Stack direction="row" spacing={2}>
        <Link to="/events">
          <HomeIcon sx={{ color: theme.palette.primary.dark, fontSize: "large" }} />{" "}
        </Link>{" "}
        <Link to="/events/create">Post Event</Link>
        <Link to="/locations">Venues</Link>
        <Link to="/groups">Groups</Link>
        {/* <Person3Icon  color="secondary" fontSize="large" />{" "} */}
        <Avatar
        sx={{ bgcolor: red[500] }}
        aria-label="category"
        >{user ? (`${user.email.split('')[0].toUpperCase()}`) : '?'}
        </Avatar>
      
     
   
      {user ? (
          <div>
          {/* <p>Welcome, {user.email.split("@")[0]}</p> */}
          <Button onClick={() => dispatch(logoutUser())}>Logout</Button>
        </div>
      ) : (
        <div>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </div>
      )}
 </Stack>
    </>
  );
};