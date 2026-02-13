import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserCheck, UserX } from "lucide-react";

const AdminVles = () => {
  const [vles, setVles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVles();
  }, []);

  const fetchVles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("VLE डेटा लोड करता आला नाही");
    } else {
      setVles(data || []);
    }
    setLoading(false);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("स्टेटस बदलता आला नाही");
    } else {
      toast.success(`VLE ${!currentStatus ? "सक्रिय" : "निष्क्रिय"} केला`);
      fetchVles();
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">VLE व्यवस्थापन</h1>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">सर्व VLE ({vles.length})</CardTitle>
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
                      <TableHead>नाव</TableHead>
                      <TableHead>ईमेल</TableHead>
                      <TableHead>दुकान</TableHead>
                      <TableHead>मोबाइल</TableHead>
                      <TableHead>जिल्हा</TableHead>
                      <TableHead className="text-right">वॉलेट (₹)</TableHead>
                      <TableHead>स्टेटस</TableHead>
                      <TableHead>कृती</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vles.map((vle) => (
                      <TableRow key={vle.id}>
                        <TableCell className="font-medium">{vle.full_name || "-"}</TableCell>
                        <TableCell>{vle.email}</TableCell>
                        <TableCell>{vle.shop_name || "-"}</TableCell>
                        <TableCell>{vle.mobile || "-"}</TableCell>
                        <TableCell>{vle.district || "-"}</TableCell>
                        <TableCell className="text-right">
                          ₹{Number(vle.wallet_balance).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={vle.is_active ? "default" : "destructive"}>
                            {vle.is_active ? "सक्रिय" : "निष्क्रिय"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={vle.is_active ? "destructive" : "default"}
                            onClick={() => toggleActive(vle.id, vle.is_active)}
                          >
                            {vle.is_active ? (
                              <><UserX className="h-3 w-3 mr-1" /> निष्क्रिय</>
                            ) : (
                              <><UserCheck className="h-3 w-3 mr-1" /> सक्रिय</>
                            )}
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

export default AdminVles;
