import { configureStore } from '@reduxjs/toolkit'
import RouteSliceReducer from './RouteSlice'

export const store = configureStore({
  reducer: {
    route: RouteSliceReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
