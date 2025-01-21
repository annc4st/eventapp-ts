import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from '../store/userSlice';
import { RootState, AppDispatch } from '../store/store';


export const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.user);

    const handleRegister= () => {
        dispatch(registerUser({ email, password }));
      };

        return (
            <div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
              <button onClick={handleRegister} disabled={loading}>Register</button>
              {error && <p>{error}</p>}
            </div>
          );
    
}
 