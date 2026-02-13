import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import {
  Wallet, BarChart3, ShieldCheck, Clock, Headphones, Zap,
  ArrowRight, CheckCircle2, Smartphone, Globe, RefreshCw,
  Users, FileText, Printer, Lock, TrendingUp, IndianRupee,
  Layers, Database, CloudOff, Star,
} from "lucide-react";

const coreBenefits = [
  {
    icon: Wallet,
    title: "वॉलेट सिस्टम",
    desc: "प्रत्येक फॉर्मचे शुल्क आपोआप वॉलेट मधून कापले जाते. कॅश हाताळणी नाही, हिशोब आपोआप.",
    details: "Razorpay द्वारे UPI, डेबिट कार्ड, क्रेडिट कार्ड किंवा नेट बँकिंगने रिचार्ज करा. तात्काळ बॅलन्स अपडेट. सर्व व्यवहारांचा इतिहास उपलब्ध.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: BarChart3,
    title: "बिलिंग आणि रिपोर्टिंग",
    desc: "प्रत्येक ग्राहकाचे फॉर्म, शुल्क आणि व्यवहार रेकॉर्ड आपोआप तयार होते.",
    details: "महिन्याचे रिपोर्ट, ग्राहक-निहाय इतिहास, कमिशन ट्रॅकिंग आणि अॅडव्हान्स अॅनालिटिक्स. तुमच्या केंद्राचा पूर्ण हिशोब एकाच ठिकाणी.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: ShieldCheck,
    title: "सुरक्षित डेटा (Data Security)",
    desc: "Supabase वर एन्क्रिप्टेड डेटा. Row Level Security (RLS) ने प्रत्येक VLE चा डेटा स्वतंत्र.",
    details: "SSL एन्क्रिप्शन, PostgreSQL डेटाबेस, Row Level Security, रिअल-टाइम बॅकअप. तुमचा डेटा फक्त तुम्हालाच दिसतो — इतर कोणालाही नाही.",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: Clock,
    title: "वेळ वाचवा (Save Time)",
    desc: "एकदा फॉर्म भरा, कधीही प्रिंट करा. रेकॉर्ड कायम सेव्ह राहतो.",
    details: "ग्राहकाचा डेटा एकदा एंटर केला की पुढच्या वेळी ऑटो-फिल होतो. ड्राफ्ट सेव्ह, बल्क प्रिंट आणि रिपीट फॉर्म सुविधा.",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Headphones,
    title: "सपोर्ट टीम",
    desc: "कोणतीही अडचण आली तर आमची टीम मदतीसाठी तयार आहे.",
    details: "ईमेल सपोर्ट, WhatsApp सपोर्ट, ऑनलाइन हेल्प सेंटर आणि व्हिडिओ ट्युटोरिअल्स. प्रो प्लॅन वापरकर्त्यांना प्राधान्य सपोर्ट.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Zap,
    title: "वेगवान आणि विश्वासार्ह",
    desc: "मोबाईल आणि कॉम्प्युटर दोन्हीवर वेगाने चालते. कुठूनही वापरा.",
    details: "React + Vite टेक्नॉलॉजी — लाइटनिंग-फास्ट लोडिंग. CDN सर्व्हर, ऑप्टिमाइज्ड कोड आणि मॉडर्न ब्राउझर सपोर्ट.",
    color: "from-cyan-500 to-teal-600",
  },
];

const additionalBenefits = [
  { icon: Smartphone, title: "मोबाईल फ्रेंडली", desc: "मोबाईलवरून सहज फॉर्म भरा आणि प्रिंट करा" },
  { icon: Globe, title: "कुठूनही ऍक्सेस", desc: "इंटरनेट असेल तर कुठूनही काम करा" },
  { icon: RefreshCw, title: "ऑटो अपडेट", desc: "नवीन फॉर्म्स आपोआप जोडले जातात" },
  { icon: Users, title: "ग्राहक व्यवस्थापन", desc: "सर्व ग्राहकांचा रेकॉर्ड एकाच ठिकाणी" },
  { icon: FileText, title: "12+ फॉर्म प्रकार", desc: "सर्व महत्त्वाचे सरकारी फॉर्म्स उपलब्ध" },
  { icon: Printer, title: "एक-क्लिक प्रिंट", desc: "A4 प्रिंट-रेडी फॉर्मॅट, PDF डाउनलोड" },
  { icon: Lock, title: "SSL एन्क्रिप्शन", desc: "सर्व कनेक्शन एन्क्रिप्टेड आणि सुरक्षित" },
  { icon: TrendingUp, title: "बिझनेस ग्रोथ", desc: "डिजिटल सेवांनी अधिक ग्राहक मिळवा" },
  { icon: IndianRupee, title: "कमी खर्च", desc: "₹30 पासून फॉर्म — कमी गुंतवणूक, अधिक नफा" },
  { icon: Layers, title: "मल्टी-सर्व्हिस", desc: "एकाच प्लॅटफॉर्मवर सर्व सेवा" },
  { icon: Database, title: "क्लाउड स्टोरेज", desc: "डेटा क्लाउडवर सेव्ह — कधीही ऍक्सेस" },
  { icon: CloudOff, title: "डेटा कायम सेव्ह", desc: "तुमचा डेटा कधीही नष्ट होत नाही" },
];

