import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { object, string } from "yup";
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from "formik";
import { optimisticAdd, createGroup } from "../store/groupSlice";
import { RootState, AppDispatch } from "../store/store";
import { Button, FormControl, TextField,
  Typography } from "@mui/material";


interface IGroupData {
  groupName: string;
  description: string;
  adminId: number;
}

export const CreateGroup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  if (!user) return null; // Prevent rendering if user is not logged in

  //   add user

  const initialValues: IGroupData = {
    groupName: "",
    description: "",
    adminId: user?.id,
  };

  const groupSchema = object().shape({
    groupName: string().min(8).required("GroupName is required"),
    description: string().min(20).required("Description is required"),
  });

  const handleSubmit = async (
    values: IGroupData,
    { setSubmitting, resetForm }: FormikHelpers<IGroupData>
  ) => {
    const tempId = Date.now(); // Generate a temporary unique ID
    const newGroup = {
      id: tempId,
      createdAt: new Date().toISOString(),
      ...values,
    };
    console.log("creating new group", newGroup);

    // Optimistic update
    dispatch(optimisticAdd(newGroup));

    // create group in backend
    try {
      await dispatch(
        createGroup({ ...values, createdAt: new Date().toISOString() })
      );
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
              sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2rem)", color:'primary.dark' }}
            >Add New Group</Typography>
     
      <Formik
        initialValues={initialValues}
        validationSchema={groupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form style={{display:'flex', flexDirection: "column", 
            marginTop: "16px", gap: "16px"}} >
            {/* <label htmlFor="groupName">Name</label> */}
            
            
            <FormControl>
            <Field as={TextField}
            label="groupName"
              id="groupName"
              name="groupName"
              type="text"
                          fullWidth
                          variant="outlined"
                          required
            />
            <ErrorMessage 
            name="groupName" 
                component="div" className="error" />
                </FormControl>
                
            {/* <label htmlFor="description">Description</label> */}
            <Field as={TextField}
            label="description"
              id="description"
              name="description"
              type="text"
              fullWidth
              variant="outlined"
              required
            />
            <ErrorMessage
              name="description"
              component="div"
              className="error"
            />
            <Button variant="contained"  type="submit" disabled={isSubmitting}>
              {" "}
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};
