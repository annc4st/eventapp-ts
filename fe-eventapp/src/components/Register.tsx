import { Formik, FormikHelpers, Form, Field, ErrorMessage,} from "formik";
import * as Yup from "yup";
 
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from '../store/userSlice';
import { RootState, AppDispatch } from '../store/store';
import { useNavigate, Link } from "react-router-dom";

import { Paper, Avatar, Box, TextField, 
  Card, Stack, Button, Typography, Container, FormControl, FormLabel} from '@mui/material' // link

import { Link as MuiLink}  from '@mui/material';
import { styled } from '@mui/material/styles';


interface UserData {
  email: string;
  password: string;
}

const MyCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center', // places in the center horizontally
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  
  // margin: 'auto',  // places in the center vertically, instead added mt: 2 to the sx props
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


export const Register = () => {

    const dispatch = useDispatch<AppDispatch>();
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
           <MyStack direction="column" justifyContent="space-between" sx={{mt: 4}}>
               <MyCard variant="outlined">
          
               <Typography
                      component="h1"
                      variant="h3"
                      sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                      Register
                    </Typography>
                    
           {/* Formik Form */}
      <Formik
        initialValues={initialValues}
        onSubmit={handleRegister}
        validationSchema={validationSchema}
      >
        {(props) => (
           <Form style={{ display: "flex", flexDirection: "column", gap: 16 }}> 

           {/* Email Field */}    
           <FormControl > 
                <FormLabel htmlFor="email">Email</FormLabel>
            <Field
              as={TextField}
            id="email"
              name="email"
                 type="email"
              placeholder="Enter valid email"
              required
              fullWidth
              variant="outlined" 
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
            <Button variant="contained" type="submit" disabled={props.isSubmitting}>
              {props.isSubmitting ? "Loading" : "Sign Up"}
            </Button>

              <Typography textAlign="center" mt={2}>
                      Already have an account?{" "}
                      <MuiLink href="/login" variant="body2">
                        Sign in
                      </MuiLink>
                    </Typography>
          </Form>
        )}
      </Formik>
      </MyCard>
      </MyStack>
    </>
  );  
}
 