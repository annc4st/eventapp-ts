import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { object, string } from "yup";
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from "formik";
import { optimisticAdd, createGroup } from "../store/groupSlice";
import { RootState, AppDispatch } from "../store/store";

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
      <Formik
        initialValues={initialValues}
        validationSchema={groupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="groupName">Name</label>
            <Field
              id="groupName"
              name="groupName"
              placeholder= 'i.e. "Fast Runners" '
            />
            <ErrorMessage name="groupName" 
                component="div" className="error" />
                
            <label htmlFor="description">Description</label>
            <Field
              id="description"
              name="description"
              placeholder="Describe your group"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="error"
            />
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
