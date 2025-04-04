import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { object, string } from "yup";
import { postcodeValidator } from "postcode-validator";
import { optimisticAdd, createLocation, fetchLocations } from "../store/locationSlice";
import { AppDispatch, RootState} from "../store/store";

import { Box, Button, DialogActions, TextField, Dialog, DialogContent, DialogContentText, 
  DialogTitle, Slide} from '@mui/material'
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
//  Slide transition
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});


export default function CreateLocationModal() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
    const { locations } = useSelector(
      (state: RootState) => state.locations
    );
  


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
      .test(
        "is-valid-postcode", 
        "Invalid postcode format", 
       function (value) {
        if (!value) return false;
         return postcodeValidator(value.trim(), "GB");
      })
      .test(
        "is-duplicate",
        "Location already exists. Cannot add it.",
         function (value) {
          const { firstLine, city } = this.parent;
          if (!firstLine || !city || !value || !Array.isArray(locations)) return true;
          return !locations.some(
            (loc) =>
              loc.firstLine?.toLowerCase().trim() === firstLine.toLowerCase().trim() &&
              loc.city?.toLowerCase().trim() === city.toLowerCase().trim() &&
              loc.postcode?.toLowerCase().replace(/\s/g, "") === value.toLowerCase().replace(/\s/g, "")
          );
        }
      ),
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
      setOpen(false); // <-- only close on success!
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
       slots={{ transition: Transition }}
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
                <DialogContentText gutterBottom>
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
                <Button onClick={handleClose} disabled={isSubmitting }>
                  Cancel
                </Button>
                <Button
                  
                  type="submit"
                  disabled={isSubmitting }
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
