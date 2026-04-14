import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Grid } from "@mui/material";

import CardEvent from "./CardEvent";
import { getLocations } from "../services/locationService";
import { getEvents } from "../services/eventService";

export const EventList = () => {
  const {
    data: events = [],
    isLoading: eventsLoading,
    error: eventsError,
  } = useQuery({ queryKey: ["events"], queryFn: getEvents });

  // Fetch locations
  const {
    data: locations = [],
    isLoading: locationsLoading,
    error: locationsError,
  } = useQuery({ queryKey: ["locations"], queryFn: getLocations });

  // Combined loading states and errors
  const loading = eventsLoading || locationsLoading;
  const error = eventsError || locationsError;

  const getLocationDetails = (locationId: number) => {
    return locations.find((location) => location.id === locationId);
  };

  if (loading)
    return <Typography color="text.secondary">Loading events...</Typography>;
  if (error) return <Typography color="error">{error.message}</Typography>;
  if (events.length === 0) return <Typography>No events available.</Typography>;

  return (
    <>
      <Typography
        variant="h3"
        component="h1"
        sx={{ color: "primary.dark", mt: 2 }}
        align="center"
        gutterBottom
      >
        Events
      </Typography>

      <Typography
        sx={{ color: "secondary.main", align: "left", mb: 2 }}
        gutterBottom
      >
        Browse and sign up for upcoming events!
      </Typography>

      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {events.map((event) => {
            // const location = getLocationDetails(event.locationId);
            return (
              <Grid key={event.id} size={{ xs: 6, sm: 4, md: 4 }}>
                <CardEvent
                  event={event}
                  location={getLocationDetails(event.locationId)}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};
