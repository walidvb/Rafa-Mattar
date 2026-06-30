import { useDndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import clsx from 'clsx'
import {
  AlertCircle,
  Camera,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  type LucideIcon,
  Pencil,
  Plus,
  Trash2,
  Video,
} from 'lucide-react'
import { useState } from 'react'

import { EditableMediaItem } from '../admin/api'
import { TileSwipeContent } from './TileSwipeContent'
import { Page } from '@shared/strapi-types'

interface EditableMediaTileProps {
  page: Page
  item: EditableMediaItem
  displayItem?: EditableMediaItem
  swipeDirection?: 'left' | 'right' | null
  onAddImageLeft: () => void
  onAddImageRight: () => void
  onAddVideoLeft: () => void
  onAddVideoRight: () => void
  onMoveLeft: () => void
  onMoveRight: () => void
  canMoveLeft: boolean
  canMoveRight: boolean
  onDropFilesLeft: (files: File[]) => void
  onDropFilesRight: (files: File[]) => void
  onTogglePublished: (published: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

const iconButtonClass =
  'rounded bg-white/90 p-1.5 font-sans font-normal text-black shadow hover:bg-white'

function AddMediaButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="pointer-events-auto relative"
      aria-label={label}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <Plus
        className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5"
        strokeWidth={3}
      />
    </button>
  )
}

function filesFromDataTransfer(dataTransfer: DataTransfer): File[] {
  return Array.from(dataTransfer.files).filter((file) =>
    file.type.startsWith('image/'),
  )
}

export function EditableMediaTile({
  page,
  item,
  displayItem = item,
  swipeDirection = null,
  onAddImageLeft,
  onAddImageRight,
  onAddVideoLeft,
  onAddVideoRight,
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight,
  onDropFilesLeft,
  onDropFilesRight,
  onTogglePublished,
  onEdit,
  onDelete,
}: EditableMediaTileProps) {
  const { active } = useDndContext()
  const shownItem = displayItem ?? item
  const hasTitle = Boolean(item.title?.trim())
  const isPublished = item.published !== false
  const isDraggingAny = Boolean(active)
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({ id: item.clientId })
  const { setNodeRef: setDropRef } = useDroppable({ id: item.clientId })
  const isDragSource = isDragging || active?.id === item.clientId
  const contentSwipe = swipeDirection
  const [fileHover, setFileHover] = useState(false)

  function handleFileDragOver(event: React.DragEvent) {
    if (!event.dataTransfer.types.includes('Files')) {
      return
    }

    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    setFileHover(true)
  }

  function handleFileDrop(event: React.DragEvent) {
    if (!event.dataTransfer.types.includes('Files')) {
      return
    }

    event.preventDefault()
    setFileHover(false)

    const files = filesFromDataTransfer(event.dataTransfer)
    if (!files.length) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const droppedLeft = event.clientX < rect.left + rect.width / 2
    if (droppedLeft) {
      onDropFilesLeft(files)
    } else {
      onDropFilesRight(files)
    }
  }

  return (
    <div
      ref={setDropRef}
      className={clsx(
        'group relative max-w-full overflow-hidden font-sans font-normal text-black',
        'font-body',
        !hasTitle && 'ring-2 ring-red-500',
        isDragSource && shownItem.clientId === item.clientId && 'opacity-50',
      )}
      style={{ height: 350 }}
      onDragOver={handleFileDragOver}
      onDragLeave={() => setFileHover(false)}
      onDrop={handleFileDrop}
    >
      <div className="relative h-full w-full">
        <div
          ref={setDragRef}
          {...listeners}
          {...attributes}
          className="relative h-full w-full touch-none cursor-grab active:cursor-grabbing"
        >
          <TileSwipeContent
            page={page}
            displayItem={shownItem}
            swipeDirection={contentSwipe}
          />
          <div
            className={clsx(
              'pointer-events-none absolute inset-0 z-10 transition-colors duration-200',
              fileHover
                ? 'bg-black/50'
                : clsx('bg-black/15', !isDraggingAny && 'group-hover:bg-black/50'),
            )}
          />
        </div>
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

      {!isDraggingAny ? (
        <>
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-between px-4 opacity-0 transition-opacity group-hover:opacity-100 text-white">
            <div className="flex flex-col gap-3">
              <AddMediaButton
                icon={Camera}
                label="Add image to the left"
                onClick={onAddImageLeft}
              />
              <AddMediaButton
                icon={Video}
                label="Add video to the left"
                onClick={onAddVideoLeft}
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className={clsx(
                  'pointer-events-auto p-2',
                  !canMoveLeft && 'cursor-not-allowed opacity-40',
                )}
                aria-label="Move one position left"
                disabled={!canMoveLeft}
                onClick={onMoveLeft}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                className={clsx(
                  'pointer-events-auto p-2',
                  !canMoveRight && 'cursor-not-allowed opacity-40',
                )}
                aria-label="Move one position right"
                disabled={!canMoveRight}
                onClick={onMoveRight}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <AddMediaButton
                icon={Camera}
                label="Add image to the right"
                onClick={onAddImageRight}
              />
              <AddMediaButton
                icon={Video}
                label="Add video to the right"
                onClick={onAddVideoRight}
              />
            </div>
          </div>

          <div className="tile-toolbar pointer-events-none absolute bottom-2 z-30 flex w-fit gap-2 rounded bg-black/50 p-2">
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
        </>
      ) : null}
    </div>
  )
}
