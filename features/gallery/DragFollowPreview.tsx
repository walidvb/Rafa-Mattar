import { useDndMonitor } from '@dnd-kit/core'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { adminMediaUrl, EditableMediaItem } from '../admin/api'
import { DRAG_PREVIEW_PX } from './gallery-dnd'

const springConfig = { stiffness: 380, damping: 32, mass: 0.55 }

interface DragFollowPreviewProps {
  item: EditableMediaItem | null
  layoutId: string | null
}

function pointerFromEvent(event: Event | null): { x: number; y: number } | null {
  if (!event) {
    return null
  }

  if ('clientX' in event && typeof event.clientX === 'number') {
    return { x: event.clientX, y: event.clientY }
  }

  if ('touches' in event && event.touches.length > 0) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY }
  }

  return null
}

function previewUrl(item: EditableMediaItem): string | undefined {
  if (item.type === 'image') {
    return adminMediaUrl(item.image?.url)
  }

  return item.videoUrl ?? undefined
}

export function DragFollowPreview({ item, layoutId }: DragFollowPreviewProps) {
  const [mounted, setMounted] = useState(false)
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const x = useSpring(cursorX, springConfig)
  const y = useSpring(cursorY, springConfig)
  const half = DRAG_PREVIEW_PX / 2

  useEffect(() => {
    setMounted(true)
  }, [])

  useDndMonitor({
    onDragStart(event) {
      const pointer = pointerFromEvent(event.activatorEvent)
      if (pointer) {
        cursorX.set(pointer.x - half)
        cursorY.set(pointer.y - half)
      }
    },
    onDragMove(event) {
      const pointer = pointerFromEvent(event.activatorEvent)
      if (pointer) {
        cursorX.set(pointer.x + event.delta.x - half)
        cursorY.set(pointer.y + event.delta.y - half)
      }
    },
  })

  if (!mounted || !item || !layoutId) {
    return null
  }

  const url = previewUrl(item)
  const isVideo = item.type === 'video'

  return createPortal(
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[200]"
      style={{ x, y, width: DRAG_PREVIEW_PX, height: DRAG_PREVIEW_PX }}
      initial={{ scale: 0.92, rotate: -1.5 }}
      animate={{ scale: 1.04, rotate: 1.5 }}
      exit={{ scale: 0.92, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
    >
      <motion.div
        layoutId={layoutId}
        className="h-full w-full overflow-hidden rounded shadow-lg ring-2 ring-white/90"
      >
        {url && !isVideo ? (
          <img src={url} alt="" className="h-full w-full object-cover" draggable={false} />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center bg-neutral-900">
            {url && isVideo ? (
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover opacity-80"
                draggable={false}
              />
            ) : null}
            {isVideo ? (
              <Play className="absolute h-6 w-6 fill-white text-white" aria-hidden />
            ) : (
              <span className="text-xs text-white/70">No preview</span>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  )
}
