import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
  ErrorMessage, 
} from "formik";
import * as Yup from "yup";
import { object, string, number, date, InferType,  } from "yup";
import { createEvent } from "../store/eventSlice";
import { RootState, AppDispatch } from "../store/store";
import { fetchLocations } from "../store/locationSlice";


interface EventData {
  name: string;
  distance?: number;
  ticketPrice?: number;
  date: string;
  locationId: number;
  // userId?: number;
}

export const CreateEvent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {user, loading: userLoading, error : userError} = useSelector((state: RootState) => state.user);
    const { locations, loading: locationsLoading, error: locationsError} = useSelector((state: RootState) => state.locations);

    // console.log("User from Redux:", user); // Debug log

  const initialValues: EventData = {
    name: "",
    distance: 0,
    ticketPrice: 0,
    date: new Date().toISOString().slice(0, 16), // Format as YYYY-MM-DD
    locationId: 1,
    // userId: user?.id
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
      .required("Ticket price is required").positive(),
    locationId: number().required("Location is required"),
  });

  // Fetch events when component mounts
  useEffect(() => {
      dispatch(fetchLocations());
  }, [dispatch]);

//toadd
  // const userId = useSelector((state: RootState) => state.user.user?.id);
  // useEffect(() => {
  //   if (!user) {
  //     console.log("User not found in Redux store.");
  //   } else {
  //     console.log("User found:", user);
  //   }
  // }, [user]);


  const handleSubmit = async (values: EventData,  { setSubmitting, resetForm }: FormikHelpers<EventData>) => {
     
    const parsedValues = {
      ...values,
      distance: Number(values.distance),
      ticketPrice: Number(values.ticketPrice),
      locationId: Number(values.locationId),
    };
    console.log("Submitting parsed values:", parsedValues);
     
      try {
        await dispatch(createEvent(values));
        await resetForm();
        setSubmitting(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
  };


  return (
    <div>
      {/* user ? (*/}
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

      <div>
            <p>
              If you cannot find the location, <Link to={"/create-location"}>Add Location</Link>
            </p>
          </div>
    </div>
  );
};
