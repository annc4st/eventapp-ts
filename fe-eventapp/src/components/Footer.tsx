import React from "react";
import { Box, Container, Typography, Link, Divider } from "@mui/material";
import Grid from '@mui/material/Grid2'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
 


const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 4,
        mx: 2,
        mr: 2, 
        bgcolor: "primary.light",
      }}
    >
      <Container sx={{ display: 'flex', flexDirection: "column", alignItems:"center"
         
        
      }} >
      
            <Box sx={{ display: 'flex', flexDirection: "column", alignItems:"center"}} >
            <Typography variant="h6" gutterBottom sx={{alignSelf: "center", color: "#fafafa"}}>
            <DirectionsRunIcon /> Plan2Meet 
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', flexDirection: "column"}}>
              Helping users organize their locations and events with ease.
            </Typography>
            </Box>
       
          <Box sx={{ display: 'flex', flexDirection: "row", alignItems:"center", gap: 2, mt: 2}} >
            {/* <Typography variant="subtitle1" gutterBottom>
              Links
            </Typography> */}
            <Link href="/" color="inherit" underline="hover" display="block">
              Home
            </Link>
            <Link href="/events" color="inherit" underline="hover" display="block">
              Events
            </Link>
            <Link href="/groups" color="inherit" underline="hover" display="block">
              Groups
            </Link>
            <Link href="/locations" color="inherit" underline="hover" display="block">
              Venues
            </Link>
            </Box>
          {/* </Grid> */}

          {/* Legal */}
          {/* <Grid size={{ xs: 12, md: 6 }}> */}
          {/* <Box sx={{ display: 'flex', flexDirection: "row", alignItems:"center", gap: 2}} >
            <Typography variant="subtitle1" gutterBottom>
              Legal
            </Typography>
            <Link href="/privacy" color="inherit" underline="hover" display="block">
              Privacy Policy
            </Link>
            <Link href="/terms" color="inherit" underline="hover" display="block">
              Terms of Service
            </Link>
            </Box> */}
          {/* </Grid>
        </Grid> */}

        <Divider sx={{ bgcolor: "white", my: 2 }} />

        <Typography variant="body2" align="center" sx={{ opacity: 0.75 }}>
          © {new Date().getFullYear()} Plan2Meet. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
