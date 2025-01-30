import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSingleEvent } from "../store/singleEventSlice";
import { fetchCommentsByEventId } from "../store/commentSlice";
import { fetchLocations } from "../store/locationSlice";
import { RootState, AppDispatch } from "../store/store";
import { CreateComment } from "./CreateComment";
import { SignUpParticipant } from "./SignUpParticipant";
import { fetchParticipants } from "../store/participantSlice";
import Person3Icon from "@mui/icons-material/Person3";
import { UpdateEvent} from "./UpdateEvent";



export const EventPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const {user} = useSelector((state: RootState) => state.user);

  const { singleEvent,
    loading: singleEventLoading,
    error: singleEventError,
  } = useSelector((state: RootState) => state.singleEvent);
  const { comments,
    loading: commentLoading,
    error: commentError,
  } = useSelector((state: RootState) => state.comments);
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useSelector((state: RootState) => state.locations);

  const { participants, participantCount,  
    loading: participantLoading, 
    error: participantError } = useSelector((state: RootState) => state.participants);
    
    // Fetch events when component mounts
  useEffect(() => {
    dispatch(fetchSingleEvent(eventId));
    dispatch(fetchLocations());
    dispatch(fetchCommentsByEventId(eventId));
    dispatch(fetchParticipants(eventId));

  }, [dispatch, eventId]);

  // Combine loading states and errors;
  const loading = singleEventLoading || locationsLoading || commentLoading || participantLoading;
  const error = singleEventError || locationsError || commentError || participantError;

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

<div >
  <span >{participantCount}</span>
  <Person3Icon style={{ verticalAlign: 'middle', color: "#646cff" }} />
</div>

<div><UpdateEvent eventId={singleEvent?.id ?? -1} /></div>
         

{ user ? <SignUpParticipant eventId = {singleEvent?.id ?? -1} /> : <p> You need to sign in to register for the event</p>}
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
      { user ? <CreateComment eventId = {singleEvent?.id ?? -1}/>  : <p> You need to sign in to post a comment</p>  }
    </div>
  );
};
