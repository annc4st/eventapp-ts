import {
  Formik, FormikHelpers, Form,
  Field, ErrorMessage
} from "formik";
import {
  Button, FormControl, TextField,
  Typography
} from "@mui/material";

import { createLocationSchema } from "../../schemas/createLocationSchema";
import { EventLocation, CreateLocationDto } from "../../types";



type Props = {
  onSubmit: (values: CreateLocationDto,
        formikHelpers: FormikHelpers<CreateLocationDto>
  ) => Promise<void>;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  locations: EventLocation[];
};

export const CreateLocationForm: React.FC<Props> = ({
  onSubmit,
  isPending,
  isSuccess,
  isError,
  error,
  locations,
}) => {
  const schema = createLocationSchema(locations, isPending);

    const initialValues: CreateLocationDto = {
    firstLine: "",
    city: "",
    postcode: "",
  };



  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
      validateOnMount
    >
      {({ isSubmitting, isValid, dirty, errors }) => (
          <Form style={{
            display: 'flex', flexDirection: "column",
            marginTop: "16px", gap: "16px"
          }}>
          {isSuccess && !dirty && <Typography>Submitted Successfully</Typography>}

          <FormControl>
              <Field as={TextField}
                label="First Line of Address"
                id="firstLine"
                name="firstLine"
                type="text"
                fullWidth
                variant="outlined"
                required
              />
              <ErrorMessage
                name="firstLine">
                {(msg) => (
                  <Typography color="error" variant="body2">
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>
            </FormControl>
            <FormControl>
              <Field as={TextField}
                label="City"
                id="city"
                name="city"
                type="text"
                fullWidth
                variant="outlined"
                required
              />
              <ErrorMessage
                name="city"
              >
                {(msg) => (
                  <Typography color="error" variant="body2">
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>
            </FormControl>
            <FormControl>
              <Field as={TextField}
                label="Postcode"
                id="postcode"
                name="postcode"
                type="text"
                fullWidth
                variant="outlined"
                required

              />
              <ErrorMessage
                name="postcode">
                {(msg) => (
                  <Typography color="error" variant="body2">
                    {msg}
                  </Typography>
                )}
              </ErrorMessage>
            </FormControl>
            <Button variant="contained"
              type="submit"
              disabled={isSubmitting || isPending || !isValid || !dirty}
            >
              {" "}
              {isPending ? "Submitting..." : "Submit"}

            </Button>
            {/* server error */}
            {isError && (
              <Typography color="error">
                {error
                  ? error.message
                  : "Failed to create location"}
              </Typography>
            )}

            {errors.postcode && dirty && (
              <Typography color="error" variant="body2">
                {errors.postcode}
              </Typography>
            )}
        </Form>
      )}
    </Formik>
  );
};