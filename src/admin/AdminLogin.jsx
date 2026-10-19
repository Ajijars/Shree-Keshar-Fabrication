import { useState, useEffect } from "react"
import { useAdmin } from "./AdminContext"
import {
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  MessageCircle,
  X,
  CheckCircle2,
  Smartphone,
  RotateCcw
} from "lucide-react"

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 10 * 60 * 1000 // 10 minutes

export default function AdminLogin() {
  const { login, resetPasswordWithPin, sendSmsOtp, verifyOtpAndReset } = useAdmin()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [lockoutRemaining, setLockoutRemaining] = useState(0)

  // Forgot password modal states
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [recoveryMethod, setRecoveryMethod] = useState("sms") // "sms" or "pin"

  // SMS OTP states
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpSending, setOtpSending] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)

  // PIN states
  const [recoveryPin, setRecoveryPin] = useState("")

  // New password states
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState("")
  const [resetSuccess, setResetSuccess] = useState("")

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

  // Resend OTP countdown timer
  useEffect(() => {
    if (otpCountdown <= 0) return
    const timer = setInterval(() => {
      setOtpCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [otpCountdown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (lockoutRemaining > 0) return

    setLoading(true)
    setError("")

    try {
      const res = await login(password)
      if (res.success) {
        localStorage.removeItem("sk_admin_attempts")
        localStorage.removeItem("sk_admin_lockout")
      } else {
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

  // Handle sending SMS OTP
  const handleSendOtp = async () => {
    setResetError("")
    setResetSuccess("")
    setOtpSending(true)

    try {
      const res = await sendSmsOtp()
      if (res.success) {
        setOtpSent(true)
        setOtpCountdown(60)
        setResetSuccess("OTP मोबाइल क्रमांक +91 96993 71940 वर SMS द्वारे पाठवला आहे!")
      } else {
        setResetError(res.error || "SMS OTP पाठवण्यात त्रुटी. कृपया थोड्या वेळाने प्रयत्न करा.")
      }
    } catch {
      setResetError("सर्व्हरशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.")
    } finally {
      setOtpSending(false)
    }
  }

  // Handle OTP verification and password reset
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault()
    setResetError("")
    setResetSuccess("")

    if (!otp.trim() || otp.trim().length !== 6) {
      setResetError("कृपया SMS मध्ये आलेला ६-अंकी OTP टाका / Enter 6-digit OTP")
      return
    }
    if (newPassword.length < 8) {
      setResetError("नवीन पासवर्ड किमान ८ अक्षरांचा असावा / Minimum 8 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      setResetError("दोन्ही नवीन पासवर्ड जुळत नाहीत / Passwords do not match")
      return
    }

    setResetLoading(true)
    try {
      const res = await verifyOtpAndReset(otp.trim(), newPassword)
      if (res.success) {
        setResetSuccess(res.message || "पासवर्ड यशस्वीरित्या बदलला! आता लॉगिन करा.")
        localStorage.removeItem("sk_admin_lockout")
        localStorage.removeItem("sk_admin_attempts")
        setLockoutRemaining(0)
        setPassword(newPassword)

        setTimeout(() => {
          setShowForgotModal(false)
          setOtp("")
          setOtpSent(false)
          setNewPassword("")
          setConfirmPassword("")
          setResetSuccess("")
        }, 2200)
      } else {
        setResetError(res.error || "चुकीचा OTP! कृपया पुन्हा तपासा.")
      }
    } catch {
      setResetError("तांत्रिक त्रुटी. कृपया पुन्हा प्रयत्न करा.")
    } finally {
      setResetLoading(false)
    }
  }

  // Handle PIN reset
  const handlePinResetSubmit = async (e) => {
    e.preventDefault()
    setResetError("")
    setResetSuccess("")

    if (!recoveryPin.trim()) {
      setResetError("कृपया मास्टर रिकव्हरी पिन टाका / Enter recovery PIN")
      return
    }
    if (newPassword.length < 8) {
      setResetError("नवीन पासवर्ड किमान ८ अक्षरांचा असावा / Minimum 8 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      setResetError("दोन्ही नवीन पासवर्ड जुळत नाहीत / Passwords do not match")
      return
    }

    setResetLoading(true)
    try {
      const res = await resetPasswordWithPin(recoveryPin.trim(), newPassword)
      if (res.success) {
        setResetSuccess(res.message || "पासवर्ड यशस्वीरित्या बदलला! आता लॉगिन करा.")
        localStorage.removeItem("sk_admin_lockout")
        localStorage.removeItem("sk_admin_attempts")
        setLockoutRemaining(0)
        setPassword(newPassword)

        setTimeout(() => {
          setShowForgotModal(false)
          setRecoveryPin("")
          setNewPassword("")
          setConfirmPassword("")
          setResetSuccess("")
        }, 2200)
      } else {
        setResetError(res.error || "रिकव्हरी पिन चुकीचा आहे / Invalid recovery PIN")
      }
    } catch {
      setResetError("तांत्रिक त्रुटी. पुन्हा प्रयत्न करा.")
    } finally {
      setResetLoading(false)
    }
  }

  const formatLockoutTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const whatsappResetUrl = `https://wa.me/919699371940?text=${encodeURIComponent(
    "जय हरी! मी श्री केशर फॅब्रिकेशन ॲडमिन पॅनेलचा पासवर्ड विसरलो आहे. कृपया पासवर्ड रीसेट करण्यासाठी मदत करा."
  )}`

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
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(true)
                  setResetSuccess("")
                  setResetError("")
                }}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-900 underline hover:text-maroon-700"
              >
                <Smartphone className="h-3.5 w-3.5 text-amber-600" />
                <span>मोबाइल OTP ने अनलॉक करा (Unlock with SMS OTP)</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  पासवर्ड टाका / Enter Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(true)
                    setResetSuccess("")
                    setResetError("")
                  }}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-900 hover:underline transition"
                >
                  पासवर्ड विसरलात? (Forgot?)
                </button>
              </div>

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

      {/* Forgot Password Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-8 shadow-2xl border border-gold-500/30">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-5 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 border border-amber-200">
                <Smartphone className="h-6 w-6 text-amber-700" />
              </div>
              <h2 className="font-display text-xl font-bold text-gray-900">
                पासवर्ड रीसेट करा
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Password Recovery — मोबाइल OTP पडताळणी
              </p>
            </div>

            {/* Method Tabs */}
            <div className="mb-5 flex rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setRecoveryMethod("sms")
                  setResetError("")
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
                  recoveryMethod === "sms"
                    ? "bg-white text-maroon-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>📱 मोबाइल SMS OTP</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecoveryMethod("pin")
                  setResetError("")
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
                  recoveryMethod === "pin"
                    ? "bg-white text-maroon-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>🔑 मास्टर पिन (PIN)</span>
              </button>
            </div>

            {resetSuccess ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center mb-4">
                <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-emerald-600" />
                <p className="font-semibold text-emerald-800 text-sm">
                  {resetSuccess}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  लॉगिन फॉर्मवर पुनर्निर्देशित करत आहे...
                </p>
              </div>
            ) : null}

            {/* METHOD 1: SMS OTP (DEFAULT) */}
            {recoveryMethod === "sms" && !resetSuccess && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-slate-700">
                  <p className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <span>अधिकृत मोबाइल क्रमांक:</span>
                    <strong className="text-maroon-900 font-mono text-sm">+91 96993 71940</strong>
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    (मालक: प्रभाकर Mhaske / हर्ष Mhaske)
                  </p>
                </div>

                {!otpSent ? (
                  <div className="pt-2">
                    <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                      खाली दिलेल्या बटणावर क्लिक करा. तुमच्या नोंदणीकृत मोबाइल क्रमांकावर AWS द्वारे ६-अंकी SMS OTP पाठवला जाईल.
                    </p>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpSending}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-maroon-900 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-maroon-800 disabled:opacity-50"
                    >
                      <Smartphone className="h-4 w-4" />
                      <span>{otpSending ? "OTP पाठवत आहे..." : "📱 मोबाइलवर OTP पाठवा (Send SMS OTP)"}</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleVerifyOtpSubmit} className="space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-gray-700">
                          ६-अंकी SMS OTP टाका (Enter OTP)
                        </label>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpCountdown > 0 || otpSending}
                          className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 disabled:text-gray-400"
                        >
                          {otpCountdown > 0 ? (
                            `पुन्हा पाठवा (${otpCountdown}s)`
                          ) : (
                            <span className="flex items-center gap-1">
                              <RotateCcw className="h-3 w-3" /> OTP पुन्हा पाठवा
                            </span>
                          )}
                        </button>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="••••••"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-center font-mono text-lg tracking-widest outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
                        required
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">
                        नवीन पासवर्ड (New Password)
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="किमान ८ अक्षरे (Min 8 chars)"
                          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">
                        नवीन पासवर्ड पुन्हा टाका (Confirm Password)
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="नवीन पासवर्ड पुन्हा टाका"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
                        required
                      />
                    </div>

                    {resetError && (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                        {resetError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full rounded-xl bg-maroon-900 py-3 text-sm font-semibold text-white transition hover:bg-maroon-800 disabled:opacity-50 shadow-md"
                    >
                      {resetLoading ? "पडताळणी करत आहे..." : "OTP पडताळून पासवर्ड बदला (Verify & Reset)"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* METHOD 2: MASTER RECOVERY PIN */}
            {recoveryMethod === "pin" && !resetSuccess && (
              <form onSubmit={handlePinResetSubmit} className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    मास्टर रिकव्हरी पिन (Master Recovery PIN)
                  </label>
                  <input
                    type="password"
                    maxLength={12}
                    value={recoveryPin}
                    onChange={(e) => setRecoveryPin(e.target.value)}
                    placeholder="उदा. 969937"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
                    required
                  />
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Default: मालकाचा फोन कोड (969937)
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    नवीन पासवर्ड (New Password)
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="किमान ८ अक्षरे (Min 8 chars)"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    नवीन पासवर्ड पुन्हा टाका (Confirm Password)
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="नवीन पासवर्ड पुन्हा टाका"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20"
                    required
                  />
                </div>

                {resetError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                    {resetError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full rounded-xl bg-maroon-900 py-3 text-sm font-semibold text-white transition hover:bg-maroon-800 disabled:opacity-50 shadow-md"
                >
                  {resetLoading ? "पडताळणी करत आहे..." : "नवीन पासवर्ड सेट करा / Reset Password"}
                </button>
              </form>
            )}

            {/* Modal Footer: WhatsApp Fallback */}
            {!resetSuccess && (
              <div className="mt-5 border-t border-gray-100 pt-4">
                <a
                  href={whatsappResetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50/70 py-2.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  <span>थेट WhatsApp वर मालकांशी संपर्क साधा</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
