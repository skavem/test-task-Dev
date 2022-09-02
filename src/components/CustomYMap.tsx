import React, { useRef } from 'react'
import useYMapWRouteDistance from '../hooks.ts/useYMapWRouteDistance'
import { mkadKms } from '../utils/constants'

const CustomYMap = function (): JSX.Element {
  const mapRef = useRef<HTMLDivElement>(null)
  useYMapWRouteDistance(mapRef, mkadKms)

  return (
    <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
  )
}

export default CustomYMap
