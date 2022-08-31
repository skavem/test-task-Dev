import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { multiRouter } from 'yandex-maps'

interface IRouteSlice {
  route: null | multiRouter.MultiRoute
}

const initialState: IRouteSlice = {
  route: null
}

export const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    setRoute (state, action: PayloadAction<multiRouter.MultiRoute>) {
      state.route = action.payload
    }
  }
})

export default routeSlice.reducer
