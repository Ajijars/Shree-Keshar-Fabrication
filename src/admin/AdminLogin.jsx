import { useState } from "react"
import { useAdmin } from "./AdminContext"
import { Lock, Eye, EyeOff } from "lucide-react"

export default function AdminLogin() {
  const { login } = useAdmin()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    setTimeout(() => {
      const success = login(password)
      if (!success) {
        setError("चुकीचा पासवर्ड / Wrong password")
        setPassword("")
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-800 p-4">
      <div className="pattern-overlay absolute inset-0 opacity-15" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-gold-500/20 bg-white/95 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-500/50 bg-maroon-900">
              <Lock className="h-7 w-7 text-gold-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-maroon-900">
              Admin Panel
            </h1>
            <p className="font-devanagari mt-1 text-sm text-gray-500">
              श्री केशर फॅब्रिकेशन — व्यवस्थापन
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                पासवर्ड टाका / Enter Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full rounded-xl bg-maroon-900 py-3.5 text-sm font-semibold text-white transition hover:bg-maroon-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "तपासत आहे..." : "लॉगिन करा / Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Default password: <code className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-600">keshar2024</code>
          </p>
        </div>
      </div>
    </div>
  )
}
