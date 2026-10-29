import Navbar from "../components/Navbar"
import hero from '../assets/hero.png'
function Hero(){
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${hero})`}}>
            <Navbar/>
            <h1 className="font-['Playfair_Display'] text-[110px] ml-18 mt-18 leading-[0.95]">Sleep Your <br/> Problems Away</h1>
            <p className="font-['Poppins'] text-[20px] ml-18 mt-5">Say goodbye to restless nights<br/> and hello to deeper comfort. <br/>Discover your perfect sleep<br/> with Fyni Mattress.</p>
                <button
    className="absolute left-[460px] top-[425px] rounded-4xl bg-[#263D70] px-10 py-5 font-['Poppins'] text-white transition hover:bg-[#1D2F57] text-[20px]">Shop Now → </button>
        </div>
    )
}
export default Hero