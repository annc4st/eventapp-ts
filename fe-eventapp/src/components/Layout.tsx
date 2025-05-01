import { Container, Box } from "@mui/material";
import { Navbar } from "./Navbar"
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";


export const Layout = () => {

    return (
        <>
        <Navbar />
        <Box component="main" sx={{ minHeight: "calc(100vh - 160px)", py: 4 }}>
          <Container maxWidth="lg">
          <Outlet />
          </Container>
        </Box>

        <Footer />
        </>
    )
}