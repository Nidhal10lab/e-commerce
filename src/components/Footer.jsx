const shopLinks = [
  "All Mattresses",
  "All Pillows",
  "Bedsheets & Comforters",
  "Mattress & Pillow Protectors",
  "Cushions & Others",
];

const sleepLinks = [
  "Back Support",
  "Spine Alignment",
  "Sleep Comfort",
  "Mattress Care",
  "Healthy Sleep",
];

const helpLinks = [
  "FAQs",
  "Shipping & Delivery",
  "Returns & Refunds",
  "Track Your Order",
  "Contact Us",
];

function Footer() {
  return (
    <footer className="bg-[#F7F5F0] font-['Poppins'] text-[#263D70]">

      {/* Contact Section */}
      <section
        id="contact"
        className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-2 md:gap-16"
      >

        {/* Contact Information */}
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#A47B3C]">
            Contact Us
          </p>

          <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
            We're easy
            <br />
            <span className="text-[#A47B3C]">to reach.</span>
          </h2>

          <p className="mt-5 max-w-md text-sm leading-7 text-gray-600 md:text-base">
            Have a question or need assistance?
            We'd love to hear from you.
            Let us help you find your perfect comfort.
          </p>

          <div className="mt-8 space-y-5">

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl">
                ✉
              </div>
              <div>
                <h4 className="text-sm font-semibold">Email</h4>
                <p className="text-sm text-gray-600">
                  fynimattressorg@gmail.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl">
                ☎
              </div>
              <div>
                <h4 className="text-sm font-semibold">Phone</h4>
                <p className="text-sm text-gray-600">
                  8075644233
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl">
                ⌖
              </div>
              <div>
                <h4 className="text-sm font-semibold">Visit Us</h4>
                <p className="text-sm text-gray-600">
                  Kozhikode, Kerala, India
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Contact Form UI Only */}
        <div className="relative overflow-hidden rounded-3xl bg-[#263D70] p-6 text-white shadow-xl md:p-9">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#A47B3C]/20" />

          <div className="relative z-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#D8B77D]">
              Get in touch
            </p>
            <h3 className="mb-6 text-2xl font-semibold">Send us a message</h3>

            <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
              <label className="block text-sm">
                Your name
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/60 focus:border-white"
                  placeholder="Enter your name"
                />
              </label>

              <label className="block text-sm">
                Email address
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/60 focus:border-white"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block text-sm">
                Message
                <textarea
                  name="message"
                  rows="4"
                  required
                  className="mt-2 w-full resize-y rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/60 focus:border-white"
                  placeholder="How can we help?"
                />
              </label>

              <button
                type="submit"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#263D70] transition-colors hover:bg-[#F7F5F0]"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="border-t border-[#263D70]/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-semibold">Fyni Mattress</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Comfort and care for better nights and brighter mornings.
            </p>
          </div>

          {[
            { title: "Shop", links: shopLinks },
            { title: "Sleep Better", links: sleepLinks },
            { title: "Help", links: helpLinks },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-600 transition-colors hover:text-[#263D70]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-[#263D70]/10 px-6 py-5 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Fyni Mattress. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;