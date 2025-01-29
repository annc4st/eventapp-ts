import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikHelpers, Form,
  Field, ErrorMessage, } from "formik";
import { object, string } from "yup";
import { optimisticAdd, addComment } from "../store/commentSlice";
import { RootState, AppDispatch } from "../store/store";

interface CommentData {
  content: string;
  eventId: number;
  userId: number;
}

export const CreateComment: React.FC = ({ eventId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.user);

  if (!user) return null; // Prevent rendering if user is not logged in

  const initialValues: CommentData = {
    content: "",
    eventId: eventId,
    userId: user.id,
  };

  const commentSchema = object().shape({
    content: string().required("Content is required").min(8),
  });

  const handleSubmit = async (
    values: CommentData,
    { setSubmitting, resetForm }: FormikHelpers<CommentData>
  ) => {

    const tempId = Date.now(); // Generate a temporary unique ID
    const newComment = {id: tempId,  ...values};
    // Optimistic update
    dispatch(optimisticAdd(newComment));
    try {
      await dispatch(addComment(values));
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
          <h3>Post a Comment</h3>
          <Formik
            initialValues={initialValues}
            validationSchema={commentSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field id="content" name="content" />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="error"
                />
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};
