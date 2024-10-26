// store.js
import { configureStore } from '@reduxjs/toolkit';
import venueReducer from './venueSlice';

export default configureStore({//Create the Redux store with the configureStore() function from @reduxjs/toolkit
  reducer: {
    venue: venueReducer,// a reducer called venue(), imported from venueSlice.js
  },
});
//This code creates a global Redux store using the @reduxjs/toolkit\ configureStore() function 
//so all components in the application can access the state managed by the venueReducer().
