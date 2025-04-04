import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/userSlice";
import { RootState, AppDispatch } from "../store/store";
import { red } from "@mui/material/colors";

import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Container,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import EventIcon from "@mui/icons-material/Event";
import AddIcon from "@mui/icons-material/Add";
import Person3Icon from "@mui/icons-material/Person3";
import MenuIcon from "@mui/icons-material/Menu";
import { alpha, styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Divider from "@mui/material/Divider";
import { gray } from "../shared-theme/themePrimitives";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: "8px",
  //   backdropFilter: 'blur(24px)',
  border: "1px solid",
  borderColor: alpha(gray[300], 0.4),
  boxShadow: theme.palette.background.paper,
  backgroundColor: theme.palette.background.default,
  padding: "8px 12px",
}));

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme(); // Access theme inside the component

  const { user, tokenExpiresAt } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (tokenExpiresAt) {
      console.log("tokenExpiresAt >> ", tokenExpiresAt);
      const expirationTime = new Date(tokenExpiresAt).getTime();
      console.log("expirationTime >> ", expirationTime);
      const currentTime = Date.now();

      if (currentTime >= expirationTime) {
        console.warn("Token expired! Logging out...");
        dispatch(logoutUser()); // Clear user from Redux & persisted storage
        alert("Your session has expired. Please log in again.");
        navigate("/login"); // Redirect to login
      }
    }
  }, [tokenExpiresAt, dispatch, navigate]);

  return (
    <AppBar
      position="relative"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
        padding: 0,
        width: "100%",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters sx={{ boxShadow: 4 }}>
          {/* Left Side - Brand Name */}
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", ps: 0 }}
          >
            <Button
              variant="text"
              component={Link}
              to="/" // main page in future
              sx={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "primary.dark",
              }}
            >
              {/* EventHub */}Plan2Meet
            </Button>

            {/* Desktop Menu - Hidden on Small Screens */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              <Button
                variant="text"
                color="primary"
                size="small"
                component={Link}
                to="/events"
              >
                Events
              </Button>

              <Button
                variant="text"
                color="primary"
                startIcon={<AddIcon />}
                size="small"
                component={Link}
                to="/events/create"
              >
                Post Event
              </Button>

              <Button
                variant="text"
                color="primary"
                startIcon={<EventIcon />}
                size="small"
                component={Link}
                to="/locations"
              >
                Venues
              </Button>

              <Button
                variant="text"
                color="primary"
                component={Link}
                to="/groups"
                startIcon={<GroupsIcon />}
                size="small"
              >
                Groups
              </Button>
            </Box>
          </Box>

          {/*  LOGIn, LOGOUT .. */}

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {user ? (
              <>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                  {user.email[0].toUpperCase()}
                </Avatar>
                <Button onClick={() => dispatch(logoutUser())}>Logout</Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  color="primary"
                  variant="text"
                  size="small"
                >
                  Sign in
                </Button>

                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="secondary"
                  size="small"
                >
                  {" "}
                  Register{" "}
                </Button>
              </>
            )}
          </Box>

          {/* GO to SMALL screen mode */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem component={Link} to="/events">Events</MenuItem>
                <MenuItem component={Link} to="/events/create">Post Event</MenuItem>
                <MenuItem component={Link} to="/locations">Venues</MenuItem>
                <MenuItem component={Link} to="/groups">Groups</MenuItem>
                <Divider sx={{ my: 3 }} />

                {user ? (
                  <>
                    <MenuItem>
                      <Button
                        onClick={() => dispatch(logoutUser())}
                        color="primary"
                        variant="outlined"
                        fullWidth
                      >
                        Logout
                      </Button>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem>
                      <Button
                        component={Link}
                        to="/login"
                        color="primary"
                        variant="contained"
                        fullWidth
                      >
                        Sign in
                      </Button>
                    </MenuItem>

                    <MenuItem>
                      <Button
                        component={Link}
                        to="/register"
                        color="secondary"
                        variant="contained"
                        fullWidth
                      >
                        Register
                      </Button>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
