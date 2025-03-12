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

  // Fetch events when component mounts
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
      <div>
        {singleEvent && (
          <>
            <h2>{singleEvent.name}</h2>
            {user?.id === singleEvent.userId && (
              <Link to={`/events/${singleEvent.id}/update`}>Update Event</Link>
            )}

            <p>Date: {new Date(singleEvent.date).toLocaleDateString()}</p>
            <p>Distance: {singleEvent.distance} km</p>
            <p>Price: {singleEvent.ticketPrice}</p>
            {location ? (
              <p>
                Location:{" "}
                {`${location.firstLine}, ${location.city}, ${location.postcode}`}
              </p>
            ) : (
              <p>Loading location details...</p>
            )}

            {participantCount > 0 ? (
              <div>
                <span>{participantCount}</span>
                <Person3Icon
                  style={{ verticalAlign: "middle", color: "#646cff" }}
                />
              </div>
            ) : (
              <p> No participants yet. </p>
            )}
            {user ? (
              <SignUpParticipant eventId={singleEvent?.id ?? -1} />
            ) : (
              <p> You need to sign in to register for the event</p>
            )}
          </>
        )}
      </div>
      <Comments eventId={singleEvent?.id} />
    </>
  );
};
