import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { object, string } from "yup";
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from "formik";
import { optimisticAdd, createGroup,  } from "../store/groupSlice";
import { RootState, AppDispatch } from "../store/store";
import { Box, Button, DialogActions, TextField, Dialog, DialogContent, DialogContentText, 
    DialogTitle, Slide} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions';


interface IGroupData {
  groupName: string;
  description: string;
  adminId: number;
}

//  Slide transition
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function CreateGroupModal() {
      const [open, setOpen] = useState(false);
      const dispatch = useDispatch<AppDispatch>();

       const { user } = useSelector((state: RootState) => state.user);
        if (!user) return null; // Prevent rendering if user is not logged in
      
        //   add user
      
        // const initialValues: IGroupData = {
        //   groupName: "",
        //   description: "",
        //   adminId: user?.id,
        // };

      const { groups } = useSelector(
        (state.RootState) => state.groups
      );

      const groupSchema = object().shape({
          groupName: string().min(8).required("GroupName is required"),
          description: string().min(20).required("Description is required"),
        });

        
        const handleClickOpen = () => setOpen(true);

        const handleClose = () => setOpen(false);

        const handleSubmit = async (
            values: IGroupData,
              { setSubmitting, resetForm }: FormikHelpers<IGroupData>
        ) => {
            const tempId = Date.now();
            const newGroup = {
                id: tempId,
                createdAt: new Date().toISOString(),
                ...values,
            };
            console.log("creating new group", newGroup);

            // optimistic update
            dispatch(optimisticAdd(newGroup));

            try {
                await dispatch(createGroup(
                    { ...values, 
                    createdAt: new Date().toISOString() }
                ));
                    await resetForm();
                    setSubmitting(false);
                    setOpen(false); // <-- only close on success!
            } catch (error) {
                console.error(error)
                setSubmitting(false)
            }         

        }



}