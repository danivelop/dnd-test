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
import DnDComponent from 'components/DnDComponent'

function App() {
  return <DnDComponent />
}

export default App
