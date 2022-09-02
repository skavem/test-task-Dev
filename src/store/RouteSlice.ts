import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { multiRouter } from 'yandex-maps'

interface IRouteSlice {
  route: null | multiRouter.MultiRoute
  lastClickCoords: number[]
  mapLoading: boolean
}

const coordsFromStorage = localStorage.getItem('lastClickCoords')

const initCoords = coordsFromStorage !== null
  ? JSON.parse(coordsFromStorage)
  : [55.9, 37.9]

const initialState: IRouteSlice = {
  route: null,
  lastClickCoords: initCoords,
  mapLoading: true
}

export const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    setRoute (state, action: PayloadAction<multiRouter.MultiRoute>) {
      state.route = action.payload
    },
    setLastClickCoords (state, action: PayloadAction<number[]>) {
      state.lastClickCoords = action.payload
    },
    setMapLoading (state, action: PayloadAction<boolean>) {
      state.mapLoading = action.payload
    }
  }
})

export default routeSlice.reducer
