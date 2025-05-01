import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../store/groupSlice";
import { RootState, AppDispatch } from "../store/store";
import { CreateGroup } from "./CreateGroup";
import { Link } from "react-router-dom";
import { Box, Container, Typography, Button, Card, CardContent, CardHeader, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ShareIcon from '@mui/icons-material/Share';



export const GroupsList = () => {
  const dispatch = useDispatch<AppDispatch>();
 

  const {
    groups,
    loading: groupsLoading,
    error: groupsError,
  } = useSelector((state: RootState) => state.groups);

  // Fetch groups when component mounts
  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  return (
    <>
       <Grid container >
       <Grid sx={{ mt: 2 }} size={{ xs: 12, sm: 8, md: 6 }} >
         <Typography
                      component="h1"
                      variant="h3"
                      sx={{
                        color: "primary.dark",
                        align: "left",
                        mb: 2,
                        fontSize: "clamp(2rem, 10vw, 2.15rem)",
                      }}
                      gutterBottom
                    >
                      Groups
                    </Typography>
       
      {groupsLoading && <Typography>Loading groups ...</Typography>}

      {groupsError && <Typography style={{ color: "red" }}>{groupsError}</Typography>}

      {!groupsLoading && !groupsError && groups.length == 0 && (
        <Typography> No groups created yet</Typography>
      )}

      {!groupsLoading && !groupsError && groups.length > 0 && (
    <>
          {groups.map((g) => {
            return (
              <Grid key={g.id} sx={{mb: 2}}>
                 <Card  elevation={3}>
                  <CardHeader title={g.groupName}
                 
                  sx={{color: 'primary.light', }}
                  ></CardHeader>
         
                <CardContent sx={{color: 'text.primary'}}>{g.description}</CardContent>

                <Box sx={{ display: "flex", flexDirection: 'row', justifyContent:"space-between", pr:2, pb: 2 , pl: 1}}>
                <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
                <Link to={`/groups/${g.id}`}><Button variant="contained">To group page</Button></Link>
                </Box>
             
                </Card>
              </Grid>
            );
          })}
        </>
      )}
       </Grid>

      <Box>
        <CreateGroup />
      </Box>
      </Grid>
    </>
  );
};
