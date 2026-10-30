import comforter from '../assets/comforter.jpg';
import cushion from '../assets/cushion.jpg';
import mattress from '../assets/mattress.jpg';
import pillow from '../assets/pillow.jpg';
import protector from '../assets/protector.png';

const product = [
  {
    id: 1,
    image: mattress,
    title: 'All Mattresses',
  },
  {
    id: 2,
    image: pillow,
    title: 'All Pillows',
  },
  {
    id: 3,
    image: comforter,
    title: 'Bedsheets & Comforters',
  },
  {
    id: 4,
    image: protector,
    title: 'Mattress & Pillow Protectors',
  },
  {
    id: 5,
    image: cushion,
    title: 'Cushions & Others',
  },
];

function Category() {
  return (
    <section className="bg-[#263D70] px-6 py-12">
      <h1 className="mb-10 text-center font-['Poppins'] text-3xl font-semibold text-white">
        Shop by Category
      </h1>

      <div className="mx-auto grid max-w-7xl gap-5 grid-cols-5">
        {product.map((feature) => (
          <div
            key={feature.id}
            className="group cursor-pointer overflow-hidden rounded-xl border border-white/20 bg-white p-3 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-[#D6B982] hover:shadow-xl"
          >
            {/* Category Image */}
            <div className="overflow-hidden rounded-lg bg-[#F5F2EC]">
              <img
                src={feature.image}
                alt={feature.title}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105 border-2"
              />
            </div>

            {/* Category Title */}
            <div className="flex min-h-[64px] items-center justify-center px-1 text-center">
              <h3 className="font-['Poppins'] text-sm font-semibold text-[#263D70] transition-colors duration-300 group-hover:text-[#A47B3C]">
                {feature.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Category;