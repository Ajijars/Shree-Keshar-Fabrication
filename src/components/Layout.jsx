import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import WhatsAppFloat from "./WhatsAppFloat"
import ScrollToTop from "./ScrollToTop"
import ScrollProgressBar from "./ScrollProgressBar"
import BackToTopButton from "./BackToTopButton"
import { useScrollReveal } from "../hooks/useScrollReveal"

export default function Layout() {
  useScrollReveal()

  return (
    <>
      <ScrollProgressBar />
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppFloat />
      <BackToTopButton />
    </>
  )
}

