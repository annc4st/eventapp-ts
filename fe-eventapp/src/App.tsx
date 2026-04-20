import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { EventList } from "./components/EventList";
// import { EventPage } from "./components/EventPage";
import { EventPage2 } from "./components/EventPage2";
import { CreateEvent } from "./components/CreateEvent";

import { CreateLocation } from "./components/CreateLocation";
import { Provider } from "react-redux";
import store from "./store/store";
import { LocationsList } from "./components/LocationsList";
import { UpdateEvent } from "./components/UpdateEvent";
import { GroupsList } from "./components/GroupsList";
import { GroupPage } from "./components/GroupPage";
import { GroupAdmin } from "./components/GroupAdmin";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAllUsers } from "./store/allUsersSlice";
import { AppDispatch } from "./store/store";
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from "./components/Layout";

import { CreateGroup } from "./components/CreateGroup";


function App() {

  const dispatch = useDispatch<AppDispatch>();
 
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);


  return (
    
      <Provider store={store}>
        <ThemeProvider>
         
           
            <Routes>
            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventPage2 />} />
              <Route path="/events/:id/update" element={<UpdateEvent />} />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/locations" element={<LocationsList />} />
              <Route path="/locations/create" element={<CreateLocation />} />
              <Route path="/groups" element={<GroupsList />} />
              <Route path="/groups/create" element={<CreateGroup />} />
              <Route path="/groups/:groupId" element={<GroupPage />} />
              <Route path="/groups/:groupId/admin" element={
                // <ProtectedRoute isAllowed={isAdmin}>
                <GroupAdmin />
              // </ProtectedRoute>
              } />
      
              <Route path="/unauthorized" element={<div>🚫 You are not allowed here</div>} />
              </Route>
            </Routes>
       
        </ThemeProvider>
      </Provider>

  );
}

export default App;
