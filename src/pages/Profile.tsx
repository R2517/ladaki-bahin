import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    shop_name: "",
    shop_type: "",
    mobile: "",
    address: "",
    district: "",
    taluka: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        shop_name: profile.shop_name || "",
        shop_type: profile.shop_type || "",
        mobile: profile.mobile || "",
        address: profile.address || "",
        district: profile.district || "",
        taluka: profile.taluka || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setIsLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        shop_name: form.shop_name || null,
        shop_type: form.shop_type || null,
        mobile: form.mobile || null,
        address: form.address || null,
        district: form.district || null,
        taluka: form.taluka || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    setIsLoading(false);

    if (error) {
      toast.error("प्रोफाइल अपडेट करता आलं नाही");
    } else {
      toast.success("प्रोफाइल यशस्वीरित्या अपडेट झालं!");
      await refreshProfile();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          मागे जा
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">माझी प्रोफाइल</CardTitle>
                <CardDescription>{profile?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">पूर्ण नाव *</Label>
                <Input
                  id="full_name"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="तुमचं पूर्ण नाव"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">मोबाइल नंबर</Label>
                <Input
                  id="mobile"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  placeholder="९८XXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shop_name">दुकान/सेंटर नाव</Label>
                <Input
                  id="shop_name"
                  value={form.shop_name}
                  onChange={(e) => setForm({ ...form, shop_name: e.target.value })}
                  placeholder="सेतू/CSC सेंटर नाव"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shop_type">दुकान प्रकार</Label>
                <Select
                  value={form.shop_type}
                  onValueChange={(val) => setForm({ ...form, shop_type: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="प्रकार निवडा" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="setu">सेतू सुविधा केंद्र</SelectItem>
                    <SelectItem value="csc">CSC केंद्र</SelectItem>
                    <SelectItem value="other">इतर</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">पत्ता</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="पूर्ण पत्ता"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">जिल्हा</Label>
                <Input
                  id="district"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  placeholder="जिल्हा"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taluka">तालुका</Label>
                <Input
                  id="taluka"
                  value={form.taluka}
                  onChange={(e) => setForm({ ...form, taluka: e.target.value })}
                  placeholder="तालुका"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleSave} disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    प्रोफाइल सेव्ह करा
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
