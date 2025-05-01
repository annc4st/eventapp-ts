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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

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

import CardEvent from "./CardEvent";

 

export const EventList = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Extract events state from Redux
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
  } = useSelector((state: RootState) => state.events);

  const { locations,
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

  if (loading) return <Typography color="text.secondary">Loading events...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (events.length === 0) return <Typography>No events available.</Typography>;


  return (
 <>
         {/* <Container maxWidth="lg" sx={{mb: 4}}> */}
          <Typography variant="h3" component="h1" sx={{color: 'primary.dark', mt: 2}}
            align="center" gutterBottom> 
            Events </Typography>
  
            <Typography sx={{color: 'secondary.main', align: 'left', mb: 2 }}  
            gutterBottom >
             Browse and sign up for upcoming events!
            </Typography>
          
          <Box sx={{ flexGrow: 1 }}>
                <Grid container 
                  spacing={{xs: 2, md: 3}}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  {events.map((event) => {
                    // const location = getLocationDetails(event.locationId);
                    return (
           
                      <Grid key={event.id} size={{ xs: 6, sm: 4, md: 4 }} > 
                      <CardEvent event={event} location={getLocationDetails(event.locationId)} />
                      </Grid>
                    );
                  })}
                  
                </Grid>
                </Box>
          
                
            
          </>
         
  );
};
