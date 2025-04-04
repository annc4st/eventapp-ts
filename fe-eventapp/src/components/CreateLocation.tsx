import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikHelpers, Form,
  Field, ErrorMessage}  from "formik";
import * as Yup from "yup";
import { object, string } from "yup";
import { postcodeValidator } from "postcode-validator";
import { optimisticAdd, createLocation } from "../store/locationSlice";
import { AppDispatch } from "../store/store";

import { Box, Button, Container, FormControl, InputAdornment, TextField,
  Typography } from "@mui/material";



interface ILocationData {
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


  const initialValues: ILocationData = {
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
    values: ILocationData,
    { setSubmitting, resetForm }: FormikHelpers<ILocationData>
  ) => {
    const tempId = Date.now(); // Generate a temporary unique ID
    const newLocation = { id: tempId, ...values };

    // Optimistic update
    dispatch(optimisticAdd(newLocation));
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
       <Typography
              component="h2"
              variant="h3"
              sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2rem)", mt: 2, color:'primary.dark' }}
            >Add New Location</Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={locationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form style={{display:'flex', flexDirection: "column", 
          marginTop: "16px", gap: "16px"}}> 

          <FormControl>
                        <Field as={TextField}
                          label="First Line of Address"
                          id="firstLine"
                          name="firstLine"
                          type="text"
                          fullWidth
                          variant="outlined"
                          required
                        />
                        <ErrorMessage
                          name="firstLine"
                          component="div"
                          style={{ color: "red" }}
                        />
                      </FormControl>
             <FormControl>
                        <Field as={TextField}
                          label="City"
                          id="city"
                          name="city"
                          type="text"
                          fullWidth
                          variant="outlined"
                          required
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          style={{ color: "red" }}
                        />
                      </FormControl>
             <FormControl>
                        <Field as={TextField}
                          label="Postcode"
                          id="postcode"
                          name="postcode"
                          type="text"
                          fullWidth
                          variant="outlined"
                          required
                        />
                        <ErrorMessage
                          name="postcode"
                          component="div"
                          style={{ color: "red" }}
                        />
                      </FormControl>

            <Button  variant="contained" type="submit" disabled={isSubmitting}>
              {" "}
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};
