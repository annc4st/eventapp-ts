import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Formik, FormikHelpers, Form,
  Field, ErrorMessage,
} from "formik";
import * as Yup from "yup";
import { object, string } from "yup";
import { postcodeValidator } from "postcode-validator";
import { optimisticAdd, createLocation } from "../store/locationSlice";
import { AppDispatch } from "../store/store";


interface LocationData {
  firstLine: string;
  city: string;
  postcode: string;
}

export const CreateLocation: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // add user usage later
  // const {
  //   user,
  //   loading: userLoading,
  //   error: userError,
  // } = useSelector((state: RootState) => state.user);


  const initialValues: LocationData = {
    firstLine: "",
    city: "",
    postcode: "",
  };

  const locationSchema = object().shape({
    firstLine: string().required("First line of address is required"),
    city: string().required("City is required"),
    postcode: string()
      .required("Postcode is required")
      .test("is-valid-postcode", "Invalid postcode format", (value) => {
        // If no value, skip validation
        if (!value) return false;
        // Validate the postcode
        return postcodeValidator(value, "GB");
      }),
  });

  const handleSubmit = async (
    values: LocationData,
    { setSubmitting, resetForm }: FormikHelpers<LocationData>
  ) => {
    const tempId = Date.now(); // Generate a temporary unique ID
    const newLocation = { id: tempId, ...values };

    // Optimistic update
    dispatch(optimisticAdd(newLocation));
    // create location in backend
    try {
      await dispatch(createLocation(values));
      await resetForm();
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <>
      <h3> Create new location</h3>

      <Formik
        initialValues={initialValues}
        validationSchema={locationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="firstLine">First Line of Address</label>
            <Field
              id="firstLine"
              name="firstLine"
              placeholder="1, King street"
            />
            <ErrorMessage name="firstLine" component="div" className="error" />

            <label htmlFor="city">City or Town</label>
            <Field id="city" name="city" placeholder="City" />
            <ErrorMessage name="city" component="div" className="error" />

            <label htmlFor="postcode">Postcode</label>
            <Field id="postcode" name="postcode" placeholder="SW1A 1AA" />
            <ErrorMessage name="postcode" component="div" className="error" />

            <button type="submit" disabled={isSubmitting}>
              {" "}
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};
