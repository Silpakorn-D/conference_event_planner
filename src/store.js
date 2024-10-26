// store.js
import { configureStore } from '@reduxjs/toolkit';
import venueReducer from './venueSlice';
import avReducer from './avSlice'; //Provide the avSlice
export default configureStore({//Create the Redux store with the configureStore() function from @reduxjs/toolkit
  reducer: {
    venue: venueReducer,// a reducer called venue(), imported from venueSlice.js
    av: avReducer,//a reducer called av(), imported from avSlice.js
  },
});
//This code creates a global Redux store using the @reduxjs/toolkit\ configureStore() function 
//so all components in the application can access the state managed by the venueReducer().