const comparisons = [
  { feature: "फॉर्म टायपिंग", traditional: "हाताने 20-30 मिनिटे", setu: "2-3 मिनिटे डिजिटल" },
  { feature: "रेकॉर्ड कीपिंग", traditional: "कागदी फाइल्स, हरवण्याचा धोका", setu: "क्लाउड सेव्ह, कधीही ऍक्सेस" },
  { feature: "बिलिंग", traditional: "हाताने हिशोब, चुका होतात", setu: "ऑटो बिलिंग, अचूक रेकॉर्ड" },
  { feature: "पुन्हा प्रिंट", traditional: "पुन्हा सगळं टाइप करा", setu: "एका क्लिकवर री-प्रिंट" },
  { feature: "ग्राहक शोध", traditional: "फाइल्स मध्ये शोधा", setu: "सर्च बार — 1 सेकंद" },
  { feature: "खर्च", traditional: "प्रिंटर, शाई, कागद", setu: "₹30 पासून ऑल-इनक्लूसिव्ह" },
];

const BenefitsPage = () => {
  useEffect(() => {
    document.title = "फायदे — SETU Suvidha सेतु सुविधा केंद्रांसाठी विशेष फायदे";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-600 via-orange-600 to-yellow-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6">
            सेतु/CSC केंद्रांसाठी <span className="text-amber-200">विशेष फायदे</span>
          </h1>
          <p className="text-lg sm:text-xl text-amber-100 max-w-3xl mx-auto mb-8">
            SETU Suvidha वापरून तुमचे सेतु केंद्र, CSC केंद्र किंवा ई-सेवा दुकान पूर्णपणे डिजिटल करा. वेळ वाचवा, खर्च कमी करा आणि ग्राहकांना उत्तम सेवा द्या.
          </p>
          <div className="flex items-center justify-center gap-2 text-amber-200 text-sm mb-8">
            {[1,2,3,4,5].map((s) => <Star key={s} className="h-5 w-5 fill-amber-300 text-amber-300" />)}
            <span className="ml-2">5,000+ VLE केंद्रांचा विश्वास</span>
          </div>
          <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 h-13 px-8 text-base font-semibold shadow-lg" asChild>
            <Link to="/signup">मोफत नोंदणी करा <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      {/* Core Benefits */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              मुख्य <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">6 फायदे</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              तुमचे दुकान डिजिटल करा — ग्राहक व्यवस्थापन, बिलिंग आणि फॉर्म सगळं एकाच ठिकाणी
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreBenefits.map((b) => (
              <div key={b.title} className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-900/50 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-amber-200 dark:hover:border-amber-800 transition-all">
                <div className="flex items-start gap-4 mb-3">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <b.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{b.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{b.desc}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-16">{b.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Benefits Grid */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              आणखी <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">12+ फायदे</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {additionalBenefits.map((b) => (
              <div key={b.title} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                  <b.icon className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-sm font-semibold mb-1">{b.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              पारंपारिक vs <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">SETU Suvidha</span>
            </h2>
            <p className="text-muted-foreground">पहा किती फरक पडतो!</p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-amber-50 dark:bg-amber-950/20">
                  <th className="text-left px-5 py-3 font-semibold">वैशिष्ट्य</th>
                  <th className="text-center px-5 py-3 font-semibold text-red-600">पारंपारिक पद्धत</th>
                  <th className="text-center px-5 py-3 font-semibold text-amber-600">SETU Suvidha</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"}>
                    <td className="px-5 py-3 font-medium">{row.feature}</td>
                    <td className="px-5 py-3 text-center text-muted-foreground">{row.traditional}</td>
                    <td className="px-5 py-3 text-center font-semibold text-amber-600">{row.setu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">तुमचे केंद्र डिजिटल करा!</h2>
          <p className="text-amber-100 text-lg mb-8">मोफत नोंदणी करा आणि सर्व फायदे अनुभवा.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 h-13 px-8 text-base font-semibold" asChild>
              <Link to="/signup">मोफत नोंदणी करा <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-13 px-8 text-base" asChild>
              <Link to="/services">सेवा पहा</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BenefitsPage;
