import { CSSProperties, RefObject, useCallback, useRef, useState } from 'react'

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
}

const useWheelZoom = (
  initialScale: number = 1,
  minScale: number = 0.5,
  maxScale: number = 3,
  zoomStep: number = 0.1
): UseWheelZoomReturn => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [transform, setTransform] = useState<Transform>({
    scale: initialScale,
    translateX: 0,
    translateY: 0
  })

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault()

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

  const resetZoom = useCallback(() => {
    setTransform({
      scale: initialScale,
      translateX: 0,
      translateY: 0
    })
  }, [initialScale])

  const style = {
    transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`,
    transformOrigin: '0 0'
  }

  return {
    ref,
    style,
    transform,
    handleWheel,
    resetZoom
  }
}

export default useWheelZoom
