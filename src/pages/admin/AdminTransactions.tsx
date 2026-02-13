import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowUpCircle, ArrowDownCircle, ArrowLeftRight } from "lucide-react";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("wallet_transactions")
      .select("*, profiles:user_id(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      toast.error("व्यवहार लोड करता आले नाहीत");
      console.error(error);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">सर्व व्यवहार</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">एकूण जमा</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +₹{totalCredit.toLocaleString("en-IN")}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">एकूण खर्च</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                -₹{totalDebit.toLocaleString("en-IN")}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">एकूण व्यवहार</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-1">
                <ArrowLeftRight className="h-5 w-5" />
                {transactions.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">व्यवहार इतिहास</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">अद्याप कोणतेही व्यवहार नाहीत</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>तारीख</TableHead>
                      <TableHead>VLE</TableHead>
                      <TableHead>वर्णन</TableHead>
                      <TableHead>प्रकार</TableHead>
                      <TableHead className="text-right">रक्कम (₹)</TableHead>
                      <TableHead className="text-right">शिल्लक (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(tx.created_at).toLocaleDateString("mr-IN")}
                        </TableCell>
                        <TableCell>
                          {(tx.profiles as any)?.full_name || (tx.profiles as any)?.email || "-"}
                        </TableCell>
                        <TableCell>{tx.description || "-"}</TableCell>
                        <TableCell>
                          {tx.type === "credit" ? (
                            <Badge variant="default" className="bg-green-600">
                              <ArrowUpCircle className="h-3 w-3 mr-1" />जमा
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <ArrowDownCircle className="h-3 w-3 mr-1" />खर्च
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${tx.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                          {tx.type === "credit" ? "+" : "-"}₹{Math.abs(tx.amount).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{Number(tx.balance_after).toLocaleString("en-IN")}
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

export default AdminTransactions;
