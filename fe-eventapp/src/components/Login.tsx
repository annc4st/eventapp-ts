import { Formik, FormikHelpers, Form, Field, ErrorMessage,} from "formik";
import * as Yup from "yup";
// import { Grid, Paper, Avatar, TextField, Button, Typography } from '@mui/material' // link
import { Button } from "@radix-ui/themes";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice";
import { RootState, AppDispatch } from "../store/store";

interface UserData {
  email: string;
  password: string;
}

export const Login = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const initialValues: UserData = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("please enter valid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleLogin = async (
    values: UserData,
    { setSubmitting }: FormikHelpers<UserData>
  ) => {
    try {
      await dispatch(loginUser(values));
      navigate("/events");
    } catch (error) {
      console.log("Login failed:", error);
    } finally {
      setSubmitting(false); // Stop the loading state
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleLogin}
        validationSchema={validationSchema}
      >
        {(props) => (
          <Form>
            <Field
              label="email"
              name="email"
              placeholder="Enter email"
              required
              helperText={<ErrorMessage name="email" />}
            />
            <Field
              label="password"
              name="password"
              placeholder="Enter password"
              type="password"
              required
              helperText={<ErrorMessage name="password" />}
            />
            <Button type="submit" variant="solid" disabled={props.isSubmitting}>
              {props.isSubmitting ? "Loading" : "Sign in"}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};
