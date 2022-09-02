import { multiRouter } from 'yandex-maps'
import { AppDispatch } from '.'
import { routeSlice } from './RouteSlice'

export const changeRoute = (route: multiRouter.MultiRoute) => {
  return async (dispatch: AppDispatch) => {
    dispatch(routeSlice.actions.setRoute(route))
  }
}

export const changeLastClickCoords = (coords: number[]) => {
  return async (dispatch: AppDispatch) => {
    localStorage.setItem('lastClickCoords', JSON.stringify(coords))
    dispatch(routeSlice.actions.setLastClickCoords(coords))
  }
}
