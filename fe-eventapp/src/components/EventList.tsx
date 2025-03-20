import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../store/eventSlice";
import { fetchLocations } from "../store/locationSlice";
import { RootState, AppDispatch } from "../store/store";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {Box, Container, Flex, Heading, Text} from "@radix-ui/themes";
import { Link } from "react-router-dom";




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
    <div>
      <Container size="2">
        <Flex direction= "column" pb="4" pt="4">
         {/* <h1> Events</h1> */}
         <Heading> Events </Heading>
      {loading && <Text color="gray">Loading events...</Text>}
      {error && <Text color="red">{error}</Text>}
      {!loading && !error && events.length === 0 && <p>No events available.</p>}
      {!loading && !error && events.length > 0 && (
       <ul>
          {events.map((event) => {
            const location = getLocationDetails(event.locationId);
            return (
              
              <Box style={{ background: "var(--gray-a2)", 
              borderRadius: "var(--radius-3)" }} 
              width="300px" p="1" m="4" 
              key={event.id} >
               
               <li>
               <Link to={`/events/${event.id}`}> <h2>{event.name}</h2>  </Link>
                <Text as="div" size="2">
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Distance: {event.distance} km</p>
                <p>Price: £ {event.ticketPrice}</p>
                </Text>
                {location ? (
                   <Text as="div" color="gray">
                    <LocationOnIcon sx={{color: '#646cff'}} />{" "}
                    {`${location.firstLine}, ${location.city}, ${location.postcode}`}
                   </Text>
                ) : (
                  <Text as="div" color="gray"> Loading location details...
                  </Text>
                )}
                </li>
              {/* </Link> */}
              </Box>
  
 
            );
          })}
        </ul>
      )}
      </Flex>
      </Container>
    </div>
  );
};
