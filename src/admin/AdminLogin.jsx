import { useState, useEffect } from "react"
import { useAdmin } from "./AdminContext"
import { Lock, Eye, EyeOff, ShieldAlert, ShieldCheck } from "lucide-react"

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 10 * 60 * 1000 // 10 minutes

export default function AdminLogin() {
  const { login } = useAdmin()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [lockoutRemaining, setLockoutRemaining] = useState(0)

  // Check and maintain lockout timer
  useEffect(() => {
    const checkLockout = () => {
      const lockoutUntil = parseInt(localStorage.getItem("sk_admin_lockout") || "0", 10)
      const now = Date.now()
      if (lockoutUntil > now) {
        setLockoutRemaining(Math.ceil((lockoutUntil - now) / 1000))
      } else {
        setLockoutRemaining(0)
        if (lockoutUntil > 0) {
          localStorage.removeItem("sk_admin_lockout")
          localStorage.removeItem("sk_admin_attempts")
        }
      }
    }

    checkLockout()
    const timer = setInterval(checkLockout, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (lockoutRemaining > 0) return

    setLoading(true)
    setError("")

    try {
      const res = await login(password)
      if (res.success) {
        // Clear failed attempts upon successful authentication
        localStorage.removeItem("sk_admin_attempts")
        localStorage.removeItem("sk_admin_lockout")
      } else {
        // Increment failed attempts
        const currentAttempts = parseInt(localStorage.getItem("sk_admin_attempts") || "0", 10) + 1
        localStorage.setItem("sk_admin_attempts", currentAttempts.toString())

        if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS
          localStorage.setItem("sk_admin_lockout", lockoutUntil.toString())
          setLockoutRemaining(Math.ceil(LOCKOUT_DURATION_MS / 1000))
          setError("सुरक्षिततेसाठी लॉगिन ब्लॉक केले आहे. १० मिनिटांनी प्रयत्न करा. / Locked for 10 minutes.")
        } else {
          const remaining = MAX_FAILED_ATTEMPTS - currentAttempts
          setError(
            `${res.error || "चुकीचा पासवर्ड / Wrong password"} (${remaining} प्रयत्न शिल्लक / ${remaining} attempts remaining)`
          )
        }
        setPassword("")
      }
    } catch {
      setError("लॉगिन अयशस्वी. कृपया पुन्हा प्रयत्न करा. / Login failed.")
    } finally {
      setLoading(false)
    }
  }

  const formatLockoutTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-800 p-4">
      <div className="pattern-overlay absolute inset-0 opacity-15" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-gold-500/20 bg-white/95 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-500/50 bg-maroon-900 shadow-md">
              <Lock className="h-7 w-7 text-gold-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-maroon-900">
              Admin Security Portal
            </h1>
            <p className="font-devanagari mt-1 text-sm text-gray-500">
              श्री केशर फॅब्रिकेशन — अधिकृत व्यवस्थापन
            </p>
          </div>

          {lockoutRemaining > 0 && (
            <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-center">
              <ShieldAlert className="mx-auto mb-2 h-7 w-7 text-red-600 animate-pulse" />
              <p className="font-semibold text-red-800 text-sm">
                अनेक अयशस्वी प्रयत्नांमुळे लॉगिन ब्लॉक केले आहे!
              </p>
              <p className="text-xs text-red-600 mt-1">
                सुरक्षिततेसाठी खाते तात्पुरते कुलूपबंद करण्यात आले आहे.
              </p>
              <p className="mt-2 font-mono text-lg font-bold text-red-700">
                पुन्हा प्रयत्न वेळ: {formatLockoutTime(lockoutRemaining)}
              </p>
            </div>
          )}

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
                  placeholder="••••••••••••"
                  disabled={lockoutRemaining > 0}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={lockoutRemaining > 0}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password || lockoutRemaining > 0}
              className="w-full rounded-xl bg-maroon-900 py-3.5 text-sm font-semibold text-white transition hover:bg-maroon-800 disabled:cursor-not-allowed disabled:opacity-50 shadow-md"
            >
              {loading
                ? "सुरक्षा पडताळणी सुरू आहे..."
                : lockoutRemaining > 0
                ? "खाते ब्लॉक आहे (Locked)"
                : "सुरक्षित लॉगिन करा / Secure Login"}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>AWS PBKDF2 SHA-512 Encrypted • Authorized Access Only</span>
          </div>
        </div>
      </div>
    </div>
  )
}
