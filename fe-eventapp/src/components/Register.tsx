import { Formik, FormikHelpers, Form, Field, ErrorMessage,} from "formik";
import * as Yup from "yup";
import { Button } from "@radix-ui/themes";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from '../store/userSlice';
import { RootState, AppDispatch } from '../store/store';
import { useNavigate, Link } from "react-router-dom";


interface UserData {
  email: string;
  password: string;
}

export const Register = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    const initialValues: UserData = {
      email: "",
      password: "",
    };

    const validationSchema = Yup.object().shape({
      email: Yup.string().email("Please enter valid email").required("Required"),
      password: Yup.string().required("Required"),

    });
    
    const handleRegister= async (values: UserData,
      { setSubmitting }: FormikHelpers<UserData>
    ) => {
      try {
          await dispatch(registerUser(values));
          navigate("/events");
      } catch (error){
        console.log("Registration failed:", error);
    } finally {
      setSubmitting(false);
    }
      };

        return (
          <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleRegister}
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
              {props.isSubmitting ? "Loading" : "Sign Up"}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );  
}
 