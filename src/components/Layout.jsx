import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import WhatsAppFloat from "./WhatsAppFloat"
import ScrollToTop from "./ScrollToTop"

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
