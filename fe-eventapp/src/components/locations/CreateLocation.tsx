import { useEffect } from "react";
import { useNavigate, } from "react-router-dom";
import { useSelector } from "react-redux";
import {FormikHelpers} from "formik";
import { RootState } from "../../store/store";
import { Typography } from "@mui/material";
import { useLocations } from "../../hooks/useLocations";
import { CreateLocationDto } from "../../types";
import { useCreateLocation } from "../../hooks/useCreateLocation";
import { CreateLocationForm } from "./CreateLocationForm";


export const CreateLocation: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { data: locations = [] } = useLocations();

  const {
    mutateAsync,
    error,
    isPending,
    isError,
    isSuccess,
    // reset,
  } = useCreateLocation();


  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;
 

  const handleSubmit = async (
                values: CreateLocationDto,
                { setSubmitting, resetForm }: FormikHelpers<CreateLocationDto>
  ) => {
    try {
      await mutateAsync(values);
      await resetForm();
      setSubmitting(false);
    } catch (error) {
      console.error(error);
    } finally {
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

      <CreateLocationForm 
      onSubmit={handleSubmit}
      isPending={isPending}
      isSuccess={isSuccess}
      isError={isError}
      error={error}
      locations={locations}
      >
      </CreateLocationForm>

    </>
  );
};
