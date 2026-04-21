import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../store/store";
import { CreateComment } from "./CreateComment";
import { Box, Container, Typography, Grid } from "@mui/material";
import { useComments } from "../hooks/useComments";
import { Comment } from "../types";

interface CommentProps {
  eventId: number;
}

export const Comments: React.FC<CommentProps> = ({ eventId }) => {

  const { user } = useSelector((state: RootState) => state.user);
  const { data: comments = [], isLoading: loading, error } = useComments(eventId);

  if (loading) return <Typography>Loading comments...</Typography>;
  if (error) return <Typography>Error loading comments: {error.message}</Typography>;

  return (
    <Container maxWidth="lg" >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" sx={{ color: 'primary.light' }}
          >Comments</Typography>

          {comments.length > 0 ? (
            comments.map((c: Comment) => (
              <Box key={c.id} sx={{
                mb: 2, mt: 2,
                border: '1px', borderRadius: '8px', bgcolor: 'background.paper', padding: '8px'
              }}>
                <Box sx={{ mb: 2 }}>
                  <Typography color='text' >{c.content}</Typography></Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: 'text.secondary', fontSize: '12px', fontStyle: 'oblique' }}>{c.authorName}</Typography>
                  <Typography sx={{ color: 'primary.main', fontSize: '12px', pr: '16px', fontStyle: 'oblique' }}>{new Date(c.createdAt).toLocaleDateString()}</Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Box sx={{
              mb: 2, mt: 2,
              borderRadius: '8px', bgcolor: 'background.paper', padding: '8px'
            }}>
              <Typography>No comments yet. Be the first to comment!</Typography>
            </Box>
          )}


          {user ? (<CreateComment eventId={eventId} />
          ) : (
            <Typography sx={{
              border: 1, borderRadius: '8px', borderColor: "primary.light", padding: '8px'
            }}>
              You need to <Link to={`/login`} style={{ textDecoration: 'none', color: '#3698ad' }}
              >sign in</Link> to post a comment</Typography>

          )}
        </Grid>
      </Grid>
    </Container>
    // </>
  );
};
