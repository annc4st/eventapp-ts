import { Button, Container, Typography } from '@mui/material'
import { Link } from "react-router-dom";


export const NotFoundEventPage = () => {
  return (
    <Container>
    <Typography variant="h2" color="error" sx={{ mt: 4 }}>
      404
    </Typography>
    <Typography variant="h5" sx={{ mb: 4 }}>
      Event not found
    </Typography>
    <Link to={'/events'}>
    <Button variant="contained" color="primary">
      Go to Events
    </Button></Link>
  </Container>
  )
}
