import React from "react";
import { Box, Container, Typography, Link, Divider, Toolbar, AppBar } from "@mui/material";
import Grid from '@mui/material/Grid2'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { useTheme } from "@mui/material/styles";
import { alpha, styled } from "@mui/material/styles";



export const Footer = () => {
  return (
  
    <AppBar
      component="footer"
      enableColorOnDark
       position="relative"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        padding: 0,
        width: "100%",  
      }}
    >
      <Container
       maxWidth="lg"  
       sx={{  bgcolor: "primary.light" }}
      
      //  sx={{ display: 'flex', flexDirection: "column", alignItems:"center"  }} 
     >
      
            <Box sx={{ display: 'flex', 
            flexDirection: "column", mt: 1
            }} >
            <Typography variant="h6" gutterBottom sx={{ color: "text.primary"}}>
            <DirectionsRunIcon /> Plan2Meet 
            </Typography>
            {/* <Typography variant="body2" sx={{ display: 'flex', flexDirection: "column"}}>
              Helping users organize their locations and events with ease.
            </Typography> */}
            </Box>
       
          <Box sx={{ display: 'flex', flexDirection: "row", alignItems:"center", gap: 2}} >
              <Link href="/"  sx={{ color: "text.primary"}} underline="hover" display="block">
                Home
              </Link>
              <Link href="/events"  sx={{ color: "text.primary"}} underline="hover" display="block">
                Events
              </Link>
              <Link href="/groups"  sx={{ color: "text.primary"}}underline="hover" display="block">
                Groups
              </Link>
              <Link href="/locations"  sx={{ color: "text.primary"}} underline="hover" display="block">
                Venues
              </Link>
            </Box>
          <Box sx={{ display: 'flex', flexDirection: "column", mt: 2, mb: 2}} >
            <Typography variant="body2"   sx={{ color: "text.primary"}}>
              © {new Date().getFullYear()} Plan2Meet. All rights reserved.
            </Typography>
          </Box>
      </Container>

    </AppBar>
  );
};


