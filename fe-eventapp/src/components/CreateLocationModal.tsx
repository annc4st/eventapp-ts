import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { object, string } from "yup";
import { postcodeValidator } from "postcode-validator";
import { optimisticAdd, createLocation } from "../store/locationSlice";
import { AppDispatch } from "../store/store";

import { Box, Button, DialogActions, TextField, Dialog, DialogContent, DialogContentText, 
  DialogTitle, Fade,  Slide} from '@mui/material'
  import { TransitionProps } from '@mui/material/transitions';
 
 

interface ILocationData {
  firstLine: string;
  city: string;
  postcode: string;
}
/* forwardRef is a React utility that lets you pass a ref through your component to a child.
 Required by MUI because animations like Slide and Fade need 
 access to refs for proper DOM transitions.
*/
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function CreateLocationModal() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

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

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

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
      <Button variant="outlined" onClick={handleClickOpen}>
        Add New Location
      </Button>
      {/* <Slide direction="down" in={open} mountOnEnter unmountOnExit> */}
      
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm"
       TransitionComponent={Transition}
       >
        <DialogTitle>Add New Meeting Point</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={locationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <DialogContent>
                <DialogContentText>
                  To add new location please enter Address and Postcode
                  correctly.
                </DialogContentText>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Field
                    as={TextField}
                    // autoFocus
                    required
                    margin="dense"
                    id="firstLine"
                    name="firstLine"
                    label="First Line of Address"
                    type="text"
                    fullWidth
                  variant="outlined"
                  />
                  <ErrorMessage
                    name="firstLine"
                    component="div"
                    style={{ color: "red" }}
                  />
                  <Field
                    as={TextField}
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
                  <Field
                    as={TextField}
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
                </Box>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  onClick={handleClose}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {" "}
                  {isSubmitting ? "Submitting..." : "Add Location"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
     
    </>
  );
}
