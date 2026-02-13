import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, IndianRupee, FileText, CreditCard } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVles: 0,
    activeVles: 0,
    totalRevenue: 0,
    totalForms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [profilesRes, formsRes, walletRes] = await Promise.all([
        supabase.from("profiles").select("id, is_active"),
        supabase.from("form_submissions").select("id"),
        supabase.from("wallet_transactions").select("amount, type"),
      ]);

      const profiles = profilesRes.data || [];
      const forms = formsRes.data || [];
      const walletTxns = walletRes.data || [];

      const totalRevenue = walletTxns
        .filter((t: any) => t.type === "credit")
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

      setStats({
        totalVles: profiles.length,
        activeVles: profiles.filter((p: any) => p.is_active).length,
        totalRevenue,
        totalForms: forms.length,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
    setLoading(false);
  };

  const statCards = [
    { label: "एकूण VLE", value: stats.totalVles, icon: Users, color: "text-blue-600" },
    { label: "सक्रिय VLE", value: stats.activeVles, icon: Users, color: "text-green-600" },
    { label: "एकूण महसूल (₹)", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-emerald-600" },
    { label: "एकूण फॉर्म", value: stats.totalForms, icon: FileText, color: "text-purple-600" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Admin डॅशबोर्ड</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <Card key={card.label} className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </CardTitle>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
