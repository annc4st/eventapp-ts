import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/userSlice";
import { RootState, AppDispatch } from "../store/store";
import { Button } from "@mui/material"; // Adjust based on your UI library


export const LogoutBtn: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  

  const handleLogout = async () => {
    try {
        await dispatch(logoutUser())
        navigate("/")
    } catch (error) {
        console.log("Logout failed:", error);
    }
 
  };

  return (
    <Button onClick={handleLogout} variant="contained" color="secondary">
      Logout
    </Button>
  );
};

