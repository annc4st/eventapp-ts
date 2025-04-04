import React, { useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from "formik";
import { object, string, number } from "yup";
import { RootState, AppDispatch } from "../store/store";
import { fetchLocations } from "../store/locationSlice";
import { fetchSingleEvent, updateSingleEvent } from "../store/singleEventSlice";
import { 
  Box,
  Button,
  Container,
  FormControl,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";



interface EventData {
  id: number;
  name: string;
  distance?: number;
  ticketPrice?: number;
  date: string;
  locationId: number;
  userId?: number;
}

export const UpdateEvent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useSelector((state: RootState) => state.locations);
  const {
    singleEvent,
    loading: singleEventLoading,
    error: singleEventError,
  } = useSelector((state: RootState) => state.singleEvent);
  const { id } = useParams<{ id?: string }>();


  if (!id) throw new Error("Event ID is missing");
  const eventId = parseInt(id, 10);

  useEffect(() => {
    dispatch(fetchSingleEvent(eventId));
    dispatch(fetchLocations());
  }, [dispatch, eventId]);

  if (singleEvent?.userId !== user?.id) {
    return <div>You are not authorized to edit this event.</div>;
  }

  // Extract YYYY-MM-DDTHH:mm // Format date for datetime-local input
  const formattedDate = singleEvent?.date
    ? new Date(singleEvent.date).toISOString().slice(0, 16)
    : "";

  const initialValues: EventData = {
    id: singleEvent?.id ?? eventId,
    name: singleEvent?.name || "",
    distance: singleEvent?.distance || 0,
    ticketPrice: singleEvent?.ticketPrice || 0,
    date: formattedDate,
    locationId: singleEvent?.locationId || 0,
  };


  const eventSchema = object().shape({
    name: string().required("Event name is required"),
    distance: number().required("Distance is required").positive(),
    date: string()
      .required("Start date is required")
      .test(
        "valid-date",
        "Please provide a valid date and time",
        (value) => !isNaN(new Date(value || "").getTime())
      )
      .test(
        "not-past-date",
        "Event date cannot be in the past",
        (value) => {
          const selectedDate = new Date(value);
          const currentDate = new Date();
          // Set time of the current date to 00:00:00 to only compare the date (not the time)
          currentDate.setHours(0, 0, 0, 0);
          return selectedDate >= currentDate; // Ensure the selected date is not in the past
        }
      ),
    ticketPrice: number()
      .min(0, "Ticket price must be a positive number")
      .required("Ticket price is required")
      .positive(),
    locationId: number().required("Location is required"),
  });


  const handleSubmit = async (
    values: EventData,
    { setSubmitting }: FormikHelpers<EventData>
  ) => {
    const parsedValues = {
      ...values,
      distance: Number(values.distance),
      ticketPrice: Number(values.ticketPrice),
      locationId: Number(values.locationId),
    };
    // console.log("Submitting parsed values:", parsedValues);
    const updatedEvent = { ...parsedValues, id: eventId };
    
    try {
      const response = await dispatch(updateSingleEvent(updatedEvent));
      console.log("User after submitting ",  user )
      console.log(response.payload)
      navigate(`/events/${id}`);
      setSubmitting(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Combine loading states and errors
  const loading = singleEventLoading || locationsLoading;
  const error = singleEventError || locationsError;
  if (loading || !singleEvent) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="lg" >
      <Typography
        component="h1"
        variant="h3"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)", mt: 2, color:'primary.dark' }}
      >  Update event
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={eventSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
        <Box 
          component="form" onSubmit={handleSubmit}
         sx={{display:'flex', flexDirection: "column", gap: 3, mt: 2, mb: 2,
        width: "100%", 
        maxWidth: { md: "50%" }, 
      }} >
            <FormControl>
              <Field as={TextField}
                label="Name"
                id="name"
                name="name"
                type="text"
                fullWidth
                variant="outlined"
                required
              />
              <ErrorMessage
                name="name"
                component="div"
                style={{ color: "red" }}
              />
            </FormControl>

            <FormControl>
              <Field as={TextField}
                label="Distance"
                type="number"
                name="distance"
                id="distance"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">km</InputAdornment>
                    ),
                  },
                }}
                variant="outlined"
                required
              />
              <ErrorMessage
                name="distance"
                component="div"
                style={{ color: "red" }}
              />
            </FormControl>
            <FormControl>
              <Field
                as={TextField}
                label="Date"
                type="datetime-local"
                id="date"
                name="date"
                fullWidth
                variant="outlined"
                required
              />
              <ErrorMessage
                name="date"
                component="div"
                style={{ color: "red" }}
              />
            </FormControl>
            <FormControl>
              <Field
                as={TextField}
                label="Ticket Price"
                id="ticketPrice"
                name="ticketPrice"
                type="number"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">£</InputAdornment>
                    ),
                  },
                }}
                // fullWidth
                variant="outlined"
                required
              />
              <ErrorMessage
                name="ticketPrice"
                component="div"
                style={{ color: "red" }}
              />
            </FormControl>
            <FormControl>
              <Field as={TextField}
                label="Select Location"
                select
                id="locationId"
                name="locationId"
                fullWidth
                variant="outlined"
                slotProps={{
                  select: {
                    native: true,
                  },
                }}
              >
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {`${location.firstLine}, ${location.city} ${location.postcode}`}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="locationId"
                component="div"
                style={{ color: "red" }}
              />
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || locationsLoading}
            >
              {" "}
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
   
          </Box>
        )}
      </Formik>

      <Box>
        <Typography>
          If you cannot find the location,{" "}
          <Link to={"/create-location"} style={{textDecoration: 'none', color:'#3698ad'}}>Add Location</Link>
        </Typography>
      </Box>
    </Container>
  );
};
