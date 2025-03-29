import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikHelpers, Form,
  Field, ErrorMessage, } from "formik";
import { object, string } from "yup";
import { optimisticAdd, addComment } from "../store/commentSlice";
import { RootState, AppDispatch } from "../store/store";
import { Button, FormControl, FormLabel, TextField } from "@mui/material";


interface ICommentData {
  content: string;
  eventId: number;
  userId: number;
}

interface CommentProps {
  eventId: number;
}

export const CreateComment: React.FC<CommentProps> = ({ eventId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  if (!user) return null; // Prevent rendering if user is not logged in

  const initialValues: ICommentData = {
    content: "",
    eventId,
    userId: user?.id,
  };

  const commentSchema = object().shape({
    content: string().required("Content is required").min(8),
  });

  const handleSubmit = async (
    values: ICommentData,
    { setSubmitting, resetForm }: FormikHelpers<ICommentData>
  ) => {

    const tempId = Date.now(); // Generate a temporary unique ID
    const tempUserEmail = user.email.split('@')[0]; // temporary author
    //userId: tempUser,
    const newComment = {
      id: tempId, 
      partEmail: tempUserEmail, // Add partEmail
      createdAt: new Date().toISOString(), 
      ...values
    };

    console.log("Crating comment : ", newComment)

    // Optimistic update
    dispatch(optimisticAdd(newComment));
    try {
      await dispatch(addComment(newComment));
      await resetForm();
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <>
      {user && (
        <div>
          {/* <h3>Post a Comment</h3> */}
          <Formik
            initialValues={initialValues}
            validationSchema={commentSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <FormControl > 
                <FormLabel htmlFor="content">Post Comment</FormLabel>
                <Field 
                 as={TextField}
                 id="content" name="content" 
                 fullWidth
                 variant="outlined" 
                 required
                 />
                <ErrorMessage
                  name="content"
                  component="div"
                  style={{ color: "red" }}
                />
                    </FormControl>
                <Button  variant="contained" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};
