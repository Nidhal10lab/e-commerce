import quality from '../assets/quality.png'
import layer from '../assets/layer.png'
import maintain from '../assets/maintain.png'
import back from '../assets/back.png'
import install from '../assets/install.png'
const features = [
  {
    icon: quality,
    title: "Quality Assurance",
    description: "Made for lasting comfort",
  },
  {
    icon: layer,
    title: "Layered Comfort",
    description: "Support in every layer",
  },
  {
    icon: maintain,
    title: "Easy Maintenance",
    description: "Simple everyday care",
  },
  {
    icon: back,
    title: "Orthopedic support",
    description: "Designed to support proper spine alignment",
  },
  {
    icon: install,
    title: "Easy Installation",
    description: "Convenient setup at home",
  },
];
function Features(){
    return (
        <section className="bg-[#F7F5F0] px-6 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
         {features.map((feature) => (
          <div
            key={feature.title}
            className="flex items-center justify-center gap-3"
          >
            <img
              src={feature.icon}
              alt=""
              className="h-15 w-15 shrink-0 object-contain"
            />

            <div>
              <h3 className="text-sm font-semibold text-[#292929] font-['Poppins'] ">
                {feature.title}
              </h3>
              <p className="mt-1 text-xs text-[#777777]">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
        </div>
        </section>
    )
}
export default Features