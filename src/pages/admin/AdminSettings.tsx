import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">सेटिंग्ज</h1>

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">प्लॅटफॉर्म सेटिंग्ज</CardTitle>
                <CardDescription>SETU Suvidha प्लॅटफॉर्म कॉन्फिगरेशन</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">प्लॅटफॉर्म</p>
                <p className="text-sm text-muted-foreground">SETU Suvidha — setusuvidha.com</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">Supabase Project</p>
                <p className="text-sm text-muted-foreground">frfrfzhatedurmzhzopu</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">Payment Gateway</p>
                <p className="text-sm text-muted-foreground">Razorpay (लवकरच कॉन्फिगर होईल)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminSettings;
