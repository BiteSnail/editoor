import useWheelZoom from "@renderer/hooks";

const EditorNode = ({children}: {children: React.JSX.Element}): React.JSX.Element => {
  const { ref, transform, isDragging, handleMouseDown, handleMouseMove, handleMouseUp } = useWheelZoom(0, 70)
  return (
    <div ref={ref} className="editor-node" style={{ height: '100px', width: '100px', zIndex: 1000, transform: `translate(${transform.translateX}px, ${transform.translateY}px)`, cursor: isDragging ? 'grabbing' : 'grab', background: 'white' }} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {children}
    </div>
  );
};

export default EditorNode;