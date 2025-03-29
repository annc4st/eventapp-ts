import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchCommentsByEventId } from "../store/commentSlice";
import { CreateComment } from "./CreateComment";



interface CommentProps {
    eventId: number;
  }


  
export const Comments: React.FC<CommentProps> = ({ eventId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { comments, loading, error } = useSelector(
    (state: RootState) => state.comments
  );

  useEffect(() => {
    dispatch(fetchCommentsByEventId(eventId));
  }, [dispatch, eventId]);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>Error loading comments: {error}</p>;

  return (
    <div>
      <h3>Comments</h3>
      {comments.length > 0 ? (
        comments.map((c) => (
          <div key={c.id}>
            <p>{c.content}</p>
            <p>author: {c.partEmail}</p>
            <p>Posted: {new Date(c.createdAt).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}
      {user ? ( <CreateComment eventId={eventId} />
      ) : (
        <p>You need to sign in to post a comment</p>
      )}
    </div>
  );
};
