import React from 'react'
import {  Box,  Paper, Container,
    styled, CardHeader, Card, Avatar,
    CardContent, Typography, Button, 
    Tooltip} from "@mui/material";
    import LocationOnIcon from "@mui/icons-material/LocationOn";
    import FavoriteIcon from "@mui/icons-material/Favorite";
    import { Link } from "react-router-dom";

    interface Event {
        id: number,
        name: string,
        distance: number,
        date: string,
        locationId: number,
    }

    interface Location {
      id: number;
      firstLine: string;
      city: string;
      postcode: string;
    }

    interface CardEventProps {
      event: Event;
      location?: Location;  
    }
  

export const CardEvent: React.FC<CardEventProps> = ({event, location}) => {
  return (
    <Card  elevation={3} 
    // style={{minHeight: '200px'}} 
   > 
     <CardHeader
       avatar={
         <Avatar
           sx={{ bgcolor: 'primary.light' }}
           aria-label="category"
         > {`${event.distance}`}
         </Avatar>
       }
          
      //  title={event.name}
      title={
        <Tooltip title={event.name}>
          <span>{event.name}</span>
        </Tooltip>
      }
       
   
       slotProps = {{
        title: {
          sx: {
            color: 'primary.main',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%', // Optional: you can also set a specific width like '200px'
          }

        }
       }}
       subheader={ new Date(event.date).toLocaleDateString()}
     ></CardHeader>

     <CardContent >
       {location ? (
         <Box sx={{alignItems: "center" }}>
         <Typography variant="body2" sx={{ color: "text.primary" }} >
           <LocationOnIcon sx={{color: "secondary.main"}}/>
           {`${location.firstLine}, `}
         </Typography>
         <Typography sx={{color: "text.primary"}}
         > {`${location.city}, ${location.postcode}`}
         </Typography>
         </Box>
       ) : (
         <Typography>Loading location details...</Typography>
       )}
     </CardContent>
      {/* Flex container for button and icon */}
       <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
         <Link to={`/events/${event.id}`}>
           <Button size="medium">Go to Event</Button>
         </Link>
         <FavoriteIcon sx={{marginRight:2}}/>
     </Box>
   </Card>
  )
}

export default CardEvent