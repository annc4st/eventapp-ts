import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../store/locationSlice";
import { RootState, AppDispatch } from "../store/store";
import { CreateLocation } from "./CreateLocation";
import { Box, Container, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CreateLocationModal from "./CreateLocationModal";
import { useMediaQuery, useTheme } from "@mui/material";



export const LocationsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
 

  const { locations, loading, error } = useSelector(
    (state: RootState) => state.locations
  );

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  return (
    
      <Container >
        <Grid container spacing={5}>
          <Grid sx={{ mt: 2 }} size={{ xs: 12, md: 6 }}>
            <Typography
              component="h1"
              variant="h3"
              sx={{
                color: "primary.dark",
                align: "left",
                mb: 2,
                fontSize: "clamp(2rem, 10vw, 2.15rem)",
              }}
              gutterBottom
            >
              List of Locations
            </Typography>
 {/* Modal only for small screens */}
            <Grid sx={{ display: { md: "none" } }}>
              <CreateLocationModal />
            </Grid>
            {loading && <Typography>Loading locations ...</Typography>}
            {error && <Typography style={{ color: "red" }}>{error}</Typography>}

            {!loading && !error && locations.length === 0 && (
              <Typography>No locations available.</Typography>
            )}
            {!loading && !error && locations.length > 0 && (
              <>
                {locations.map((l) => {
                  return (
                    <Box
                      key={l.id}
                      sx={{
                        mb: 2,
                        mt: 2,
                        border: "1px",
                        borderRadius: "8px",
                        bgcolor: "secondary.light",
                        padding: "8px",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "secondary.main",
                          border: "1px",
                          borderRadius: "8px",
                          bgcolor: "secondary.light",
                        }}
                      >
                        {l.firstLine}
                      </Typography>
                      <Typography
                        sx={{
                          color: "secondary.main",
                          border: "1px",
                          borderRadius: "8px",
                          bgcolor: "secondary.light",
                        }}
                      >
                        {l.city}, {l.postcode}
                      </Typography>
                    </Box>
                  );
                })}
              </>
            )}
          </Grid>
{/* Form for medium and larger screens */}
          <Grid
            sx={{
              display: { xs: "none", md: "flex", flexDirection: "column" },
            }}
            size={{ md: 6 }}
          >
            <Box p={2}>
            <CreateLocation />
            </Box>
          </Grid>
        </Grid>

        {/* <CreateLocationModal /> */}
      </Container>
    
  );
};
