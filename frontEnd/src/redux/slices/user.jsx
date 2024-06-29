import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : 'user_state',
    initialState : {
        userData : {},
        token : null,
        theme : 'light'
    } ,

    reducers : {
        setUser : (state,action) => {
          state.userData = action.payload.user
        },

        setToken : (state,action) => {
           state.token = action.payload.token
        },

        updateUser : (state,action) => {
           state.userData = {
              ...state.userData ,
              ...action.payload
           };
        },
        
        switchTheme : (state,action) => {
            state.theme = action.payload.theme
        }
    }
});

export const {setUser , setToken , updateUser ,switchTheme } = userSlice.actions;
export default userSlice.reducer;