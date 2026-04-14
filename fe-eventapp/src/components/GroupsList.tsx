import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../store/groupSlice";
import { RootState, AppDispatch } from "../store/store";
import { CreateGroup } from "./CreateGroup";
import CreateGroupModal from "./CreateGroupModal";
import { Link } from "react-router-dom";
import { Box, Container, Grid, Typography, Button, Card, CardContent, CardHeader, IconButton } from "@mui/material";
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

          {/* Modal only for small screens */}
          <Grid sx={{ display: { md: "none" } }}>
            <CreateGroupModal />
          </Grid>


          {groupsLoading && <Typography>Loading groups ...</Typography>}

          {groupsError && <Typography style={{ color: "red" }}>{groupsError}</Typography>}

          {!groupsLoading && !groupsError && groups.length == 0 && (
            <Typography> No groups created yet</Typography>
          )}

          {!groupsLoading && !groupsError && groups.length > 0 && (
            <>
              {groups.map((g) => {
                return (
                  <Box key={g.id} sx={{ mb: 2, mt: 2 }}>
                    <Card elevation={3}>
                      <CardHeader title={g.groupName}

                        sx={{ color: 'primary.light', }}
                      ></CardHeader>

                      <CardContent sx={{ color: 'text.primary' }}>{g.description}</CardContent>

                      <Box sx={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", pr: 2, pb: 2, pl: 1 }}>
                        <IconButton aria-label="share">
                          <ShareIcon />
                        </IconButton>
                        <Link to={`/groups/${g.id}`}><Button variant="contained">To group page</Button></Link>
                      </Box>

                    </Card>
                  </Box>
                );
              })}
            </>
          )}
        </Grid>
        <Grid sx={{
          display: { xs: "none", md: "flex", flexDirection: "column" },
          mt: 2
        }}
          size={{ md: 6 }}
        >
          <Box>
            <CreateGroup />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
