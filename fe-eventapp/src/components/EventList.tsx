import { Box, Typography, Grid } from "@mui/material";
import CardEvent from "./CardEvent";
import { useEvents } from "../hooks/useEvents";

export const EventList = () => {

  const {
    data: events = [],
    isPending: eventsPending,
    error: eventsError,
    isSuccess: eventsSuccess,
  } = useEvents();

  if (eventsPending)
    return <Typography color="text.secondary">Loading events...</Typography>;
  if (eventsError) return <Typography color="error">{eventsError.message}</Typography>;
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

      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {eventsSuccess && events.map((event) => {
            return (
              <Grid key={event.id} size={{ xs: 6, sm: 4, md: 4 }}>
                <CardEvent
                  event={event}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};
