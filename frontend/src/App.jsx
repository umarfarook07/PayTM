import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Send from './Pages/Send'
import Signin from './Pages/Signin';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signup/>} />
        <Route path='/signin' element={<Signin/>} />
        <Route path='/Dashboard' element={<Dashboard/>} />
        <Route path='/send' element={<Send/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
