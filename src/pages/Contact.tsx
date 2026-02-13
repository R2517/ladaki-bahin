import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  const [sending, setSending] = useState(false);

  useEffect(() => {
    document.title = "संपर्क — SETU Suvidha";
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success("तुमचा संदेश पाठवला गेला! आम्ही लवकरच संपर्क करू.");
      (e.target as HTMLFormElement).reset();
      setSending(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">संपर्क करा</span>
            </h1>
            <p className="text-muted-foreground text-lg">कोणतीही मदत लागल्यास आम्हाला संपर्क करा</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact info cards */}
            <div className="space-y-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">ईमेल</h3>
                    <p className="text-sm text-muted-foreground">support@setusuvidha.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">फोन</h3>
                    <p className="text-sm text-muted-foreground">+91 XXXXX XXXXX</p>
                    <p className="text-xs text-muted-foreground">सोम - शनि, सकाळी 10 - संध्याकाळी 6</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">पत्ता</h3>
                    <p className="text-sm text-muted-foreground">महाराष्ट्र, भारत</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact form */}
            <Card className="md:col-span-2 border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold mb-6">संदेश पाठवा</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">नाव *</Label>
                      <Input id="name" required placeholder="तुमचे नाव" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">ईमेल *</Label>
                      <Input id="email" type="email" required placeholder="तुमचा ईमेल" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">मोबाईल नंबर</Label>
                    <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">विषय *</Label>
                    <Input id="subject" required placeholder="विषय लिहा" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">संदेश *</Label>
                    <Textarea id="message" required placeholder="तुमचा संदेश लिहा..." rows={5} />
                  </div>
                  <Button type="submit" disabled={sending} className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700">
                    {sending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        पाठवा
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Link to="/" className="text-teal-600 hover:text-teal-700 text-sm font-medium">← मुख्यपृष्ठ</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
