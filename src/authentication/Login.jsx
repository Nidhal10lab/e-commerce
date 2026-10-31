import { Link } from 'react-router-dom'
import {useState} from 'react'
function Login(){
    const[email,setEmail]=useState("")
    const[password,setpassword]=useState("")
return (
        <div className='min-h-screen flex  justify-center items-center'> 

        {/* main container */}
        <div className='grid grid-cols-2 '>

            {/* left side */}
            <div className='border-2 bg-[url("")]'>
                <h1>hii</h1>
            </div>
            
            {/* right side */}
            <div className='border-2'>
             <h1>Login</h1>
             <h4>Login to your account</h4>
            <label htmlFor='email'>Enter your Email:</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className='border-2'></input>
            <br/>
            <label htmlFor='password'>Enter your Password:</label>
            <input type="password" value={password} onChange={(e)=>setpassword(e.target.value)} className='border-2'></input>
            <br/>
            <Link to="/home"className='border-2'>Login</Link>
            <br/>
            <p>Don't Have an account with us</p>
            <Link to="/register">create a account with us</Link>
            </div>
            </div>
        </div>
)
}
export default Login