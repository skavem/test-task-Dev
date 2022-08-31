import { multiRouter } from 'yandex-maps'
import { AppDispatch } from '.'
import { routeSlice } from './RouteSlice'

export const changeRoute = (route: multiRouter.MultiRoute) => {
  return async (dispatch: AppDispatch) => {
    dispatch(routeSlice.actions.setRoute(route))
  }
}
