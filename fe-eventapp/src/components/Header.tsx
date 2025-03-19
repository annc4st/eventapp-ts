import React from "react";
import "@radix-ui/themes/styles.css";
// import { FaceIcon, HomeIcon } from "@radix-ui/react-icons"
import HomeIcon from "@mui/icons-material/Home";
import Person3Icon from "@mui/icons-material/Person3";

import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice";
import { RootState, AppDispatch } from "../store/store";
import { LogoutBtn } from "./LogoutBtn";
import { Box, Card, TabNav, Flex, Text } from "@radix-ui/themes";

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useSelector((state: RootState) => state.user);

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
      
     
   
      {user && (
        <div>
          <p>Welcome, {user.email.split('@')[0]}</p>
          <LogoutBtn />
        </div>
      )}

      {!user && (
        <div>
          {/* <p>Welcome, Stranger!</p> */}
          <Link to={"/login"}>
            <button>Login</button>
          </Link>
          <Link to={"/register"}>
            <button>Register</button>
          </Link>
        </div>
      )}
      </Flex>
    </>
  );
};