import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    pageState: 'introduction', // introduction, customForm, conclusion
    clientName: '-',
    clientAge: 0,
    conclusions: {},
    resetCustomForm: false
}

const graphologySlice = createSlice({
    name: 'graphology',
    initialState,
    reducers: {
        SET_STATE(state, action) {
            return action.payload ? {
                ...state,
                ...action.payload,
                error: null
            }
                : { ...state }
        },
        CLEANUP(state, action) {
            return initialState
        }
    },
})

export const graphologyAction = graphologySlice.actions;
export default graphologySlice.reducer