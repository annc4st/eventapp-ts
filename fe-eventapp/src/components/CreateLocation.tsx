import { useNavigate, } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Formik, FormikHelpers, Form,
  Field, ErrorMessage
} from "formik";
import { object, string } from "yup";
import { postcodeValidator } from "postcode-validator";
import { RootState } from "../store/store";
import {
  Button, FormControl, TextField,
  Typography
} from "@mui/material";
import { createLocation } from "../services/locationService";
import { useLocations } from "../hooks/useLocations";
import { CreateLocationDto } from "../types";


export const CreateLocation: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();

  const createLocationMutation = useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  const { error: createError } = createLocationMutation; // server/API error

  const { data: locations = [],
    isLoading: locationsLoading,
    error: locationsError 
  } = useLocations();

  const navigate = useNavigate();
  if (!user) {
    navigate("/login");
    return;
    }

  const initialValues: CreateLocationDto = {
    firstLine: "",
    city: "",
    postcode: "",
  };

  const normalizeText = (v: string) =>
    v.trim().toLowerCase();

  const normalizePostcode = (v: string) =>
    v.replace(/\s/g, "").toUpperCase();

  const locationSchema = object({
    firstLine: string().trim().required("First line of address is required"),

    city: string().trim().required("City is required"),

    postcode: string()
      .required("Postcode is required")
      .test("is-valid-postcode", "Invalid postcode format", (value) => {
        if (!value) return true; // let required() handle empty
        return postcodeValidator(value.trim().toUpperCase(), "GB");
      })
      .test(
        "is-duplicate",
        "Location already exists. Cannot add it.",
        function (value) {
          const { firstLine, city } = this.parent;

          if (locationsLoading) return true;
          if (!firstLine || !city || !value) return true;

          const normalizedFirstLine = normalizeText(firstLine);
          const normalizedCity = normalizeText(city);
          const normalizedPostcode = normalizePostcode(value);


          return !locations.some((loc) => {
            if (!loc.firstLine || !loc.city || !loc.postcode) return false;

            return (
              normalizeText(loc.firstLine) === normalizedFirstLine &&
              normalizeText(loc.city) === normalizedCity &&
              normalizePostcode(loc.postcode) === normalizedPostcode
            );
          });
        }
      ),
  });

  const handleSubmit = async (
    values: CreateLocationDto,
    { setSubmitting, resetForm }: FormikHelpers<CreateLocationDto>
  ) => {
    try {
      await createLocationMutation.mutateAsync(values);
      await resetForm();
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Typography
        component="h2"
        variant="h3"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2rem)", color: 'primary.dark' }}
      >Add New Location</Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={locationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ isSubmitting, isValid, dirty, errors }) => (
          <Form style={{
            display: 'flex', flexDirection: "column",
            marginTop: "16px", gap: "16px"
          }}>

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
              disabled={isSubmitting || createLocationMutation.isPending || !isValid || !dirty}
              // onClick={() => {if (!user) navigate("/login"); }}
            >
              {" "}
              {createLocationMutation.isPending ? "Submitting..." : "Submit"}

            </Button>
{/* server error */}
            {createError && (
              <Typography color="error">
                {createError instanceof Error
                  ? createError.message
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
    </>
  );
};
