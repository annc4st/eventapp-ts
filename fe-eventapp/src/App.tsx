import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Theme, ThemePanel } from '@radix-ui/themes';
import './App.css'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { EventList } from './components/EventList'
import { EventPage } from "./components/EventPage";
import {CreateEvent } from "./components/CreateEvent";
import { Header } from "./components/Header";
import {CreateLocation} from "./components/CreateLocation"
import { Provider } from "react-redux";
import  store from "./store/store";
import { LocationsList } from "./components/LocationsList";
import  {UpdateEvent } from "./components/UpdateEvent";
import { GroupsList } from "./components/GroupsList";
import { GroupPage } from "./components/GroupPage";




function App() {
  

  return (
    <>
      <Provider store={store}>
      
     <Theme accentColor="purple" grayColor="slate" 
     panelBackground="solid" scaling="100%" radius="medium" >
      {/* <ThemePanel /> */}
        <Header />
     <Routes>
     <Route path ="/login" element={<Login />} />
     <Route path="/register" element={<Register />} />

     <Route path="/events" element={<EventList />}/>
     <Route path="/events/:id" element={<EventPage />} />
     <Route path="/events/:id/update" element={<UpdateEvent />} />
     <Route path="/events/create" element = {<CreateEvent />} />
     <Route path="/locations" element = {<LocationsList />} />
     <Route path="/locations/create" element = {<CreateLocation />} />
     <Route path="/groups" element={ <GroupsList/>}  />

     <Route path="/groups/:groupId" element={ <GroupPage/>}  />

     
     

   </Routes>
   </Theme>
   </Provider>
    </>
  )
}

export default App
