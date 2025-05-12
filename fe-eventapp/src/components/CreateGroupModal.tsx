import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { object, string } from "yup";
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from "formik";
import { optimisticAdd, createGroup } from "../store/groupSlice";
import { RootState, AppDispatch } from "../store/store";
import {
  Box, Button, DialogActions,
  TextField, Dialog, DialogContent, DialogContentText, DialogTitle,
  Slide
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { color } from "framer-motion";


interface IGroupData {
  groupName: string;
  description: string;
  adminId: number;
}

//  Slide transition
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function CreateGroupModal() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.user);
  if (!user) return null; // Prevent rendering if user is not logged in

  //   add user to init values
  const initialValues: IGroupData = {
    groupName: "",
    description: "",
    adminId: user?.id,
  };

  const groupSchema = object().shape({
    groupName: string().min(8).required("Name for the group is required"),
    description: string().min(20, "Description should be at least 20 characters").required("Description is required"),
  });

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (
    values: IGroupData,
    { setSubmitting, resetForm }: FormikHelpers<IGroupData>
  ) => {
    const tempId = Date.now();
    const newGroup = {
      id: tempId,
      createdAt: new Date().toISOString(),
      ...values,
    };
    console.log("creating new group", newGroup);

    // optimistic update
    dispatch(optimisticAdd(newGroup));

    try {
      await dispatch(
        createGroup({ ...values, createdAt: new Date().toISOString() })
      );
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
        Add New Group
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        slots={{ transition: Transition }}
      >
        <DialogTitle>Creating New Group</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={groupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <DialogContent>
                <DialogContentText gutterBottom>
                  To add new group please enter name and description.
                </DialogContentText>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Field as={TextField}
                    margin="dense"
                    id="groupName"
                    name="groupName"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                  />
                  <ErrorMessage name="groupName"
                    component="div" 
                    style={{ color: '#f0aa32' }} />

                  <Field as={TextField}
                    margin="dense"
                    id="description"
                    name="description"
                    label="Description"
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                  />
                  <ErrorMessage name="description"
                    component="div"  style={{ color: '#f0aa32' }} />
                </Box>

              </DialogContent>

              <DialogActions sx={{pr:2}}>
                <Button onClick={handleClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button

                  type="submit"
                  disabled={isSubmitting}
                >
                  {" "}
                  {isSubmitting ? "Submitting..." : "Add Group"}
                </Button>
              </DialogActions>

            </Form>
          )}

        </Formik>
      </Dialog>
    </>
  );
}
