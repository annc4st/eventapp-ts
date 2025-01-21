import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../store/eventSlice";
import { fetchLocations } from "../store/locationSlice";
import { RootState, AppDispatch } from "../store/store";

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
      <h1> Events</h1>
      {loading && <p>Loading events ...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && events.length === 0 && <p>No events available.</p>}
      {!loading && !error && events.length > 0 && (
        <ul>
          {events.map((event) => {
            const location = getLocationDetails(event.locationId);
            return (
              <li key={event.id}>
                <h2>{event.name}</h2>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Distance: {event.distance} km</p>
                <p>Price: £ {event.ticketPrice}</p>
                {location ? (
                  <p>
                    Location:{" "}
                    {`${location.firstLine}, ${location.city}, ${location.postcode}`}
                  </p>
                ) : (
                  <p>Loading location details...</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
