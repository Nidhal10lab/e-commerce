import about from '../assets/about.png'
function About(){
    return (
        <div id="about"className="relative min-h-[550px] bg-cover bg-center bg-no-repeat pt-8 " style={{ backgroundImage: `url(${about})`}}>
    <h1 className="font-playfair text-5xl text-amber-400 absolute left-[500px] ">What is Fyni?</h1><br/><br/>
    {/* <h2 className="font-montserrat text-xl font-semibold text-[#D9E3F4] absolute left-[300px]">PREMIUM COMFORT, THOUGHTFULLY CRAFTED FOR EVERY HOME</h2><br/><br/> */}
    <p className="absolute left-[100px] bottom-[290px] font-inter  leading-relaxed text-[#E2E8F0]">Experience the perfect balance of comfort, quality,<br/> and affordability with FYNI Mattress. We believe<br/> that exceptional sleep shouldn't come with<br/> an exceptional price tag. That's why<br/> we bring you thoughtfully designed mattresses<br/> that combine lasting comfort, reliable quality,<br/> and outstanding value.</p><br></br><br/><br/><br/><br/><br/><br/>
    <ul className="absolute top-[400px] left-[800px] font-inter  leading-relaxed text-[#E2E8F0]">
        <li className="absolute bottom-[250px]">Comfort that feels extraordinary — Designed to make every night's sleep more relaxing and refreshing.</li>
        {/* <li className="absolute left-30px">Quality you can trust — Crafted with <br/>attention to detail to <br/>support your everyday comfort.</li> */}
            <li className="">Premium sleep, affordable prices — Experience the luxury of better rest without stretching your budget.</li>
    </ul>
    <p className="absolute top-[370px] left-[100px] font-inter  leading-relaxed text-[#E2E8F0]">At FYNI Mattress, we believe that better days <br/>begin with better nights. Our mission is to make <br/>quality sleep accessible to every home, helping<br/> you wake up refreshed, recharged, and<br/> ready to embrace life.</p>
    </div>
    )
}
export default About