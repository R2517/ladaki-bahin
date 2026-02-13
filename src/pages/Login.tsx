import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, Landmark, ArrowLeft, FileText, Shield, Users } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "लॉगिन — SETU Suvidha";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("कृपया ईमेल आणि पासवर्ड टाका");
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      toast.error(error.message || "लॉगिन अयशस्वी झाले");
    } else {
      toast.success("लॉगिन यशस्वी!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 overflow-hidden">
        {/* Animated shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-300/5 rounded-full blur-3xl" />
        </div>
        {/* Grid dots */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl">
            <Landmark size={32} className="text-white" />
          </div>
          <h2 className="text-4xl font-extrabold mb-3 text-center">SETU Suvidha</h2>
          <p className="text-amber-100 text-lg mb-12 text-center max-w-sm">
            सेतू सुविधा — तुमच्या सरकारी कामांचा विश्वासू साथीदार
          </p>

          <div className="space-y-4 w-full max-w-xs">
            {[
              { icon: FileText, text: "12+ सरकारी फॉर्म्स एकाच ठिकाणी" },
              { icon: Shield, text: "सुरक्षित डेटा, SSL एन्क्रिप्शन" },
              { icon: Users, text: "5,000+ VLE केंद्रांचा विश्वास" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <item.icon className="h-5 w-5 text-amber-200 flex-shrink-0" />
                <span className="text-sm text-amber-50">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            मुख्यपृष्ठावर जा
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Landmark size={20} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">SETU Suvidha</span>
              <span className="block text-xs text-muted-foreground">सेतू सुविधा — ई-सेवा पोर्टल</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">लॉगिन करा</h1>
          <p className="text-muted-foreground mb-8">तुमच्या खात्यात लॉगिन करण्यासाठी माहिती भरा</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">ईमेल</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">पासवर्ड</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-11 pr-11"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/25 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  लॉगिन करा
                </>
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            खातं नाही?{" "}
            <Link to="/signup" className="text-amber-600 hover:text-amber-700 font-semibold hover:underline">
              मोफत नोंदणी करा
            </Link>
          </p>

          <div className="mt-10 pt-6 border-t text-center">
            <p className="text-xs text-muted-foreground">
              लॉगिन करून तुम्ही आमच्या{" "}
              <Link to="/terms" className="text-amber-600 hover:underline">अटी</Link> आणि{" "}
              <Link to="/privacy" className="text-amber-600 hover:underline">गोपनीयता धोरण</Link> मान्य करता.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
