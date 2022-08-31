/* eslint-disable @typescript-eslint/no-unused-vars */
import { YMapsApi } from '@pbe/react-yandex-maps/typings/util/typing'
import { mkadKms } from './constants'

interface IFastestRouteInReduce {
  route: null | ymaps.multiRouter.MultiRoute
}

export const findClosestMkadPoint = (point: number[]): number[] => {
  const closestPoint = mkadKms[0].reduce((prev, cur) => {
    const dist = findDistance(cur, point)
    if (prev.dist === -1 || dist < prev.dist) {
      prev.dist = dist
      prev.point = cur
    }
    return prev
  }, { point: [-1, -1], dist: -1 }).point
  return [closestPoint[0] !== -1 ? closestPoint[0] : 0, closestPoint[1] !== -1 ? closestPoint[1] : 0]
}

export const findFastestRoute = async (ymaps: YMapsApi, point: number[], map: ymaps.Map): Promise<ymaps.multiRouter.MultiRoute | null> => {
  const routeSearch: IFastestRouteInReduce = { route: null }

  await Promise
    .all(mkadKms[0].map(async mkadKm => {
      // eslint-disable-next-line @typescript-eslint/return-await
      return new Promise((resolve, reject) => {
        const route = new ymaps.multiRouter.MultiRoute({
          referencePoints: [point, mkadKm],
          params: { routingMode: 'auto' }
        }, {})

        route.events.add('update', () => resolve(route))
      })
    })
    )
    .then(promises => {
      (promises as ymaps.multiRouter.MultiRoute[])
        .forEach(route => {
          const newDuration = route.getActiveRoute()?.properties.get('duration', {}) as { value: number }
          const oldDuration = routeSearch.route?.getActiveRoute()?.properties.get('duration', {}) as { value: number }
          if (oldDuration === undefined || oldDuration.value > newDuration.value) {
            routeSearch.route = route
          }
        })
    })
  return routeSearch.route
}

const findDistance = (a: number[], b: number[]): number => {
  return Math.sqrt((
    Math.pow(a[0] - b[0], 2) +
    Math.pow(a[1] - b[1], 2)
  ))
}
