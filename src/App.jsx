import {Routes,Route,Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Login from './authentication/Login'
import Register from './authentication/Registration'

function App(){
return (

  
     <Routes>
      <Route path="/" element={<Home/>}/> 
      <Route path='/products' element={<Products/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='*' element={<Navigate to='/' replace />}/>

    </Routes> 
  
  )
}
export default App