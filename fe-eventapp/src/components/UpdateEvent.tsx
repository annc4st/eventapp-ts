import React, { useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from "formik";
import { object, string, number } from "yup";
import { RootState, AppDispatch } from "../store/store";
import { fetchLocations } from "../store/locationSlice";
import { fetchSingleEvent, updateSingleEvent } from "../store/singleEventSlice";

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
  const { user, token } = useSelector((state: RootState) => state.user);
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
  const navigate = useNavigate();

  //handle undefined
  if (!id) {
    throw new Error("Event ID is missing");
  }
  const eventId = parseInt(id, 10);

  // Fetch events when component mounts
  useEffect(() => {
    dispatch(fetchSingleEvent(eventId));
  }, [dispatch, eventId]);

  if (singleEvent?.userId !== user?.id) {
    return <div>You are not authorized to edit this event.</div>;
  }

  // Extract YYYY-MM-DDTHH:mm
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
      ),
    ticketPrice: number()
      .min(0, "Ticket price must be a positive number")
      .required("Ticket price is required")
      .positive(),
    locationId: number().required("Location is required"),
  });

  // Fetch events when component mounts
  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

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
    console.log("Submitting parsed values:", parsedValues);

    const updatedEvent = { ...parsedValues, id: eventId };

    try {
      await dispatch(updateSingleEvent(updatedEvent));
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
    <div>
      <h3> Update event</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={eventSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="name">Update Event Name</label>
            <Field id="name" name="name" placeholder="Event name" />
            <ErrorMessage name="name" component="div" className="error" />
            <label htmlFor="distance">Update Distance</label>
            <Field
              type="number"
              id="distance"
              name="distance"
              placeholder="Distance"
            />
            <ErrorMessage name="distance" component="div" className="error" />

            <label htmlFor="date">Update Date</label>
            <Field
              type="datetime-local"
              id="date"
              name="date"
              placeholder="date"
            />
            <ErrorMessage name="date" component="div" className="error" />

            <label htmlFor="ticketPrice">Update TicketPrice</label>
            <Field
              type="number"
              id="ticketPrice"
              name="ticketPrice"
              placeholder="ticketPrice"
            />
            <ErrorMessage
              name="ticketPrice"
              component="div"
              className="error"
            />

            <label htmlFor="locationId">Update location</label>
            <Field
              type="number"
              as="select"
              id="locationId"
              name="locationId"
              placeholder="Location"
            >
              <option value="" label="Select Location" />
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {`${location.firstLine}, ${location.city} ${location.postcode}`}
                </option>
              ))}
            </Field>
            <ErrorMessage name="locationId" component="div" className="error" />

            <button type="submit" disabled={isSubmitting || locationsLoading}>
              {" "}
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </Form>
        )}
      </Formik>

      <div>
        <p>
          If you cannot find the location,{" "}
          <Link to={"/create-location"}>Add Location</Link>
        </p>
      </div>
    </div>
  );
};
