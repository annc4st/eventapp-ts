import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Container, Typography, Button, Tooltip, Grid, Link as MuiLink } from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RouteIcon from "@mui/icons-material/Route";
import { NotFoundEventPage } from "./NotFoundEventPage";
import { MapPreview } from "./MapPreview";
import { useSingleEvent } from "../hooks/useSingleEvent";
import { useParticipants } from "../hooks/useParticipants";
import { RootState } from "../store/store";
import { SignUpParticipant } from "./SignUpParticipant";
import { Comments } from "./Comments";

export const EventPage2: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const eventId = Number(id);
    const { user } = useSelector((state: RootState) => state.user);
    
    const { data: event, isLoading: isEventLoading, error: eventError } = useSingleEvent(eventId);
    const { data: participants, isLoading: isParticipantsLoading, error: participantsError } = useParticipants(eventId);

const participantCount = participants ? participants.length : 0;

    const loading = isEventLoading || isParticipantsLoading;
    const error = eventError || participantsError;

 if (!loading && !event) {
    return < NotFoundEventPage />
  }

 if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>

    <Container maxWidth="lg">
        {event && (
          <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h2"
                gutterBottom
                sx={{ mt: 2, color: "secondary.main" }}
              >
                {event.name}
              </Typography>

              {event?.userId === user?.id  && (
                <Box>
                  <Link
                    to={`/events/${event.id}/update`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button> Update Event</Button>
                  </Link>
                </Box>
              )}
            </Grid>

            {/* Left Column: Event Details */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Typography>
                  <CalendarMonthIcon sx={{color: 'primary.main'}} /> Date {"  "}
                  {new Date(event.date).toLocaleDateString()}{" "}
                </Typography>
              </Box>

              <Box sx={{ mb: 2, mt: 2 }}>
                <Typography>
                  {" "}
                  <AccessTimeIcon sx={{color: 'primary.main'}} />{" "}
                  {new Date(event.date)
                    .toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                    .toLowerCase()}
                </Typography>
              </Box>

              <Box sx={{ mb: 2, mt: 2 }}>
                <Typography>
                  <RouteIcon sx={{color: 'primary.main'}}/> Distance: {event.distance} km
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6"> About this event: </Typography>

                <Typography>
                  Category: <DirectionsRunIcon />
                </Typography>

                {event.location ? (
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <Typography sx={{ mb: 1, mt: 1 }}> Address</Typography>

                  <Tooltip  title="Open this location in Google Maps" placement="top">
                    <MuiLink 
                    href={`https://www.google.com/maps/search/?api=1&query=${event.location.firstLine}+${event.location.city}+${event.location.postcode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="secondary.main"
                    > 
                    <Typography
                      sx={{
                        border: 1,
                        borderRadius: "16px",
                        padding: "8px",
                        borderColor: "primary.light",
                      }}
                    >
                      <LocationOnIcon sx={{color: 'primary.main'}}/>
                      {"  "}
                      {`${event.location.firstLine}, ${event.location.city}, ${event.location.postcode}`}
                    </Typography>
                    </MuiLink>
                    </Tooltip>
                
                  </Box>
                ) : (
                  <Typography>Loading location details..</Typography>
                )}
              </Box>
              <Box>
                {/* Map preview */}
                <MapPreview lat={53.3251} lng={ -2.2367} locationName={`${event.location?.firstLine}`}/>
              </Box>
            </Grid>

{/* Right Column:   Registration */}

            <Grid size={{ xs: 12, md: 6 }}>
              {/*Participants */}
              {participantCount > 0 ? (
                <Box sx={{ mb: 2 }}>
                  <Typography>
                    {" "}
                    <GroupsIcon
                      sx={{ color: "secondary.main", size: "lg" }}
                    />{" "}
                    {participantCount}{" "}
                    {participantCount == 1 ? "participant" : "participants"}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mb: 2, mt: 2 }}>
                  <Typography> No participants yet. </Typography>
                </Box>
              )}

              <Box sx={{ mb: 2, mt: 2, display: "flex", gap: 2,
                  flexDirection: "row", // Stack items vertically
                  alignItems: "center", // Center items horizontally
                  spacing: 2,
                }}
              >
                <Typography>Price </Typography>
                <Typography
                  sx={{
                    border: 1,
                    borderRadius: "8px",
                    pl: "16px",
                    pr: "16px",
                    borderColor: "primary.light",
                  }}
                >
                  £ {event.ticketPrice}{" "}
                </Typography>
              </Box>
              <Box sx={{ mb: 2, mt: 2 }}>
                <Typography
                  gutterBottom
                  sx={{ color: "primary.light" }}
                  variant="h5"
                >
                  Buy ticket
                </Typography>

                {user ? (
                  <SignUpParticipant eventId={event?.id ?? -1} />
                ) : (
                  <Typography>
                    {" "}
                    You need to{" "} <Link to={`/login`} style={{ textDecoration: "none", color: "#3698ad" }}
                                  > sign in{" "} </Link>
                    to register for the event
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>

      <Comments eventId={eventId} />


   </>
  );
}