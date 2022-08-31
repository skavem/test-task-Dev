import { configureStore } from '@reduxjs/toolkit'
import RouteSliceReducer from './RouteSlice'

export const store = configureStore({
  reducer: {
    route: RouteSliceReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
