import { Button, Container, Typography } from '@mui/material'
import { Link } from "react-router-dom";


export const NotFoundGroupPage = () => {
  return (
    <Container>
    <Typography variant="h2" color="error" sx={{ mt: 4 }}>
      404
    </Typography>
    <Typography variant="h5" sx={{ mb: 4 }}>
      Group not found
    </Typography>
    <Link to={'/groups'}>
    <Button variant="contained" color="primary">
      Go to Groups
    </Button></Link>
  </Container>
  )
}
