import { useState } from 'react'

type UseDragAndDropProps<T> = {
  items: T[]
  onItemsReorder: (items: T[]) => void
}

export const useDragAndDrop = <T>({ items, onItemsReorder }: UseDragAndDropProps<T>) => {
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)

  const handleReorderItems = (dragIndex: number, dropIndex: number) => {
    if (dragIndex === dropIndex) return

    const newItems = [...items]
    const dragItem = newItems[dragIndex]
    newItems.splice(dragIndex, 1)
    newItems.splice(dropIndex, 0, dragItem)
    onItemsReorder(newItems)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index)
    e.dataTransfer.setData('text/plain', index.toString())
    e.currentTarget.classList.add('opacity-50')
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItemIndex(null)
    e.currentTarget.classList.remove('opacity-50')
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'))
    handleReorderItems(dragIndex, dropIndex)
    e.currentTarget.classList.remove('bg-c700')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('bg-c700')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-c700')
  }

  return {
    draggedItemIndex,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  }
}
