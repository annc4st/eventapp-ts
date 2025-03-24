import { Formik, FormikHelpers, Form, Field, ErrorMessage,} from "formik";
import * as Yup from "yup";
// import { Grid, Paper, Avatar, TextField, Button, Typography } from '@mui/material' // link

import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice";
import { RootState, AppDispatch } from "../store/store";



import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { Link as MuiLink}  from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';


interface UserData {
  email: string;
  password: string;
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));


export const Login = () => {

  const dispatch = useDispatch<AppDispatch>();
  // const {user, loading, error } = useSelector((state: RootState) => state.user);
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
    { setSubmitting, setErrors }: FormikHelpers<UserData>
  ) => {
    try {
      const resultAction = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/events");
    }  else {
      if (resultAction.payload) {
        setErrors({ email: resultAction.payload as string });
      } else {
        setErrors({ email: "Login failed. Please try again." });
      }
    }
    
    } catch (error) {
      console.log("Login failed:", error);
    } finally {
      setSubmitting(false); // Stop the loading state
    }
  };

  return (
    <>
     <SignInContainer direction="column" justifyContent="space-between">
      <Formik
        initialValues={initialValues}
        onSubmit={handleLogin}
        validationSchema={validationSchema}
      >
        {(props ) => (
          <Form>
             <Stack spacing={2} direction="column">
            <Field
              label="email"
              name="email"
              placeholder="Enter email"
              required
              helperText={<ErrorMessage name="email" />}
            />
              <ErrorMessage name="email" component="div" />
            <Field
              label="password"
              name="password"
              placeholder="Enter password"
              type="password"
              required
              helperText={<ErrorMessage name="password" />}
            />       
            <ErrorMessage name="password" component="div" />
            <Button variant="contained" type="submit"  disabled={props.isSubmitting}>
              {props.isSubmitting ? "Loading" : "Sign in"}
            </Button>
            </Stack>
          </Form>
        )}
      </Formik>
      </SignInContainer>
    </>
  );
};
