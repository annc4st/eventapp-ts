import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { EventList } from "./components/EventList";
import { EventPage } from "./components/EventPage";
import { CreateEvent } from "./components/CreateEvent";

import { CreateLocation } from "./components/CreateLocation";
import { Provider } from "react-redux";
import store from "./store/store";
import { LocationsList } from "./components/LocationsList";
import { UpdateEvent } from "./components/UpdateEvent";
import { GroupsList } from "./components/GroupsList";
import { GroupPage } from "./components/GroupPage";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAllUsers } from "./store/allUsersSlice";
import { AppDispatch } from "./store/store";
import theme from "./theme";
import { ThemeProvider, Container, CssBaseline } from "@mui/material";
import  NavBar from "./components/NavBar";
import Footer from "./components/Footer";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline>
          <Container maxWidth="lg">
          <NavBar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/events" element={<EventList />} />
            <Route path="/events/:id" element={<EventPage />} />
            <Route path="/events/:id/update" element={<UpdateEvent />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/locations" element={<LocationsList />} />
            <Route path="/locations/create" element={<CreateLocation />} />
            <Route path="/groups" element={<GroupsList />} />

            <Route path="/groups/:groupId" element={<GroupPage />} />
          </Routes>
          <Footer />
          </Container>
          </CssBaseline>
        </ThemeProvider>
      </Provider>

  );
}

export default App;
