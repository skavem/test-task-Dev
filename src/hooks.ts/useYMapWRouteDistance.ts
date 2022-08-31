import { useYMaps } from '@pbe/react-yandex-maps'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '.'
import { store } from '../store'
import { changeRoute } from '../store/RouteActions'
import { mkadKms } from '../utils/constants'
import { findClosestMkadPoint, findFastestRoute } from '../utils/distanceCheckers'

const useYMapWRouteDistance = (mapRef: React.RefObject<HTMLDivElement>): void => {
  const dispatch = useAppDispatch()
  const [curCoords, setCurMark] = useState<number[]>([55.9, 37.9])

  const ymaps = useYMaps(['Map', 'Polygon', 'Placemark', 'Polyline', 'multiRouter.MultiRoute'])

  useEffect(() => {
    if (ymaps === null || mapRef.current === null) return
    const lmap = new ymaps.Map(mapRef.current, {
      center: [55.76, 37.64],
      zoom: 10
    })

    const poly = new ymaps.Polygon(mkadKms)
    const mark = new ymaps.Placemark(curCoords, {})
    const closestMkad = findClosestMkadPoint(curCoords)
    const line = new ymaps.Polyline([curCoords, closestMkad])
    const lroute = new ymaps.multiRouter.MultiRoute({
      referencePoints: [curCoords, closestMkad],
      params: {}
    }, {})
    poly.options.set('fillColor', '0066ff99')
    lmap.geoObjects
      .add(poly)
      .add(mark)
      .add(line)
      .add(lroute)

    void dispatch(changeRoute(lroute))
    setCurMark(mark.geometry?.getCoordinates() as number[])

    lmap.events.add('click', (e) => {
      setCurMark(e.get('coords'))

      const newCoords = e.get('coords')
      const newClosestMkad = findClosestMkadPoint(newCoords)
      const map = mark.getMap()

      mark.geometry?.setCoordinates(newCoords)
      line.geometry?.setCoordinates([newCoords, newClosestMkad])

      const oldRoute = store.getState().route.route
      if (oldRoute !== null) {
        map.geoObjects.remove(oldRoute)
      }

      void findFastestRoute(ymaps, newCoords, map).then(route => {
        if (route === null) return
        void dispatch(changeRoute(route))
        map.geoObjects.add(route)
      })
    })
  }, [ymaps])
}

export default useYMapWRouteDistance
