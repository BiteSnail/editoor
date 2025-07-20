import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { useEffect, useState } from 'react'

function App(): React.JSX.Element {
  const [scale, setScale] = useState<number>(1)
  const [translate, setTranslate] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const handleZoomWheel = (e: React.WheelEvent<HTMLDivElement>): void => {
    console.log('Zooming with ctrl key pressed')
    if (e.ctrlKey) {
      e.preventDefault()

      let newScale = scale
      if (e.deltaY < 0) {
        newScale += 0.1
      } else {
        newScale -= 0.1
      }

      newScale = Math.max(0.5, Math.min(newScale, 2))
      setScale(newScale)
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    console.log('Click event:')
  }

  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <div className="app">
        <div className="wrapper">
          <div
            className="editor light"
            style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
          >
            <div
              className="editor-pane"
              style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
              onWheel={handleZoomWheel}
              onClick={handleClick}
            >
              <div
                className="eidtor-viewport editor-container"
                style={{ transform: `translate(0px, 0px) scale(${scale})` }}
              >
                <div
                  className="editor-edges"
                  style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
                />
                <div
                  className="editor-nodes"
                  style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
                ></div>
              </div>
            </div>
            <svg
              className="background"
              style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
            >
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx={0.5 * scale} cy={0.5 * scale} r={0.5 * scale} fill="#91919a" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#grid-pattern)" />
              <rect width="100" height="50" x="450" y="475"/>
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
