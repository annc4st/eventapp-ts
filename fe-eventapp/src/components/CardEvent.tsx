import React from 'react'
import {
  Box, CardHeader, Card, Avatar,
  CardContent, Typography, Button,
  Tooltip
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import { Event} from "../types"; 

interface CardEventProps {
  event: Event;
}


export const CardEvent: React.FC<CardEventProps> = ({ event }) => {
  return (
    <Card elevation={3}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: 'primary.light' }}
            aria-label="category"
          > {event.distance ? event.distance : '?'}
          </Avatar>
        }

        title={
          <Tooltip title={event.name}>
            <span>{event.name}</span>
          </Tooltip>
        }

        slotProps={{
          title: {
            sx: {
              color: 'primary.main',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            }
          }
        }}
        subheader={new Date(event.date).toLocaleDateString()}
      ></CardHeader>

      <CardContent >
        {location ? (
          <Box sx={{ alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "text.primary" }} >
              <LocationOnIcon sx={{ color: "secondary.main" }} />
              {`${event.location.firstLine}, `}
            </Typography>
            <Typography sx={{ color: "text.primary" }}
            > {`${event.location.city}, ${event.location.postcode}`}
            </Typography>
          </Box>
        ) : (
          <Typography>Location to be determined</Typography>
        )}
      </CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
        <Link to={`/events/${event.id}`}>
          <Button size="medium">Go to Event</Button>
        </Link>
        <FavoriteIcon sx={{ marginRight: 2 }} />
      </Box>
    </Card>
  )
}

export default CardEvent