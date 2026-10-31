import offer from '../assets/offer.png'
function Offer(){
    return (
        <section className='relative min-h- bg-contain w-full overflow-hidden bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(${offer})`}}>
        <h1 className="mt-10 ml-6 mt-10 leading-[0.95] text-[40px] font-['Poppins']">Special Offer</h1>
        <h2 className="font-['Playfair_Display'] text-[100px] ml-5 text-amber-400 leading-[0.95]">Upto 50% Offers</h2>
        <p className='ml-6 mt-4 text-gray-500'>Discover Our Mattress essential at special prices</p>
        <button className="mb-10 ml-20 px-30 border-2 p-5 m-3 rounded-3xl font-bold bg-[#263D70] text-white text-xl">Explore offers</button>
        </section>
    )
}
export default Offer
 