/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { Placemark, useYMaps } from '@pbe/react-yandex-maps'
import { Map as IMap, Placemark as IPlacemark, Polyline as IPolyline } from 'yandex-maps'
import { findClosestMkadPoint, mkadKms } from '../utils/constants'
import { useAppDispatch, useAppSelector } from '../hooks.ts'
import { changeRoute } from '../store/RouteActions'
import { store } from '../store'

const CustomYMap = function (): JSX.Element {
  const mapRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  const [map, setMap] = useState<IMap | null>(null)
  const [curCoords, setCurMark] = useState<number[]>([55.9, 37.9])

  const ymaps = useYMaps(['Map', 'Polygon', 'Placemark', 'Polyline', 'multiRouter.MultiRoute'])

  useEffect(() => {
    if (ymaps === null || mapRef.current === null) return
    const lmap = new ymaps.Map(mapRef.current, {
      center: [55.76, 37.64],
      zoom: 10
    })

    setMap(lmap)

    const poly = new ymaps.Polygon(mkadKms)
    const mark = new ymaps.Placemark(curCoords, {})
    const closestMkad = findClosestMkadPoint(curCoords)
    const line = new ymaps.Polyline([curCoords, closestMkad])
    const lroute = new ymaps.multiRouter.MultiRoute({
      referencePoints: [curCoords, closestMkad],
      params: {}
    }, {
      boundsAutoApply: true
    })
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
      const lroute = new ymaps.multiRouter.MultiRoute({
        referencePoints: [newCoords, newClosestMkad],
        params: {
          routingMode: 'auto'
        }
      }, {})
      void dispatch(changeRoute(lroute))
      map.geoObjects.add(lroute)
    })
  }, [ymaps])

  return (
    <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
  )
}

export default CustomYMap
