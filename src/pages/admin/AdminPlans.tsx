import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, CreditCard, Pencil } from "lucide-react";

const AdminPlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<any>(null);
  const [form, setForm] = useState({ name: "", price: "", duration_days: "30" });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .order("price");

    if (error) {
      toast.error("प्लॅन लोड करता आले नाहीत");
    } else {
      setPlans(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration_days) {
      toast.error("कृपया सर्व माहिती भरा");
      return;
    }

    if (editPlan) {
      const { error } = await supabase
        .from("subscription_plans")
        .update({
          name: form.name,
          price: parseFloat(form.price),
          duration_days: parseInt(form.duration_days),
        })
        .eq("id", editPlan.id);

      if (error) {
        toast.error("प्लॅन अपडेट करता आला नाही");
      } else {
        toast.success("प्लॅन अपडेट झाला!");
      }
    } else {
      const { error } = await supabase
        .from("subscription_plans")
        .insert({
          name: form.name,
          price: parseFloat(form.price),
          duration_days: parseInt(form.duration_days),
        });

      if (error) {
        toast.error("प्लॅन तयार करता आला नाही");
      } else {
        toast.success("नवीन प्लॅन तयार झाला!");
      }
    }

    setDialogOpen(false);
    setEditPlan(null);
    setForm({ name: "", price: "", duration_days: "30" });
    fetchPlans();
  };

  const openEdit = (plan: any) => {
    setEditPlan(plan);
    setForm({
      name: plan.name,
      price: String(plan.price),
      duration_days: String(plan.duration_days),
    });
    setDialogOpen(true);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("subscription_plans")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      toast.error("स्टेटस बदलता आला नाही");
    } else {
      toast.success(`प्लॅन ${!currentStatus ? "सक्रिय" : "निष्क्रिय"} केला`);
      fetchPlans();
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">सबस्क्रिप्शन प्लॅन</h1>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) { setEditPlan(null); setForm({ name: "", price: "", duration_days: "30" }); }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                नवीन प्लॅन
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editPlan ? "प्लॅन संपादित करा" : "नवीन प्लॅन तयार करा"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>प्लॅन नाव</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Basic, Pro, Enterprise"
                  />
                </div>
                <div className="space-y-2">
                  <Label>किंमत (₹)</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="999"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>कालावधी (दिवस)</Label>
                  <Input
                    type="number"
                    value={form.duration_days}
                    onChange={(e) => setForm({ ...form, duration_days: e.target.value })}
                    placeholder="30"
                    min="1"
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editPlan ? "अपडेट करा" : "तयार करा"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : plans.length === 0 ? (
          <Card className="shadow-md">
            <CardContent className="py-12 text-center text-muted-foreground">
              अद्याप कोणतेही प्लॅन नाहीत. नवीन प्लॅन तयार करा.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card key={plan.id} className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                  </div>
                  <Badge variant={plan.is_active ? "default" : "destructive"}>
                    {plan.is_active ? "सक्रिय" : "निष्क्रिय"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">₹{Number(plan.price).toLocaleString("en-IN")}</div>
                  <p className="text-muted-foreground text-sm mb-4">{plan.duration_days} दिवस</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(plan)}>
                      <Pencil className="h-3 w-3 mr-1" /> संपादित
                    </Button>
                    <Button
                      size="sm"
                      variant={plan.is_active ? "destructive" : "default"}
                      onClick={() => toggleActive(plan.id, plan.is_active)}
                    >
                      {plan.is_active ? "निष्क्रिय" : "सक्रिय"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPlans;
