import { createSlice } from '@reduxjs/toolkit'
const initialState={
    counter:0
}
export const counterSlice = createSlice({
     name: 'counter',
     initialState,

        reducers:{

        }
     }
    )
    export const CounterReducer=counterSlice.reducer;


