import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchSingleEvent } from "../store/singleEventSlice";
import { fetchLocations } from "../store/locationSlice";
import { RootState, AppDispatch } from "../store/store";
import { SignUpParticipant } from "./SignUpParticipant";
import { fetchParticipants } from "../store/participantSlice";
import { Comments } from "./Comments";

import {Link as MuiLink} from '@mui/material/Link'
import Person3Icon from "@mui/icons-material/Person3";
import { Box, Container, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RouteIcon from '@mui/icons-material/Route';



export const EventPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const { user } = useSelector((state: RootState) => state.user);

  const {
    singleEvent,
    loading: singleEventLoading,
    error: singleEventError,
  } = useSelector((state: RootState) => state.singleEvent);

  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useSelector((state: RootState) => state.locations);

  const {
    participants,
    participantCount,
    loading: participantLoading,
    error: participantError,
  } = useSelector((state: RootState) => state.participants);

  // Fetch event when component mounts
  useEffect(() => {
    dispatch(fetchSingleEvent(eventId));
    dispatch(fetchLocations());
    dispatch(fetchParticipants(eventId));
  }, [dispatch, eventId]);

  // Combine loading states and errors;
  const loading = singleEventLoading || locationsLoading || participantLoading;
  const error = singleEventError || locationsError || participantError;

  // Find location by ID
  const getLocationDetails = (locationId: number) => {
    return locations.find((location) => location.id === locationId);
  };

  const location = getLocationDetails(singleEvent?.locationId ?? -1);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      
      <Container maxWidth="lg" >
 
          {singleEvent && (
          <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
                <Typography variant="h2" gutterBottom sx={{mt: 2, color: "secondary.main"}}>
                  {singleEvent.name}
                </Typography>

                {/* If user is author/owner of the event */}
                {user?.id === singleEvent.userId && (
                  <Box>
               <Link to={`/events/${singleEvent.id}/update`} style={{textDecoration: 'none'}} >
                    <Button> Update Event</Button>
                    </Link>
             
                  </Box>
                )}

            </Grid>



            {/* Left Column: Event Details */}
            <Grid size={{xs: 12, md: 6}}>  
              <Box sx={{mb: 2, mt: 2}}>
                <Typography  >
                  <CalendarMonthIcon />{" "} Date {"  "}
                  {new Date(singleEvent.date).toLocaleDateString()} {" "}
                  </Typography>
              </Box>

              <Box sx={{mb: 2, mt: 2}}>
                    <Typography> <AccessTimeIcon />{" "}
                    {new Date(singleEvent.date)
                      .toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .toLowerCase()}
                  </Typography>
              </Box>

              <Box sx={{mb: 2, mt: 2}}>
                  <Typography><RouteIcon/> {" "} Distance: {singleEvent.distance} km</Typography>
              </Box>

              <Box>
                <Typography variant="h6"> About this event: </Typography>

                <Typography>
                  Category: <DirectionsRunIcon />
                </Typography>

                {location ? (
                     <Box sx={{mb: 2, mt: 2}}>
                      <Typography sx={{mb: 1, mt: 1}}> Address </Typography>

                      <Typography sx={{color: 'secondary.main', border: 1, borderRadius: '16px', padding: "8px", borderColor: "primary.light"}}>
                        <LocationOnIcon />{"  "} 
                        {`${location.firstLine}, ${location.city}, ${location.postcode}`}
                      </Typography>
                  </Box>
                ) : (
                  <Typography>Loading location details..</Typography>
                )}
              </Box>

            </Grid>


  {/* Right Column:   Registration */}
 
            <Grid size={{xs: 12, md: 6}} >
              {/*Participants */}
              {participantCount > 0 ? (
               <Box sx={{mb: 2, mt: 2}}>
              
                    <Typography> <GroupsIcon size='lg' sx={{color: 'secondary.dark'}} /> 
                    {" "} {participantCount} {(participantCount == 1) ? "participant" : "participants"} 
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{mb: 2, mt: 2}}>
                  <Typography> No participants yet. </Typography>
                  </Box>
                )}

             <Box sx={{mb: 2, mt: 2,
              // color: 'secondary.main', border: 1, borderRadius: '16px', padding: "16px", 
              // borderColor: "primary.light",
              display: 'flex', 
              gap: 2,
      flexDirection: 'row', // Stack items vertically
      alignItems: 'center', // Center items horizontally
      // justifyContent: 'center', // Center items vertically
      // textAlign: 'center', // Center text
      spacing: 2
      }}>
             <Typography>Price  </Typography> 
             <Typography sx ={{border: 1, borderRadius: '8px', pl: "16px", pr: '16px', 
              borderColor: "primary.light", }}>£ {singleEvent.ticketPrice} </Typography>

              </Box>
              <Box sx={{mb: 2, mt: 2}}>
                <Typography  gutterBottom sx={{color: 'primary.main'}}
                variant='h5'
                >Buy ticket</Typography>

                {user ? (
                  <SignUpParticipant eventId={singleEvent?.id ?? -1} />
                ) : (
                   
                  <Typography>
                    {" "}
                    You need to <Link to={`/login`} style={{textDecoration: 'none', color:'#3698ad'}} >sign in </Link>to register for the event
                  </Typography>
               
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>


      <Comments eventId={singleEvent?.id} />
    </>
  );
};
