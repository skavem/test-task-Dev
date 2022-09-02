import React, { useRef } from 'react'
import useYMapWRouteDistance from '../hooks.ts/useYMapWRouteDistance'
import { mkadKms } from '../utils/constants'
import styles from './CustomYMap.module.css'

const CustomYMap = function (): JSX.Element {
  const mapRef = useRef<HTMLDivElement>(null)
  useYMapWRouteDistance(mapRef, mkadKms)

  return (
    <div ref={mapRef} className={styles.YMap} />
  )
}

export default CustomYMap
