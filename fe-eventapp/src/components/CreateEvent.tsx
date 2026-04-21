import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Formik,
  FormikHelpers,
  Field,
  ErrorMessage,
} from "formik";
import { object, string, number } from "yup";
import { RootState } from "../store/store";
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
import { useLocations } from "../hooks/useLocations";
import { CreateEventDto } from "../types";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEventService } from "../services/eventService";


export const CreateEvent: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);

  const queryClient = useQueryClient();

  const createEventMutation = useMutation({
    mutationFn: createEventService, // API function
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] }); // Invalidate events query to refetch updated list
    },
  });

  const navigate = useNavigate();
  if (!user) navigate("/login"); 
  const initialValues: CreateEventDto = {
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
      .required("Ticket price is required"),

    locationId: number().required("Location is required"),
  });


  const {
    data: locations = [],
    isLoading: locationsLoading,
    error: locationsError
  } = useLocations();

  const handleSubmit = async (
    values: CreateEventDto,
    { setSubmitting }: FormikHelpers<CreateEventDto>
  ) => {
    const parsedValues = {
      ...values,
      distance: Number(values.distance),
      ticketPrice: Number(values.ticketPrice),
      locationId: Number(values.locationId),
    };
    console.log("Submitting parsed values:", parsedValues);

    try {
      await createEventMutation.mutateAsync(parsedValues);
      navigate("/events");
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  if (locationsLoading)
    return <Typography color="text.secondary">Loading locations...</Typography>;
  
  if (locationsError) return <Typography color="error">{locationsError.message}</Typography>;
  if (locations.length === 0) return <Typography>No locations available.</Typography>;


  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
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
              <ErrorMessage name="name">
                {(msg) => (
                  <Typography color="error" variant="body2">
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>
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
              <ErrorMessage name="distance">
                {(msg) => (
                  <Typography color="error" variant="body2">
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>
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
              <ErrorMessage name="date">
                {(msg) => (
                  <Typography color="error" variant="body2">
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>

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
                name="ticketPrice">
                {(msg) => (
                  <Typography color="error" variant="body2">
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>

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
                name="locationId">
                {(msg) => (
                  <Typography color="error" variant="body2">
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>

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
        sx={{
          display: "flex", flexDirection: "column",
          alignItems: "center",
          width: "100%", maxWidth: { md: "50%" },
          gap: 2,
          mt: 2
        }}
      >
        <Typography>
          If you cannot find the location{" "}
        </Typography>

        <CreateLocationModal />
      </Box>
    </Container>
  );
};
