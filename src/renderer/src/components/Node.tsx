import useWheelZoom from "@renderer/hooks"
import './style.css'
import { useEffect } from "react";

const EditorNode = ({
  children,
  nodeType,
  id,
  title,
  x,
  y,
  scale
}: {
  children: React.JSX.Element
  nodeType: string
  id: string
  title: string
  x: number
  y: number
  scale: number
}): React.JSX.Element => {
  const { ref, transform, isDragging, handleMouseDown, handleMouseMove, handleMouseUp, setScale } = useWheelZoom(x, y)

  useEffect(() => {
    setScale(scale)
  }, [scale, setScale])

  return (
    <div
      ref={ref}
      className={`editor-node ${nodeType} ${isDragging ? 'dragging' : ''}`}
      style={{
        zIndex: 1000,
        transform: `translate(${transform.translateX}px, ${transform.translateY}px)`,
        width: '160px',
        height: '60px'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="editor-node-header">
        <span className="editor-node-id">{id}</span>
        <span className="editor-node-separator">|</span>
        <span className="editor-node-type">{nodeType}</span>
      </div>
      <div className="editor-node-title">{title}</div>
    </div>
  );
};

export default EditorNode;