import { motion, type MotionProps, type Variants } from 'motion/react'

import { EditableMediaItem } from '../admin/api'
import { MediaTile } from './MediaTile'
import { Page } from '@shared/strapi-types'

const swipeTransition = { type: 'spring' as const, stiffness: 400, damping: 32 }

const swipeVariants: Variants = {
  enter: (dir: 'left' | 'right') => ({
    x: dir === 'left' ? '100%' : '-100%',
  }),
  center: { x: 0 },
}

interface TileSwipeContentProps {
  page: Page
  displayItem: EditableMediaItem
  swipeDirection: 'left' | 'right' | null
}

export function TileSwipeContent({
  page,
  displayItem,
  swipeDirection,
}: TileSwipeContentProps) {
  if (!displayItem?.clientId) {
    return null
  }

  const motionProps: MotionProps = {
    custom: swipeDirection ?? 'left',
    variants: swipeVariants,
    initial: swipeDirection ? 'enter' : 'center',
    animate: 'center',
    transition: swipeTransition,
  }

  return (
    <motion.div key={displayItem.clientId} className="h-full w-full" {...motionProps}>
      <MediaTile
        page={page}
        item={displayItem}
        editMode
        localPreviewUrl={displayItem.localPreviewUrl}
      />
    </motion.div>
  )
}
