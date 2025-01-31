import { useSelector } from "react-redux";
import { RootState } from "../store/store";


export const UserProfile = () => {
    const user = useSelector((state: RootState) => state.user);

    return (
        <div>
          {user.isAuthenticated ? (
            <div>
              <h1>Welcome, {user.name}</h1>
            </div>
          ) : (
            <h1>Please log in</h1>
          )}
        </div>
      );

}