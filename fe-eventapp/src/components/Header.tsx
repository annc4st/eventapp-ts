import React from "react";
import "@radix-ui/themes/styles.css";
import { FaceIcon, ImageIcon, SunIcon, HomeIcon } from "@radix-ui/react-icons"
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from '../store/userSlice';
import { RootState, AppDispatch} from '../store/store';
import { LogoutBtn} from './LogoutBtn'
 


export const Header = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {user, loading: userLoading, error : userError} = useSelector((state: RootState) => state.user);


    return (
        <>
            <Link to="/events"><HomeIcon/> </Link>{' '}
            
            <Link to="/events/create">Post Event</Link>
            <Link to="/locations">Venues</Link>
            {/* remove later add to the locations list */}
            <Link to="/locations/create">Add Venue</Link> 
            <FaceIcon />
            {user && (
                <div>
                <p>Welcome, {user.email}</p>
                <LogoutBtn />
                </div>
            )}

            {!user && (
                <div>
                <p>Welcome, Stranger!</p>
                <Link to={'/login'}><button>Login</button></Link>
                <Link to={'/register'}><button>Register</button></Link>
                </div>
            )}
        </>
    )
}
