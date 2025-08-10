import { useEffect } from 'react';
import EditorNode from './components/Node';
import useWheelZoom from './hooks';

function App(): React.JSX.Element {
  const { ref, style, transform, handleWheel, resetZoom, isDragging, handleMouseDown, handleMouseMove, handleMouseUp } = useWheelZoom();

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
              style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, cursor: isDragging ? 'grabbing' : 'grab' }}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <div className="editor-viewport editor-container" style={style}>
                <div
                  className="editor-edges"
                  style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
                />
                <div
                  className="editor-nodes"
                  style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 1000, cursor: 'default'}}
                >
                  <EditorNode>
                    <div style={{ width: '100%', height: '100%', background: 'blue' }}>
                      hi
                      </div>
                  </EditorNode>
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
