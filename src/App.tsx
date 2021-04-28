// import React, { useState, useEffect } from 'react'
// import Board from 'components/Board'
// import { observe } from 'components/Game'

// function App() {
//   const [position, setPosition] = useState([0, 0])

//   useEffect(() => {
//     observe(setPosition)
//   }, [])

//   return (
//     <Board knightPosition={position} />
//   )
// }

// export default App

import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DnDComponent from 'components/DnDComponent'

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <DnDComponent />
    </DndProvider>
  )
}

export default App
