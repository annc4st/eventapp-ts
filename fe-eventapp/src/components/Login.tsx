import { Formik, FormikHelpers, Form, Field, ErrorMessage,} from "formik";
import * as Yup from "yup";
import { Paper, Avatar, Box, TextField, Card, Stack, Button, Typography, Container, FormControl, FormLabel} from '@mui/material' // link

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice";
import { RootState, AppDispatch } from "../store/store";
 
import { Link as MuiLink}  from '@mui/material';
import { styled } from '@mui/material/styles';



interface UserData {
  email: string;
  password: string;
}

const MyCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto', // places in the center vertically
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
 
}));

const MyStack = styled(Stack)(({theme}) => ({
 height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
 minHeight: '100%',
 padding: 2,

 '&::before': {
content: '""',  // Creates an empty element
display: 'block', // Makes it visible (default is inline)
position: 'absolute',  // Positions it relative to SignInContainer
zIndex: -1,  // Sends it behind the main content
inset: 0,  // Stretches it to fill the parent container
 
},
} ))
 

export const Login = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const initialValues: UserData = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Please enter a valid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleLogin = async (
    values: UserData,
    { setSubmitting, setErrors }: FormikHelpers<UserData>
  ) => {
    try {
      const resultAction = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(resultAction)) {
      // navigate("/events");
      navigate(-1); // go back to the previous page
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
     <MyStack direction="column" justifyContent="space-between" >
     <MyCard variant="outlined">

     <Typography
            component="h1"
            variant="h3"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          
 {/* Formik Form */}
      <Formik
        initialValues={initialValues}
        onSubmit={handleLogin}
        validationSchema={validationSchema}
      >
        {(props ) => (
             <Form style={{ display: "flex", flexDirection: "column", gap: 16 }}> 

     {/* Email Field */}      
     <FormControl > 
     <FormLabel htmlFor="email">Email</FormLabel>
            <Field
            as={TextField}
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            fullWidth
            variant="outlined" 
            required
            />
              <ErrorMessage name="email" component="div" style={{ color: "red" }}/>
              </FormControl>

{/* Password Field */}
      <FormControl>
      <FormLabel htmlFor="password">Password</FormLabel>
                <Field
                  as={TextField}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••"
                  fullWidth
                  variant="outlined"             
                />
                <ErrorMessage name="password" component="div" style={{ color: "red" }} />
              </FormControl>
   {/* Submit Button */}
            <Button variant="contained" type="submit" 
            fullWidth sx={{ alignSelf: "center", mt: 2 }} disabled={props.isSubmitting}>
              {props.isSubmitting ? "Loading" : "Sign in"}
            </Button>

            <Typography textAlign="center" mt={2}>
          Don't have an account?{" "}
          <MuiLink href="/register" variant="body2">
            Sign up
          </MuiLink>
        </Typography>
          
          </Form>
        )}
      </Formik>
      </MyCard>
      </MyStack>
    </>
  );
};
