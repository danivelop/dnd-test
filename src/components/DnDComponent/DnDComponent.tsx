/* Exteranl dependencies */
import React, { useCallback } from 'react'

/* Interanl dependencies */
import DragAndDropList, { DragAndDropItem } from 'components/DragAndDropList'
import * as Styled from './DnDComponent.styled'

interface ItemProps {
  id: number
  title: string
  content: string
  order: number
}

const MOCK_DATA = [
  {
    id: 1,
    title: 'title1',
    content: 'content1',
    order: 1000,
  },
  {
    id: 2,
    title: 'title2',
    content: 'content2',
    order: 2000,
  },
  {
    id: 3,
    title: 'title3',
    content: 'content3',
    order: 3000,
  },
  {
    id: 4,
    title: 'title4',
    content: 'content4',
    order: 4000,
  },
  {
    id: 5,
    title: 'title5',
    content: 'content5',
    order: 5000,
  },
]

function DnDComponent() {
  const handleDrop = useCallback(({ dragItem, dragIndex, prevItem, nextItem}) => {
    console.log('dragItem', dragItem)
    console.log('dragIndex', dragIndex)
    console.log('prevItem', prevItem)
    console.log('nextItem', nextItem)
  }, [])

  const ListComponent = useCallback((item: ItemProps) => (
    <DragAndDropItem type="something" key={item.id}>
      { ({ itemRef, isDragging, isDraggingGlobal }) => (
        <Styled.Wrapper
          ref={itemRef}
          isDragging={isDragging}
        >
          <Styled.Text>{item.id}</Styled.Text>
          <Styled.Text>{item.title}</Styled.Text>
          <Styled.Text>{item.content}</Styled.Text>
        </Styled.Wrapper>
      ) }
    </DragAndDropItem>
  ), [])

  return (
    <DragAndDropList<ItemProps>
      interpolation={Styled.DragAndDropListStyle}
      list={MOCK_DATA}
      component={ListComponent}
      onDrop={handleDrop}
    />
  )
}

export default DnDComponent
