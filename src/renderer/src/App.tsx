import useWheelZoom from './hooks';

function App(): React.JSX.Element {
  const { ref, style, transform, handleWheel, resetZoom } = useWheelZoom(1, 0.5, 2, 0.05);


  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    window.electron.ipcRenderer.send('click', {
      x: e.clientX,
      y: e.clientY,
      scale: transform.scale,
      translate: {
        x: transform.translateX,
        y: transform.translateY
      }
    })
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
              ref={ref}
              className="editor-pane"
              style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
              onWheel={handleWheel}
              onClick={handleClick}
            >
              <div className="editor-viewport editor-container" style={style}>
                <div
                  className="editor-edges"
                  style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
                />
                <div
                  className="editor-nodes"
                  style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
                >
                  <div
                    className="editor-node"
                    style={{
                      zIndex: 1000,
                      transform: `translate(${0}px, ${275}px)`,
                      background: 'red'
                    }}
                  >
                    dfadfa
                  </div>
                </div>
              </div>
            </div>
            <svg
              className="background"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: -1
              }}
            >
              <pattern
                id="grid-pattern"
                x={transform.translateX % (12 * transform.scale)}
                y={transform.translateY % (12 * transform.scale)}
                width={12 * transform.scale}
                height={12 * transform.scale}
                patternUnits="userSpaceOnUse"
                patternTransform={`translate(${-7 * transform.scale}, ${-7 * transform.scale})`}
              >
                <circle
                  cx={0.5 * transform.scale}
                  cy={0.5 * transform.scale}
                  r={0.5 * transform.scale}
                  fill="#91919a"
                />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
