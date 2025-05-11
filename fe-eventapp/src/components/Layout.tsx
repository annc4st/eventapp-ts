import { Container, Box } from "@mui/material";
import { Navbar } from "./Navbar"
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";


export const Layout = () => {

    return (
      // "sticky footer" layout 
      <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", 
      }}
    >
        <Navbar />
        <Box component="main" sx={{flex: 1, py: 4 }}>
          {/*  minHeight: "calc(100vh - 160px)", */}
          <Container maxWidth="lg">
          <Outlet />
          </Container>
        </Box>

        <Footer />
        </Box>
    )
}