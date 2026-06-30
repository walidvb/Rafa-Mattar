import { useDndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Pencil,
  Play,
  PlusCircle,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { EditableMediaItem } from '../admin/api'
import { galleryDragLayoutId, galleryDropZoneId } from './gallery-dnd'
import { MediaTile } from './MediaTile'
import { Page } from '@shared/strapi-types'

interface EditableMediaTileProps {
  page: Page
  item: EditableMediaItem
  movingClientId: string | null
  showPositionZones: boolean
  onAddLeft: () => void
  onAddRight: () => void
  onStartMove: () => void
  onPlaceLeft: () => void
  onPlaceRight: () => void
  onDropFilesLeft: (files: File[]) => void
  onDropFilesRight: (files: File[]) => void
  onTogglePublished: (published: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

const iconButtonClass =
  'rounded bg-white/90 p-1.5 font-sans font-normal text-black shadow hover:bg-white'

const zoneTransition = { type: 'spring' as const, stiffness: 400, damping: 32 }

const ZONE_SHIFT_PX = 80
const ZONE_INDICATOR_PX = 80

function filesFromDataTransfer(dataTransfer: DataTransfer): File[] {
  return Array.from(dataTransfer.files).filter((file) =>
    file.type.startsWith('image/'),
  )
}

interface PositionZoneHitProps {
  side: 'left' | 'right'
  droppableId: string
  onClick?: () => void
  onDropFiles: (files: File[]) => void
  onActiveChange: (active: boolean) => void
}

function PositionZoneHit({
  side,
  droppableId,
  onClick,
  onDropFiles,
  onActiveChange,
}: PositionZoneHitProps) {
  const { setNodeRef, isOver } = useDroppable({ id: droppableId })
  const [hovered, setHovered] = useState(false)
  const isLeft = side === 'left'

  useEffect(() => {
    onActiveChange(hovered || isOver)
  }, [hovered, isOver, onActiveChange])

  function handleDragOver(event: React.DragEvent) {
    if (!event.dataTransfer.types.includes('Files')) {
      return
    }

    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault()
    setHovered(false)

    const files = filesFromDataTransfer(event.dataTransfer)
    if (files.length) {
      onDropFiles(files)
    }
  }

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={clsx(
        'absolute inset-y-0 z-40 w-1/2 bg-transparent',
        isLeft ? 'left-0' : 'right-0',
      )}
      aria-label={isLeft ? 'Place to the left' : 'Place to the right'}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  )
}

interface PositionZoneVisualProps {
  side: 'left' | 'right'
  active: boolean
}

function PositionZoneVisual({ side, active }: PositionZoneVisualProps) {
  const isLeft = side === 'left'
  const Arrow = isLeft ? ChevronLeft : ChevronRight

  return (
    <div
      className={clsx(
        'pointer-events-none absolute top-1/2 z-[39] -translate-y-1/2',
        isLeft ? 'left-0' : 'right-0',
      )}
    >
      <motion.div
        initial={false}
        animate={{
          scale: active ? 1 : 0,
          opacity: active ? 1 : 0,
        }}
        transition={zoneTransition}
        style={{
          width: ZONE_INDICATOR_PX,
          height: ZONE_INDICATOR_PX,
          originX: isLeft ? 0 : 1,
          originY: 0.5,
        }}
      >
        <div
          className={clsx(
            'flex h-full w-full items-center justify-center font-sans font-normal text-black',
            isLeft ? 'bg-red-500/40' : 'bg-green-500/40',
            active && (isLeft ? 'bg-red-500/55' : 'bg-green-500/55'),
          )}
        >
          <Arrow
            className={clsx(
              'h-8 w-8 stroke-[2.5] text-black',
              active && (isLeft ? 'animate-bounce-left' : 'animate-bounce-right'),
            )}
            aria-hidden
          />
        </div>
      </motion.div>
    </div>
  )
}

export function EditableMediaTile({
  page,
  item,
  movingClientId,
  showPositionZones,
  onAddLeft,
  onAddRight,
  onStartMove,
  onPlaceLeft,
  onPlaceRight,
  onDropFilesLeft,
  onDropFilesRight,
  onTogglePublished,
  onEdit,
  onDelete,
}: EditableMediaTileProps) {
  const { active } = useDndContext()
  const hasTitle = Boolean(item.title?.trim())
  const isPublished = item.published !== false
  const isMoving = movingClientId === item.clientId
  const moveModeActive = movingClientId !== null
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.clientId,
    disabled: moveModeActive,
  })
  const isDragSource = isDragging || active?.id === item.clientId
  const showZones = showPositionZones && !isMoving && !isDragSource
  const [activeZones, setActiveZones] = useState({ left: false, right: false })
  const imageTranslateX = activeZones.left
    ? ZONE_SHIFT_PX
    : activeZones.right
      ? -ZONE_SHIFT_PX
      : 0
  const anyZoneActive = activeZones.left || activeZones.right

  useEffect(() => {
    if (!showZones) {
      setActiveZones({ left: false, right: false })
    }
  }, [showZones])

  function setZoneActive(side: 'left' | 'right', active: boolean) {
    setActiveZones((current) => ({ ...current, [side]: active }))
  }

  return (
    <div
      className={clsx(
        'group relative max-w-full overflow-hidden font-sans font-normal text-black',
        'font-body',
        !hasTitle && 'ring-2 ring-red-500',
        (isMoving || isDragSource) && 'ring-2 ring-white/80',
        isDragSource && 'opacity-50',
      )}
      style={{ height: 350 }}
    >
      <div className="relative h-full w-full">
        <motion.div animate={{ x: imageTranslateX }} transition={zoneTransition}>
          <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={clsx(
              'relative h-full w-full touch-none',
              moveModeActive ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
            )}
          >
            {isDragSource ? (
              <div className="invisible h-full w-full" aria-hidden>
                <MediaTile page={page} item={item} editMode />
              </div>
            ) : (
              <motion.div layoutId={galleryDragLayoutId(item.clientId)}>
                <div className="relative h-full w-full">
                  <MediaTile page={page} item={item} editMode />
                </div>
              </motion.div>
            )}
            <div
              className={clsx(
                'pointer-events-none absolute inset-0 z-10 transition-colors duration-200',
                anyZoneActive
                  ? 'bg-black/50'
                  : 'bg-black/15 group-hover:bg-black/50',
              )}
            />
          </div>
        </motion.div>
      </div>

      {!hasTitle ? (
        <div
          className="absolute left-2 top-2 z-30 flex items-center gap-1 rounded bg-red-600/90 px-1.5 py-0.5 font-sans text-sm font-normal text-black"
          title="Title is required"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Missing title</span>
        </div>
      ) : null}

      {!moveModeActive ? (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-4 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            className={clsx(iconButtonClass, 'pointer-events-auto flex items-center gap-1')}
            aria-label="Add image to the left"
            onClick={onAddLeft}
          >
            <Play className="h-4 w-4 rotate-180" />
            <PlusCircle className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="pointer-events-auto rounded bg-white/90 px-3 py-1.5 font-sans text-sm font-normal text-black shadow hover:bg-white"
            onClick={onStartMove}
          >
            Move
          </button>

          <button
            type="button"
            className={clsx(iconButtonClass, 'pointer-events-auto flex items-center gap-1')}
            aria-label="Add image to the right"
            onClick={onAddRight}
          >
            <Play className="h-4 w-4" />
            <PlusCircle className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {showZones ? (
        <>
          <PositionZoneVisual side="left" active={activeZones.left} />
          <PositionZoneVisual side="right" active={activeZones.right} />
          <PositionZoneHit
            side="left"
            droppableId={galleryDropZoneId(item.clientId, 'left')}
            onClick={moveModeActive ? onPlaceLeft : undefined}
            onDropFiles={onDropFilesLeft}
            onActiveChange={(active) => setZoneActive('left', active)}
          />
          <PositionZoneHit
            side="right"
            droppableId={galleryDropZoneId(item.clientId, 'right')}
            onClick={moveModeActive ? onPlaceRight : undefined}
            onDropFiles={onDropFilesRight}
            onActiveChange={(active) => setZoneActive('right', active)}
          />
        </>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center gap-2 bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          className={clsx(iconButtonClass, 'pointer-events-auto')}
          aria-label={
            isPublished
              ? 'Published — click to hide'
              : 'Hidden — click to publish'
          }
          title={isPublished ? 'Published' : 'Hidden'}
          onClick={() => onTogglePublished(!isPublished)}
        >
          {isPublished ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          className={clsx(iconButtonClass, 'pointer-events-auto')}
          aria-label="Edit title and description"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={clsx(iconButtonClass, 'pointer-events-auto text-red-600')}
          aria-label="Delete image"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
