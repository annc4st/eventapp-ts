import React, { useEffect } from "react";
import "@radix-ui/themes/styles.css";
// import { FaceIcon, HomeIcon } from "@radix-ui/react-icons"
import HomeIcon from "@mui/icons-material/Home";
import Person3Icon from "@mui/icons-material/Person3";

import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "../store/userSlice";
import { RootState, AppDispatch } from "../store/store";
import { LogoutBtn } from "./LogoutBtn";
import { Box, Card, TabNav, Flex, Text } from "@radix-ui/themes";
import Button from '@mui/material/Button'



export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();


 const navigate = useNavigate();
  
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
      <Flex direction="row" gap="4" pb="2">
        <Link to="/events">
          <HomeIcon sx={{ color: "#646cff" }} fontSize="large" />{" "}
        </Link>{" "}
        <Link to="/events/create">Post Event</Link>
        <Link to="/locations">Venues</Link>
        <Link to="/groups">Groups</Link>
        <Person3Icon fontSize="large" sx={{ color: "#213547" }} />{" "}
      
     
   
      {user ? (
      <div>
      <p>Welcome, {user.email.split("@")[0]}</p>
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
      </Flex>
    </>
  );
};