
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import Hero from "../components/Hero"
import About from "../components/About"
import Features from "../components/Features"
import Category from "../components/Category"
import Offer from "../components/Offer"
import Arrivals from "../components/Arrivals"
import Footer from "../components/Footer"

function Home() {
  // useLocation is used to find the loction of url
  const location = useLocation()
  useEffect(() => {
    if (location.hash) {
      const section = document.getElementById(
        location.hash.substring(1)
      )
      section?.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [location])

  return (
    <>
      <Hero />
      <About />
      <Features />
      <Category />
      <Offer />
      <Arrivals />
      <Footer />
    </>
  )
}
export default Home
