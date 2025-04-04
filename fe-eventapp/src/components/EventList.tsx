import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../store/eventSlice";
import { fetchLocations } from "../store/locationSlice";
import { RootState, AppDispatch } from "../store/store";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { red } from "@mui/material/colors";
import { Link as MuiLink } from "@mui/icons-material/Link";

import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import {
  Box,
  Paper,
  Container,
  styled,
  CardHeader,
  Card,
  Avatar,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
//   ...theme.applyStyles('dark', {
//     backgroundColor: '#1A2027',
//   }),
// }));

export const EventList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Extract events state from Redux
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
  } = useSelector((state: RootState) => state.events);

  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useSelector((state: RootState) => state.locations);

  // Fetch events when component mounts
  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchLocations());
  }, [dispatch]);

  // Combine loading states and errors
  const loading = eventsLoading || locationsLoading;
  const error = eventsError || locationsError;

  // Find location by id
  const getLocationDetails = (locationId: number) => {
    return locations.find((location) => location.id === locationId);
  };

  return (
   <>
   
      {loading && <p color="gray">Loading events...</p>}
      {error && <p color="red">{error}</p>}
      {!loading && !error && events.length === 0 && <p>No events available.</p>}

      {!loading && !error && events.length > 0 && (
        <div>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" sx={{color: 'primary.dark', mt: 2}}
            align="center"
            
            gutterBottom
            > Events </Typography>
  
            <Typography sx={{color: 'secondary.main', align: 'left', mb: 2 }}  
            gutterBottom >
              Here you can find all events that we have and and you can sign up for one or more of them.
            </Typography>
          
  

          <Box sx={{ flexGrow: 1 }}>
                <Grid container 
                  spacing={{xs: 2, md: 3}}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  {events.map((event) => {
                    const location = getLocationDetails(event.locationId);
                    return (
           
                      <Grid key={event.id} size={{ xs: 2, sm: 4, md: 4 }} > 
                      <Card  elevation={3}
                      > 
                        <CardHeader
                          avatar={
                            <Avatar
                              sx={{ bgcolor: 'primary.light' }}
                              aria-label="category"
                            > Cat
                            </Avatar>
                          }
                          sx={{color: 'primary.dark' }}
                          title={event.name}
                          subheader={`Distance: ${event.distance} km `}
                        ></CardHeader>
{/* sx={{ flexGrow: 1 }} */}
                        <CardContent >
                          {location ? (
                            <Typography variant="body2" sx={{ color: "text.secondary" }} >
                              <LocationOnIcon sx={{color: "secondary.contrastText"}}/>
                              {`${location.firstLine}, ${location.city}, ${location.postcode}`}
                            </Typography>
                          ) : (
                            <Typography>Loading location details...</Typography>
                          )}
                        </CardContent>
                         {/* Flex container for button and icon */}
                          <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
                            <Link to={`/events/${event.id}`}>
                              <Button size="medium">Go to Event</Button>
                            </Link>
                            <FavoriteIcon sx={{marginRight:2}}/>
                        </Box>
                      </Card>
                      </Grid>
                    );
                  })}
                  
                </Grid>
                </Box>
                </Container>
                </div>
               )}
                </>
         
  );
};
