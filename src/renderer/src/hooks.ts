import { CSSProperties, RefObject, useCallback, useEffect, useRef, useState } from 'react'

interface Transform {
  scale: number
  translateX: number
  translateY: number
}

interface UseWheelZoomReturn {
  ref: RefObject<HTMLDivElement | null>
  style: CSSProperties
  transform: Transform
  handleWheel: (e: React.WheelEvent<HTMLDivElement>) => void
  resetZoom: () => void
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
  handleMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void
  setScale: (scale: number) => void
}

const useWheelZoom = (
  initialX: number = 0,
  initialY: number = 0,
  initialScale: number = 1,
  minScale: number = 0.5,
  maxScale: number = 3,
  zoomStep: number = 0.1
): UseWheelZoomReturn => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [transform, setTransform] = useState<Transform>({
    scale: initialScale,
    translateX: initialX,
    translateY: initialY
  })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // 휠 방향에 따라 확대/축소
      const delta = e.deltaY > 0 ? -zoomStep : zoomStep
      const newScale = Math.min(Math.max(transform.scale + delta, minScale), maxScale)

      if (newScale === transform.scale) return

      // 마우스 위치를 기준으로 한 확대/축소 계산
      const scaleRatio = newScale / transform.scale

      const newTranslateX = x - (x - transform.translateX) * scaleRatio
      const newTranslateY = y - (y - transform.translateY) * scaleRatio

      setTransform({
        scale: newScale,
        translateX: newTranslateX,
        translateY: newTranslateY
      })
    },
    [transform, minScale, maxScale, zoomStep]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      setIsDragging(true)
      setDragStart({
        x: e.clientX - transform.translateX * transform.scale,
        y: e.clientY - transform.translateY * transform.scale
      })
    },
    [transform]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !dragStart) return

      const deltaX = (e.clientX - dragStart.x) / transform.scale
      const deltaY = (e.clientY - dragStart.y) / transform.scale

      setTransform((prev) => ({
        ...prev,
        translateX: deltaX,
        translateY: deltaY
      }))
    },
    [isDragging, dragStart, transform.scale]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const setScale = useCallback((scale: number) => {
    setTransform((prev) => ({
      ...prev,
      scale
    }))
  }, [])

  const resetZoom = useCallback(() => {
    setTransform({
      scale: initialScale,
      translateX: 0,
      translateY: 0
    })
  }, [initialScale])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart, handleMouseMove, handleMouseUp])

  const style = {
    transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`,
    transformOrigin: '0 0'
  }

  return {
    ref,
    style,
    transform,
    handleWheel,
    resetZoom,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setScale
  }
}

export default useWheelZoom
