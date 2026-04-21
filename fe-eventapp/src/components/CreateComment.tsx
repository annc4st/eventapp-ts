import { useSelector } from "react-redux";
import { Formik, FormikHelpers, Form,
  Field, ErrorMessage, } from "formik";
import { object, string } from "yup";
import { RootState } from "../store/store";
import { Button, FormControl, FormLabel, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentDto } from "../types";
import { createCommentService } from "../services/commentService";

interface CommentProps {
  eventId: number;
}

export const CreateComment: React.FC<CommentProps> = ({ eventId }) => {
  const { user } = useSelector((state: RootState) => state.user);

  if (!user) return null;
  const queryClient = useQueryClient();
  const createCommentMutation = useMutation({
    mutationFn: createCommentService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] }); 
    },
  });


  const initialValues: CommentDto = {
    content: "",
    eventId,
    userId: user?.id,
  };

  const commentSchema = object().shape({
    content: string().required("Content is required").min(8),
  });

  const handleSubmit = async (
    values: CommentDto,
    { setSubmitting, resetForm }: FormikHelpers<CommentDto>
  ) => {

    const tempId = Date.now();  
    const tempUserEmail = user.email.split('@')[0]; 
 
    const newComment = {
      id: tempId, 
      authorName: tempUserEmail,
      createdAt: new Date().toISOString(), 
      ...values
    };

    console.log("Crating comment : ", newComment)

    try {
      await createCommentMutation.mutateAsync(values);
      await resetForm();
      setSubmitting(false);

    } catch (error) {
      console.error("Error creating comment:", error);
      setSubmitting(false);
    }
  };


  return (
    <>
      {user && (
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={commentSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <FormControl > 
                <FormLabel htmlFor="content">Post Comment</FormLabel>
                <Field 
                 as={TextField}
                 id="content" name="content" 
                 fullWidth
                 variant="outlined" 
                 multiline
                 rows={3}
                 focused
                 color="warning"
                 required
                 />
                <ErrorMessage
                  name="content">
                    {(msg) => (
                  <Typography color="error" variant="body2">
                    {msg}
                  </Typography>
                )}
                 </ErrorMessage>
                    </FormControl>
                <Button  variant="contained" type="submit" 
                disabled={isSubmitting || createCommentMutation.isPending || !isValid || !dirty}
                >
                  {createCommentMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};
