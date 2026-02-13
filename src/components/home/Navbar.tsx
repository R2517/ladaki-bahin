import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Landmark, Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "सेवा", href: "#services" },
    { label: "कसे काम करते", href: "#how-it-works" },
    { label: "फायदे", href: "#benefits" },
    { label: "FAQ", href: "#faq" },
    { label: "बांधकाम कामगार", href: "/bandkam-kamgar-info" },
    { label: "संपर्क", href: "/contact" },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow">
              <Landmark size={18} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                SETU Suvidha
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1 hidden sm:block">
                सेतु सुविधा — महा ई-सेवा पोर्टल
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">लॉगिन</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/25">
              <Link to="/signup">मोफत नोंदणी करा</Link>
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 animate-in slide-in-from-top-2">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="flex gap-3 pt-3 border-t">
              <Button variant="outline" className="flex-1" asChild>
                <Link to="/login">लॉगिन</Link>
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600" asChild>
                <Link to="/signup">नोंदणी करा</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
