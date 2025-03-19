import { useSelector } from "react-redux";
import { RootState } from "../store/store";


export const UserProfile = () => {
    const user = useSelector((state: RootState) => state.user);

    return (
        <div>
       
        </div>
      );

}