import { configureStore } from '@reduxjs/toolkit'
import graphologyReducer from './graphology/graphologySlice'

export default configureStore({
    reducer: {
        graphology: graphologyReducer
    }
})