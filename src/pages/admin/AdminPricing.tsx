import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, IndianRupee } from "lucide-react";

const AdminPricing = () => {
  const [pricing, setPricing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    const { data, error } = await supabase
      .from("form_pricing")
      .select("*")
      .order("form_name");

    if (error) {
      toast.error("किंमत डेटा लोड करता आला नाही");
    } else {
      setPricing(data || []);
    }
    setLoading(false);
  };

  const savePrice = async (id: string) => {
    const price = parseFloat(editPrice);
    if (isNaN(price) || price < 0) {
      toast.error("कृपया वैध किंमत टाका");
      return;
    }

    const { error } = await supabase
      .from("form_pricing")
      .update({ price, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("किंमत अपडेट करता आली नाही");
    } else {
      toast.success("किंमत अपडेट झाली!");
      setEditingId(null);
      fetchPricing();
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("form_pricing")
      .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("स्टेटस बदलता आला नाही");
    } else {
      toast.success(`फॉर्म ${!currentStatus ? "सक्रिय" : "निष्क्रिय"} केला`);
      fetchPricing();
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">फॉर्म किंमत व्यवस्थापन</h1>

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">प्रत्येक फॉर्मची किंमत</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>फॉर्म नाव</TableHead>
                      <TableHead>फॉर्म प्रकार</TableHead>
                      <TableHead className="text-right">किंमत (₹)</TableHead>
                      <TableHead>स्टेटस</TableHead>
                      <TableHead>कृती</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricing.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.form_name}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{item.form_type}</code>
                        </TableCell>
                        <TableCell className="text-right">
                          {editingId === item.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <Input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-24 text-right"
                                min="0"
                              />
                              <Button size="sm" onClick={() => savePrice(item.id)}>
                                <Save className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span
                              className="cursor-pointer hover:text-primary font-medium"
                              onClick={() => {
                                setEditingId(item.id);
                                setEditPrice(String(item.price));
                              }}
                            >
                              ₹{Number(item.price).toLocaleString("en-IN")}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.is_active ? "default" : "destructive"}>
                            {item.is_active ? "सक्रिय" : "निष्क्रिय"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleActive(item.id, item.is_active)}
                          >
                            {item.is_active ? "निष्क्रिय करा" : "सक्रिय करा"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPricing;
