import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type React from 'react'

interface SortableItemProps
  extends Omit<React.ComponentProps<'div'>, 'id' | 'children'> {
  id: string
  children:
    | React.ReactNode
    | ((props: {
        attributes: DraggableAttributes
        listeners: DraggableSyntheticListeners
      }) => React.ReactNode)
}
export const SortableItem = ({ id, children, ...rest }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(
      transform ? { ...transform, scaleY: 1 } : null,
    ),
    transition,
  }

  const content =
    typeof children === 'function'
      ? children({ attributes, listeners })
      : children
  return (
    <div ref={setNodeRef} style={style} {...rest}>
      {content}
    </div>
  )
}
