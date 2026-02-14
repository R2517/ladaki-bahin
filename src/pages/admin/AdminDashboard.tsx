import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, IndianRupee, FileText, RefreshCw } from "lucide-react";

const fetchAdminStats = async () => {
  const [profilesRes, formsRes, walletRes] = await Promise.all([
    supabase.from("profiles").select("id, is_active"),
    supabase.from("form_submissions").select("id", { count: "exact", head: true }),
    supabase.from("wallet_transactions").select("amount, type").eq("type", "credit"),
  ]);

  const profiles = profilesRes.data || [];
  const totalForms = formsRes.count || 0;
  const totalRevenue = (walletRes.data || [])
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

  return {
    totalVles: profiles.length,
    activeVles: profiles.filter((p: any) => p.is_active).length,
    totalRevenue,
    totalForms,
  };
};

const AdminDashboard = () => {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: fetchAdminStats,
    staleTime: 5 * 60 * 1000, // 5 min cache
    refetchOnWindowFocus: false,
  });

  const s = stats || { totalVles: 0, activeVles: 0, totalRevenue: 0, totalForms: 0 };

  const statCards = [
    { label: "एकूण VLE", value: s.totalVles, icon: Users, color: "text-blue-600" },
    { label: "सक्रिय VLE", value: s.activeVles, icon: Users, color: "text-green-600" },
    { label: "एकूण महसूल (₹)", value: `₹${s.totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-emerald-600" },
    { label: "एकूण फॉर्म", value: s.totalForms, icon: FileText, color: "text-purple-600" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin डॅशबोर्ड</h1>
          <button onClick={() => refetch()} className="p-2 rounded-md hover:bg-muted" title="Refresh">
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        {isLoading ? (
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
