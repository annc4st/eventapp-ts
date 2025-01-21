import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSingleEvent } from "../store/singleEventSlice";
import { fetchCommentsByEventId } from "../store/commentSlice";
import { fetchLocations } from "../store/locationSlice";
import { RootState, AppDispatch } from "../store/store";

export const EventPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);

  const {
    singleEvent,
    loading: singleEventLoading,
    error: singleEventError,
  } = useSelector((state: RootState) => state.singleEvent);
  const {
    comments,
    loading: commentLoading,
    error: commentError,
  } = useSelector((state: RootState) => state.comments);
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useSelector((state: RootState) => state.locations);

  // Fetch events when component mounts
  useEffect(() => {
    dispatch(fetchSingleEvent(eventId));
    dispatch(fetchLocations());
    dispatch(fetchCommentsByEventId(eventId));
  }, [dispatch, eventId]);

  // Combine loading states and errors;
  const loading = singleEventLoading || locationsLoading || commentLoading;
  const error = singleEventError || locationsError || commentError;

  // Find location by ID
  const getLocationDetails = (locationId: number) => {
    return locations.find((location) => location.id === locationId);
  };

  const location = getLocationDetails(singleEvent?.locationId ?? -1);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {singleEvent && (
        <>
          <h2>{singleEvent.name}</h2>
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
        </>
      )}
      <div>
        <h3>Comments</h3>
        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id}>
              <p>{c.content}</p>
              <p>Posted: {new Date(c.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};
