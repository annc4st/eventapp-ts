import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import eventReducer from './eventSlice';
import locationReducer from './locationSlice';
import commentReducer from './commentSlice'
import singleEventReducer from './singleEventSlice';
import participantReducer from './participantSlice'
import singleGroupReducer from './singleGroupSlice'
import groupReducer from './groupSlice';
import groupMembershipReducer from './groupMembershipSlice'
import groupNewsReducer from './groupNewsSlice'
import singleNewsReducer from './singleNewsSlice'
import allUsersReducer from './allUsersSlice'


 const store = configureStore({
    reducer: {
      // user: persistedReducer,
      user: userReducer,
      users: allUsersReducer,
      events: eventReducer,
      locations: locationReducer,
      comments: commentReducer,
      singleEvent: singleEventReducer,
      participants: participantReducer,

      // groups: 
      groups: groupReducer,
      singleGroup: singleGroupReducer,
      groupMembership: groupMembershipReducer,
      groupNews: groupNewsReducer,
      singleNews: singleNewsReducer,
    },


  });

  // Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;