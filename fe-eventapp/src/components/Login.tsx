import React, {useState} from "react";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
  ErrorMessage, 
} from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from '../store/userSlice';
import { RootState, AppDispatch} from '../store/store';


export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await  dispatch(loginUser({ email, password }));
         console.log()
         navigate('/');

      }   catch (error){
        console.log("Login failed:", error);
      }
      };

        return (
            <div>
              <form onSubmit={handleLogin} >
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
              <button  type="submit" disabled={loading}>Login</button>
              {error && <p>{error}</p>}
              </form>
            </div>
          );
    
}
 