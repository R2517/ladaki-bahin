import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  IndianRupee,
  CreditCard,
  ArrowLeftRight,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { label: "डॅशबोर्ड", path: "/admin", icon: LayoutDashboard },
  { label: "VLE व्यवस्थापन", path: "/admin/vles", icon: Users },
  { label: "फॉर्म किंमत", path: "/admin/pricing", icon: IndianRupee },
  { label: "सबस्क्रिप्शन प्लॅन", path: "/admin/plans", icon: CreditCard },
  { label: "व्यवहार", path: "/admin/transactions", icon: ArrowLeftRight },
  { label: "सेटिंग्ज", path: "/admin/settings", icon: Settings },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary">SETU Suvidha</h2>
        <p className="text-xs text-muted-foreground">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start ${isActive ? "font-semibold" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="space-y-2 pt-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          VLE Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start text-destructive" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          लॉगआउट
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
