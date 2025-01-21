import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
 
import './App.css'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { EventList } from './components/EventList'
import { EventPage } from "./components/EventPage";
import {CreateEvent } from "./components/CreateEvent";
import { Provider } from "react-redux";
import  store from "./store/store";


function App() {
  

  return (
    <>
      <Provider store={store}>
     <Routes>
     <Route path ="/login" element={<Login />} />
     <Route path="/register" element={<Register />} />
     <Route path="/events" element={<EventList />}/>
     <Route path="/events/:id" element={<EventPage />} />
     <Route path="/events/create" element = {<CreateEvent />} />
   </Routes>
   </Provider>
    </>
  )
}

export default App
