import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import ServicesPage from "./pages/ServicesPage"
import GalleryPage from "./pages/GalleryPage"
import OwnersPage from "./pages/OwnersPage"
import ContactPage from "./pages/ContactPage"

// Admin
import AdminGuard from "./admin/AdminGuard"
import AdminLayout from "./admin/AdminLayout"
import AdminDashboard from "./admin/AdminDashboard"
import AdminGallery from "./admin/AdminGallery"
import AdminServices from "./admin/AdminServices"
import AdminOwners from "./admin/AdminOwners"
import AdminContact from "./admin/AdminContact"
import AdminSettings from "./admin/AdminSettings"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Site */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/owners" element={<OwnersPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="owners" element={<AdminOwners />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
