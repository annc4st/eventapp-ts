import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../store/groupSlice";
import { RootState, AppDispatch } from "../store/store";
import { CreateGroup } from "./CreateGroup";
import { Link } from "react-router-dom";
import { Box, Container, Typography, Button, Card, CardContent, CardHeader } from "@mui/material";
import Grid from "@mui/material/Grid2";



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
    <Container>
       <Grid container spacing={5}>
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
                  sx={{color: 'primary.main'}}
                  ></CardHeader>
                {/* <Typography variant="h3">{g.groupName}</Typography> */}
                <CardContent sx={{color: 'secondary.main'}}>{g.description}</CardContent>
                <Box sx={{ display: "flex", flexDirection: 'row-reverse', p: 2 }}>
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
    </Container>
  );
};
