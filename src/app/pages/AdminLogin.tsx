import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import BrandLogo from "../components/BrandLogo";
import {
  checkAdminSession,
  loginAdmin,
} from "../lib/adminAuth";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      const authenticated = await checkAdminSession();
      if (authenticated) {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      if (isMounted) {
        setIsCheckingSession(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await loginAdmin(email, password);

    if (result.ok) {
      navigate("/admin/dashboard");
      return;
    }

    navigate("/", { replace: true });
    setIsSubmitting(false);
  };

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0B1F3A] via-[#2E4A3F] to-[#0B1F3A]">
        <div className="text-center text-white">
          <p className="text-lg font-semibold">Checking admin session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1F3A] via-[#2E4A3F] to-[#0B1F3A] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo Header */}
          <div className="text-center mb-8">
            <BrandLogo
              className="justify-center"
              logoClassName="h-20 w-20"
              textClassName="text-3xl text-white"
            />
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-300">DefenceFit</p>
          </div>

          {/* Login Card */}
          <Card className="p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#0B1F3A] mb-2">
                Admin Sign In
              </h2>
              <p className="text-gray-600 text-sm">
                Enter your credentials to access the admin dashboard
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2E4A3F] hover:bg-[#0B1F3A] text-white py-6 text-lg group"
              >
                {isSubmitting ? "Signing In..." : "Sign In to Dashboard"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <a
                  href="/"
                  className="text-gray-500 hover:text-gray-700 inline-flex items-center gap-1"
                >
                  ← Back to Site
                </a>
                <a
                  href="#"
                  className="text-[#2E4A3F] hover:text-[#0B1F3A] font-medium"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-300">
              🔒 This is a secure admin area. All actions are logged.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
