import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  ErrorMessage,
} from "formik";
import { object, string, number } from "yup";
import { createEvent } from "../store/eventSlice";
import { RootState, AppDispatch } from "../store/store";
import { fetchLocations } from "../store/locationSlice";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import CreateLocationModal from "./CreateLocationModal";

interface EventData {
  name: string;
  distance?: number;
  ticketPrice?: number;
  date: string;
  locationId: number;
  userId?: number;
}

export const CreateEvent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useSelector((state: RootState) => state.locations);
  const navigate = useNavigate();

  if (!user) navigate("/login"); // Prevent rendering if user is not logged in

  const initialValues: EventData = {
    name: "",
    distance: 0,
    ticketPrice: 0,
    date: new Date().toISOString().slice(0, 16), // Format as YYYY-MM-DD
    locationId: 1,
    userId: user?.id,
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
      .test("not-past-date", "Event date cannot be in the past", (value) => {
        const selectedDate = new Date(value);
        const currentDate = new Date();
        // Set time of the current date to 00:00:00 to only compare the date (not the time)
        currentDate.setHours(0, 0, 0, 0);
        return selectedDate >= currentDate; // Ensure the selected date is not in the past
      }),
    ticketPrice: number()
      .min(0, "Ticket price must be a positive number")
      .required("Ticket price is required"), // ".positive()," -- removed to allow 0 price
    locationId: number().required("Location is required"),
  });

  // Fetch events when component mounts
  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const handleSubmit = async (
    values: EventData,
    { setSubmitting, resetForm }: FormikHelpers<EventData>
  ) => {
    const parsedValues = {
      ...values,
      distance: Number(values.distance),
      ticketPrice: Number(values.ticketPrice),
      locationId: Number(values.locationId),
    };
    console.log("Submitting parsed values:", parsedValues);

    try {
      await dispatch(createEvent(values));
      // await resetForm();
      navigate("/events");
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography
        component="h1"
        variant="h3"
        sx={{
          width: "100%",
          fontSize: "clamp(2rem, 10vw, 2.15rem)",
          mt: 2,
          color: "primary.dark",
        }}
      >
        {" "}
        Create event
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={eventSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              mt: 2,
              mb: 2,
              width: "100%",
              maxWidth: { md: "50%" },
            }}
          >
            <FormControl>
              <Field
                as={TextField}
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
              <Field
                as={TextField}
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
              <Field
                as={TextField}
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
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        )}
      </Formik>

      <Box  
      sx={{display: "flex", flexDirection: "column", 
        alignItems: "center", 
        width: "100%", maxWidth: { md: "50%" }, 
        gap: 2,
        mt: 2
      }}
      >
        <Typography>
          If you cannot find the location{" "}
          {/* <Link
            to={"/create-location"}
            style={{ textDecoration: "none", color: "#3698ad" }}
          >
            Add Location
          </Link> */}
           
        </Typography>
  
      <CreateLocationModal />
      </Box>
    </Container>
  );
};

// without MUI
/* return (
  <div>
    { user ? (
    <h3> Create new event</h3>
    <Formik
      initialValues={initialValues}
      validationSchema={eventSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
      <Form>
          <label htmlFor="name">Event Name</label>
          <Field id="name" name="name" placeholder="Event name" />
          <ErrorMessage name="name" component="div" className="error" />
          <label htmlFor="distance">Distance</label>
          <Field type="number" id="distance" name="distance" placeholder="Distance" />
          <ErrorMessage name="distance" component="div" className="error" />
          
          <label htmlFor="date">Date</label>
          <Field type="datetime-local" id="date" name="date" placeholder="date" />
          <ErrorMessage name="date" component="div" className="error" />

          <label htmlFor="ticketPrice">TicketPrice</label>
          <Field type="number"  id="ticketPrice" name="ticketPrice" placeholder="ticketPrice" />
          <ErrorMessage name="ticketPrice" component="div" className="error" />

          <label htmlFor="locationId">Choose location</label>
          <Field  type="number" as="select" id="locationId" name="locationId" placeholder="Location" >
          <option value="" label="Select Location" />
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {`${location.firstLine}, ${location.city} ${location.postcode}`}
            </option>
          ))}
          </Field>
          <ErrorMessage name="locationId" component="div" className="error" />

          <button type="submit" disabled={isSubmitting || locationsLoading}> {isSubmitting ? "Submitting..." : "Submit"}</button> 
      </Form>
      )}

    </Formik>
    <div><p>
            If you cannot find the location, <Link to={"/create-location"}>Add Location</Link>
          </p></div>
  </div>
);
};
**/
