import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchSingleEvent } from "../store/singleEventSlice";
import { fetchLocations } from "../store/locationSlice";
import { RootState, AppDispatch } from "../store/store";
import { SignUpParticipant } from "./SignUpParticipant";
import { fetchParticipants } from "../store/participantSlice";
import { Comments } from "./Comments";
import Person3Icon from "@mui/icons-material/Person3";
import { Box, Container, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";

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
      {" "}
      <Container maxWidth="lg">
        {/* <div> */}

        {singleEvent && (
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="h2" gutterBottom>
                {singleEvent.name}
              </Typography>
            </Grid>

            <Grid size={6}>
              <Box>
                <Typography>
                  <CalendarMonthIcon />{" "}
                  {new Date(singleEvent.date).toLocaleDateString()} at{" "}
                  {new Date(singleEvent.date)
                    .toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                    .toLowerCase()}
                </Typography>
              </Box>

              <Box>
                {" "}
                <Typography>Distance: {singleEvent.distance} km</Typography>
              </Box>

              <Box>
                <Typography> About this event: </Typography>

                <Typography>
                  Category: <DirectionsRunIcon />
                </Typography>

                {location ? (
                  <Typography>
                    <LocationOnIcon />
                    {`${location.firstLine}, ${location.city}, ${location.postcode}`}
                  </Typography>
                ) : (
                  <Typography>Loading location details..</Typography>
                )}
              </Box>
            </Grid>
            <Grid size={4}>
              <Box>
                {participantCount > 0 ? (
                  <div>
                    <GroupsIcon />
                    <Typography> {participantCount}</Typography>
                  </div>
                ) : (
                  <Typography> No participants yet. </Typography>
                )}

                <Typography>Buy ticket</Typography>

                {user ? (
                  <SignUpParticipant eventId={singleEvent?.id ?? -1} />
                ) : (
                  <Typography>
                    {" "}
                    You need to sign in to register for the event
                  </Typography>
                )}
              </Box>
            </Grid>

            {user?.id === singleEvent.userId && (
              <Link to={`/events/${singleEvent.id}/update`}>Update Event</Link>
            )}
          </Grid>
        )}

        <Grid size={12}>
        <Comments eventId={singleEvent?.id} />
        </Grid>

 
      </Container>
    </>
  );
};
