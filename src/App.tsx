import React from 'react'
import './App.css'
import { YMaps } from '@pbe/react-yandex-maps'
import CustomYMap from './components/CustomYMap'

function App (): JSX.Element {
  return (
    <div className="App" >
      <YMaps
        query={{
          apikey: '1637c085-6a5c-4b3c-9407-d5e3d5993d97',
          mode: 'debug'
        }}
      >
        <CustomYMap />
      </YMaps>
    </div>
  )
}

export default App
