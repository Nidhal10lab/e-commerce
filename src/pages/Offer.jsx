import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { fetchOffers } from '../redux/offerSlice'

function Offer() {
  const dispatch = useDispatch()
  const { items: offers = [], } = useSelector(
    state => state.offers
  )
  useEffect(() => {
    dispatch(fetchOffers())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-['Poppins']">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-widest text-[#A47B3C]">
              Special offers
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#263D70] mt-2">
              Products on offer
            </h1>
          </div>
          <Link
            to="/products"
            className="rounded-full bg-[#263D70] text-white px-5 py-3 text-sm font-medium hover:bg-[#1D2F57] transition"
          >
            Browse products
          </Link>
        </div>
        { offers.length === 0 && (
          <div className="py-16 text-center text-[#263D70]/70">
            No products are on offer right now.come back later
          </div>
        )}
        { offers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {offers.map(product => {
              const price = product.price
              const originalPrice = product.originalPrice
              const isOutOfStock = product.stock === 0 || product.isSoftDeleted

              return (
                <div
                  key={product.id}
                  className="relative bg-white rounded-2xl p-5 shadow-lg"
                >
                  {isOutOfStock && (
                    <span className="absolute top-8 left-8 bg-red-500 text-white text-xs px-3 py-1 rounded-full z-10">
                      Out of Stock
                    </span>
                  )}

                  <span className="absolute top-8 right-8 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full z-10">
                    {Math.round((1 - price / originalPrice) * 100)}% off
                  </span>

                  <div className="h-56 bg-[#F7F5F0] rounded-xl overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain hover:scale-105 transition duration-500"
                      onError={event => {
                        event.currentTarget.src = 'https://placehold.co/400x300?text=Product'
                      }}
                    />
                  </div>

                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-widest text-[#A47B3C]">
                      {product.category}
                    </p>
                    <h2 className="text-base font-semibold text-[#263D70] mt-1">
                      {product.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-3">
                      <p className="text-[#263D70] font-bold">
                        ₹{Number.isFinite(price) ? price.toLocaleString('en-IN') : product.price}
                      </p>
                      <p className="text-xs text-gray-400 line-through">
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Offer
