import { useYMaps } from '@pbe/react-yandex-maps'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '.'
import { store } from '../store'
import { changeLastClickCoords, changeRoute } from '../store/RouteActions'
import { mkadKms } from '../utils/constants'
import {
  findClosestMkadPoint,
  findFastestYMultiRoute
} from '../utils/distanceCheckers'

const useYMapWRouteDistance = (
  mapRef: React.RefObject<HTMLDivElement>,
  pointCloud: number[][][]
): void => {
  const dispatch = useAppDispatch()
  const initCoords = useAppSelector(state => state.route.lastClickCoords)

  const ymaps = useYMaps([
    'Map',
    'Polygon',
    'Placemark',
    'Polyline',
    'multiRouter.MultiRoute'
  ])

  useEffect(() => {
    if (ymaps === null || mapRef.current === null) return
    const lmap = new ymaps.Map(mapRef.current, {
      center: [55.76, 37.64],
      zoom: 10
    })

    const poly = new ymaps.Polygon(pointCloud)
    const mark = new ymaps.Placemark(initCoords, {})
    const closestMkad = findClosestMkadPoint(initCoords, mkadKms[0])
    const line = new ymaps.Polyline([initCoords, closestMkad])
    const lroute = new ymaps.multiRouter.MultiRoute(
      {
        referencePoints: [initCoords, closestMkad],
        params: {}
      },
      {}
    )
    poly.options.set('fillColor', '0066ff99')
    lmap.geoObjects.add(poly).add(mark).add(line).add(lroute)

    void dispatch(changeRoute(lroute))
    void dispatch(
      changeLastClickCoords(mark.geometry?.getCoordinates() as number[])
    )

    lmap.events.add('click', (e) => {
      void dispatch(
        changeLastClickCoords(e.get('coords'))
      )

      const newCoords = e.get('coords')
      const newClosestMkad = findClosestMkadPoint(newCoords, mkadKms[0])
      const map = e.get('map')

      console.log(newCoords)

      mark.geometry?.setCoordinates(newCoords)
      line.geometry?.setCoordinates([newCoords, newClosestMkad])

      const oldRoute = store.getState().route.route
      if (oldRoute !== null) {
        map.geoObjects.remove(oldRoute)
      }

      void findFastestYMultiRoute(ymaps, newCoords, mkadKms[0])
        .then((route) => {
          if (route === null) return
          void dispatch(changeRoute(route))
          map.geoObjects.add(route)
        })
    })
  }, [ymaps])
}

export default useYMapWRouteDistance
