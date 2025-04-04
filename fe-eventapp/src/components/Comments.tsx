import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState, AppDispatch } from "../store/store";
import { fetchCommentsByEventId } from "../store/commentSlice";
import { CreateComment } from "./CreateComment";
import { Box, Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";



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
 
    <Container maxWidth="lg" >
      <Grid container spacing={2}>
       <Grid size={{xs: 12, md: 6}}>
      <Typography variant="h4" sx={{ color: 'secondary.dark'}}
      >Comments</Typography>


      {comments.length > 0 ? (
        comments.map((c) => (
          <Box key={c.id} sx={{ mb: 2, mt: 2,
            border: '1px', borderRadius: '8px', bgcolor:'secondary.light', padding: '8px'}}>
             <Box sx={{ mb: 2 }}>
              <Typography  color='secondary'>{c.content}</Typography></Box>

             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{color: 'secondary.main', fontSize: '12px', fontStyle: 'oblique'}}>{c.partEmail}</Typography>
            <Typography sx={{color: 'secondary.main', fontSize: '12px', pr: '16px', fontStyle: 'oblique'}}>{new Date(c.createdAt).toLocaleDateString()}</Typography>
            </Box>
          </Box>
        ))
      ) : (
        <Box sx={{ mb: 2, mt: 2,
        borderRadius: '8px', bgcolor:'secondary.light', padding: '8px'}}>
        <Typography>No comments yet. Be the first to comment!</Typography>
        </Box>
      )}


      {user ? ( <CreateComment eventId={eventId} />
      ) : (
        <Typography sx={{color: 'secondary.main', 
          border: 1, borderRadius: '8px', borderColor: "primary.light", padding: '8px'
        }}>
          You need to <Link to={`/login`} style={{textDecoration: 'none', color:'#3698ad'}}
         >sign in</Link> to post a comment</Typography>
        
      )}
      </Grid>
      </Grid>
    </Container>
    // </>
  );
};
