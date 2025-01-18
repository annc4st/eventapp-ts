// import { useState } from 'react'
 
import './App.css'
import { Provider } from 'react-redux';
import { Counter } from './components/Counter'
import { store } from './store'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
      <Counter />
    </Provider>
       
    </>
  )
}

export default App
