import ortho from '../assets/ortho.png'
import multi from '../assets/multicolored.png'
import fold from '../assets/foldable.png'
import opill from '../assets/orthopillow.png'
import spine from '../assets/spine.png'
import {Link} from 'react-router-dom'
function Arrivals(){
    const products=[
        {
            id:1,
            image:ortho,
            title:"Orthopedic Mattress"
        },
          {
            id:2,
            image:multi,
            title:"Multi-colored Pillow"
        },
          {
            id:3,
            image:fold,
            title:"Foldable Mattress"
        },
          {
            id:4,
            image:spine,
            title:"Spine Alignment Pillow"
        },  
        {
            id:5,
            image:opill,
            title:"orthopedic Pillow"
        }

    ]
return (
     <section className="bg-[#263D70] px-6 py-12">
     <div className="mb-6 flex items-center justify-between">
  <h1 className="font-['Poppins'] text-3xl font-semibold text-white">
    Our New Arrivals
  </h1>

<Link to="/products" className="rounded-full bg-[#F7F5F0] px-6 py-3 font-['Poppins'] text-xl text-black transition-all duration-300 hover:bg-[#D6B982]">
    Explore more →</Link>
</div>

      <div className="mx-auto grid  max-w-7xl gap-5 grid-cols-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="group cursor-pointer overflow-hidden rounded-xl border border-white/20 bg-white p-3 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-[#D6B982] hover:shadow-xl"
          >
            {/* Category Image */}
            <div className="overflow-hidden rounded-lg bg-[#F5F2EC]">
              <img
                src={product.image}
                alt={product.title}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105 border-2"
              />
            </div>

            {/* Category Title */}
            <div className="flex min-h-[64px] items-center justify-center px-1 text-center">
              <h3 className="font-['Poppins'] text-sm font-semibold text-[#263D70] transition-colors duration-300 group-hover:text-[#A47B3C]">
                {product.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
)
}
export default Arrivals