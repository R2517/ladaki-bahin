import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, IndianRupee, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

const Wallet = () => {
  const { profile, refreshProfile } = useAuth();
  const { rechargeWallet, verifyPayment } = useWallet();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [recharging, setRecharging] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [profile]);

  const handleRecharge = async () => {
    const amount = Number(rechargeAmount);
    if (!amount || amount <= 0) {
      toast.error("कृपया वैध रक्कम टाका");
      return;
    }

    setRecharging(true);
    const orderData = await rechargeWallet(amount);
    if (!orderData) {
      setRecharging(false);
      return;
    }

    // Load Razorpay script if not loaded
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      await new Promise((resolve) => { script.onload = resolve; });
    }

    const options = {
      key: orderData.key_id,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "SETU Suvidha",
      description: `वॉलेट रिचार्ज - ₹${amount}`,
      order_id: orderData.order_id,
      handler: async (response: any) => {
        const result = await verifyPayment(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature,
          amount,
          "wallet_recharge"
        );
        if (result.success) {
          setDialogOpen(false);
          setRechargeAmount("");
          fetchTransactions();
        }
        setRecharging(false);
      },
      prefill: {
        email: profile?.email || "",
        contact: profile?.mobile || "",
      },
      theme: { color: "#0d9488" },
      modal: {
        ondismiss: () => { setRecharging(false); },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Razorpay चालू करता आलं नाही");
      setRecharging(false);
    }
  };

  const fetchTransactions = async () => {
    if (!profile) return;
    const { data, error } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      toast.error("व्यवहार लोड करता आले नाहीत");
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          मागे जा
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <WalletIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">माझं वॉलेट</CardTitle>
                    <CardDescription>वॉलेट बॅलन्स आणि व्यवहार</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary flex items-center">
                <IndianRupee className="h-8 w-8" />
                {(profile?.wallet_balance ?? 0).toLocaleString("en-IN")}
              </div>
              <p className="text-muted-foreground mt-1">उपलब्ध शिल्लक</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">रिचार्ज करा</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <Plus className="mr-2 h-4 w-4" />
                    वॉलेट रिचार्ज
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>वॉलेट रिचार्ज करा</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-3 gap-2">
                      {PRESET_AMOUNTS.map((amt) => (
                        <Button
                          key={amt}
                          variant={rechargeAmount === String(amt) ? "default" : "outline"}
                          onClick={() => setRechargeAmount(String(amt))}
                        >
                          ₹{amt}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">₹</span>
                      <Input
                        type="number"
                        placeholder="रक्कम टाका"
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                        min="1"
                      />
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      disabled={recharging || !rechargeAmount || Number(rechargeAmount) <= 0}
                      onClick={handleRecharge}
                    >
                      {recharging ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <>
                          <IndianRupee className="mr-2 h-4 w-4" />
                          ₹{rechargeAmount || 0} Razorpay ने भरा
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">व्यवहार इतिहास</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                अद्याप कोणतेही व्यवहार नाहीत
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>तारीख</TableHead>
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
                      <TableCell>{tx.description || "-"}</TableCell>
                      <TableCell>
                        {tx.type === "credit" ? (
                          <Badge variant="default" className="bg-green-600">
                            <ArrowUpCircle className="h-3 w-3 mr-1" />
                            जमा
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <ArrowDownCircle className="h-3 w-3 mr-1" />
                            खर्च
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wallet;
