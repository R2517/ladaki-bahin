import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, UserPlus, Landmark, ArrowLeft, Wallet, BarChart3, Zap } from "lucide-react";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "मोफत नोंदणी करा — SETU Suvidha";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("कृपया सर्व माहिती भरा");
      return;
    }

    if (password.length < 6) {
      toast.error("पासवर्ड किमान ६ अक्षरांचा असावा");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("पासवर्ड जुळत नाही");
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email, password, fullName);
    setIsLoading(false);

    if (error) {
      toast.error(error.message || "खातं तयार करता आलं नाही");
    } else {
      toast.success("खातं यशस्वीरित्या तयार झालं! कृपया लॉगिन करा.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-32 right-20 w-72 h-72 bg-white/5 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-32 left-10 w-64 h-64 bg-teal-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl">
            <Landmark size={32} className="text-white" />
          </div>
          <h2 className="text-4xl font-extrabold mb-3 text-center">SETU Suvidha</h2>
          <p className="text-emerald-100 text-lg mb-12 text-center max-w-sm">
            तुमचं सेतु/CSC केंद्र डिजिटल करा — मोफत!
          </p>

          <div className="space-y-4 w-full max-w-xs">
            {[
              { icon: Wallet, text: "वॉलेट सिस्टम — सोपे बिलिंग" },
              { icon: BarChart3, text: "ग्राहक व्यवस्थापन आणि रिपोर्ट्स" },
              { icon: Zap, text: "मोबाईल आणि कॉम्प्युटर दोन्हीवर" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <item.icon className="h-5 w-5 text-emerald-200 flex-shrink-0" />
                <span className="text-sm text-emerald-50">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Signup form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            मुख्यपृष्ठावर जा
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Landmark size={20} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">SETU Suvidha</span>
              <span className="block text-xs text-muted-foreground">सेतू सुविधा — ई-सेवा पोर्टल</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">मोफत नोंदणी करा</h1>
          <p className="text-muted-foreground mb-8">VLE म्हणून नवीन खातं तयार करा</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">पूर्ण नाव</Label>
              <Input id="fullName" type="text" placeholder="तुमचं पूर्ण नाव" value={fullName} onChange={(e) => setFullName(e.target.value)} required autoComplete="name" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">ईमेल</Label>
              <Input id="email" type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">पासवर्ड</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="किमान ६ अक्षरे" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" className="h-11 pr-11" />
                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">पासवर्ड पुन्हा टाका</Label>
              <Input id="confirmPassword" type="password" placeholder="पासवर्ड पुन्हा टाका" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" className="h-11" />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-lg shadow-teal-500/25 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  खातं तयार करा
                </>
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            आधीच खातं आहे?{" "}
            <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold hover:underline">
              लॉगिन करा
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-xs text-muted-foreground">
              नोंदणी करून तुम्ही आमच्या{" "}
              <Link to="/terms" className="text-teal-600 hover:underline">अटी</Link> आणि{" "}
              <Link to="/privacy" className="text-teal-600 hover:underline">गोपनीयता धोरण</Link> मान्य करता.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
