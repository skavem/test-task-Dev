/* eslint-disable @typescript-eslint/no-unused-vars */
import { useYMaps } from '@pbe/react-yandex-maps'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '.'
import { store } from '../store'
import { changeLastClickCoords, changeRoute, mapLoaded, mapLoading } from '../store/RouteActions'
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
    void dispatch(mapLoaded())

    lmap.events.add('click', (e) => {
      if (store.getState().route.mapLoading) return
      void dispatch(mapLoading())
      const newCoords = e.get('coords')
      const newClosestMkad = findClosestMkadPoint(newCoords, mkadKms[0])
      const map = e.get('map')

      void dispatch(changeLastClickCoords(newCoords))

      mark.geometry?.setCoordinates(newCoords)
      line.geometry?.setCoordinates([newCoords, newClosestMkad])

      const oldRoute = store.getState().route.route
      if (oldRoute !== null) {
        map.geoObjects.remove(oldRoute)
      }

      void toast.promise(
        findFastestYMultiRoute(ymaps, newCoords, mkadKms[0])
          .then((route) => {
            if (route === null) return
            void dispatch(changeRoute(route))
            map.geoObjects.add(route)
            void dispatch(mapLoaded())
            return {
              distance:
                route
                  .getActiveRoute()?.properties
                  .get('distance', { text: '' }) as { text: string},
              duration:
                route
                  .getActiveRoute()?.properties
                  .get('duration', { text: '' }) as { text: string}
            }
          }),
        {
          loading: 'Загружаем...',
          success: (data) =>
          `Расстояние: ${data?.distance.text ?? 'Не определено'}, 
          Длительность: ${data?.duration.text ?? 'Не определено'}`,
          error: 'Какая-то ошибка :( Перезагрузите страницу'
        }
      )
    })
  }, [ymaps])
}

export default useYMapWRouteDistance
