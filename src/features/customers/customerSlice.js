import { createSlice } from '@reduxjs/toolkit';

//Initial State
const initialState = {
  fullName: '',
  nationalID: '',
  createdAt: '',
};

const customerSlice = createSlice({
  name: 'customer',
  //We can pass ir directly as initialState if its call initialState, else we need to set the property
  initialState,
  reducers: {
    createCustomer: {
      //We need the prepare method because of the payload having more than one value
      prepare(fullName, nationalID) {
        //Here we create the 'new' payload to include all the properties needed. And also we create the date here
        //because its a side effect and the reducer must be pure, cant have side effects.
        return { payload: { fullName, nationalID, createdAt: new Date() } };
      },
      reducer(state, action) {
        //It look as if we where mutating the values, but behind the scene its being transform to inmutable methods
        state.fullName = action.payload.fullName;
        state.nationalID = action.payload.nationalID;
        state.createdAt = state.payload.createdAt;
      },
    },
    updateName(state, action) {
      state.fullName = action.payload;
    },
  },
});

//Export the reducers(ACTIONS)
export const { createCustomer, updateName } = customerSlice.actions;

//Exporting the Slice
export default customerSlice.reducer;
