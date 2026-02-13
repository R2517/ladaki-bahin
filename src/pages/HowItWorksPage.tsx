import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import {
  UserPlus, FileEdit, Printer, Wallet, CreditCard, BarChart3,
  ArrowRight, CheckCircle2, Shield, Smartphone, Globe, Clock,
  RefreshCw, Download, Search, Bell,
} from "lucide-react";

const mainSteps = [
  {
    icon: UserPlus,
    step: "01",
    title: "मोफत नोंदणी करा",
    desc: "SETU Suvidha वर तुमचे खाते मोफत तयार करा. फक्त नाव, ईमेल आणि पासवर्ड लागतो.",
    details: [
      "30 सेकंदात खाते तयार होते",
      "ईमेल व्हेरिफिकेशन",
      "सेतु/CSC केंद्राची माहिती भरा",
      "तात्काळ डॅशबोर्ड ऍक्सेस",
    ],
  },
  {
    icon: Wallet,
    step: "02",
    title: "वॉलेट रिचार्ज करा",
    desc: "Razorpay पेमेंट गेटवे द्वारे तुमचे वॉलेट रिचार्ज करा. UPI, डेबिट कार्ड, क्रेडिट कार्ड किंवा नेट बँकिंग वापरा.",
    details: [
      "Razorpay सिक्युअर पेमेंट",
      "UPI, कार्ड, नेट बँकिंग सपोर्ट",
      "₹10 पासून रिचार्ज",
      "तात्काळ बॅलन्स अपडेट",
    ],
  },
  {
    icon: FileEdit,
    step: "03",
    title: "फॉर्म निवडा आणि भरा",
    desc: "डॅशबोर्ड मधून हवा तो फॉर्म निवडा. ग्राहकाची माहिती भरा — हमीपत्र, राजपत्र, उत्पन्न प्रमाणपत्र किंवा इतर कोणताही फॉर्म.",
    details: [
      "12+ प्रकारचे फॉर्म्स उपलब्ध",
      "मराठी आणि इंग्रजी भाषा",
      "ऑटो-सेव्ह ड्राफ्ट",
      "ग्राहक डेटा रिपीट वापर",
    ],
  },
  {
    icon: Printer,
    step: "04",
    title: "प्रिंट करा आणि द्या",
    desc: "तयार फॉर्म एका क्लिकवर प्रिंट करा. A4 पेपर वर प्रिंट-रेडी फॉर्मॅट. शुल्क आपोआप वॉलेट मधून कापले जाते.",
    details: [
      "एक-क्लिक प्रिंट",
      "A4 प्रिंट-रेडी",
      "PDF डाउनलोड",
      "कधीही पुन्हा प्रिंट",
    ],
  },
  {
    icon: BarChart3,
    step: "05",
    title: "बिलिंग ट्रॅक करा",
    desc: "प्रत्येक ग्राहकाचे फॉर्म, शुल्क आणि व्यवहार रेकॉर्ड आपोआप तयार होते. महिन्याचे रिपोर्ट पहा.",
    details: [
      "ऑटो बिलिंग रेकॉर्ड",
      "ग्राहक-निहाय इतिहास",
      "व्यवहार रिपोर्ट",
      "कमिशन ट्रॅकिंग",
    ],
  },
];

const platformFeatures = [
  { icon: Smartphone, title: "मोबाईल फ्रेंडली", desc: "मोबाईल, टॅबलेट आणि कॉम्प्युटर — कोणत्याही डिव्हाइसवर वापरा" },
  { icon: Shield, title: "SSL एन्क्रिप्शन", desc: "तुमचा आणि ग्राहकांचा डेटा पूर्णपणे एन्क्रिप्टेड आणि सुरक्षित" },
  { icon: Globe, title: "कुठूनही ऍक्सेस", desc: "इंटरनेट असेल तर कुठूनही — दुकान, घर किंवा बाहेर" },
  { icon: Clock, title: "24/7 उपलब्ध", desc: "रात्री-दिवस, सुट्टीच्या दिवशीही पोर्टल चालू असते" },
  { icon: RefreshCw, title: "ऑटो अपडेट्स", desc: "नवीन फॉर्म्स आणि फीचर्स आपोआप जोडले जातात" },
  { icon: Download, title: "PDF डाउनलोड", desc: "फॉर्म PDF म्हणून डाउनलोड करा — ऑफलाइन शेअर करा" },
  { icon: Search, title: "सर्च आणि फिल्टर", desc: "ग्राहक, फॉर्म आणि व्यवहार सहज शोधा" },
  { icon: Bell, title: "नोटिफिकेशन", desc: "नवीन अपडेट्स, एक्सपायरी अलर्ट्स आणि रिमाइंडर" },
];

const whoCanUse = [
  "सेतु सुविधा केंद्र (Setu Suvidha Kendra) संचालक",
  "CSC (Common Service Center) केंद्र संचालक",
  "ई-सेवा केंद्र दुकानदार",
  "महा ई-सेवा केंद्र ऑपरेटर",
  "ग्रामपंचायत डिजिटल सेवा केंद्र",
  "सरकारी सेवा एजंट",
];

const HowItWorksPage = () => {
  useEffect(() => {
    document.title = "कसे काम करते — SETU Suvidha पोर्टल कसे वापरायचे | सेतु सुविधा";
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
            SETU Suvidha <span className="text-amber-200">कसे काम करते?</span>
          </h1>
          <p className="text-lg sm:text-xl text-amber-100 max-w-3xl mx-auto mb-8">
            फक्त 5 सोप्या स्टेप्स मध्ये तुमचे सरकारी फॉर्म काम पूर्ण करा. नोंदणी करा, वॉलेट रिचार्ज करा, फॉर्म भरा, प्रिंट करा आणि ग्राहकाला द्या.
          </p>
          <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 h-13 px-8 text-base font-semibold shadow-lg" asChild>
            <Link to="/signup">आजच सुरू करा <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      {/* Steps Detail */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">5 सोप्या स्टेप्स</span> — तपशीलवार
            </h2>
          </div>

          <div className="space-y-8">
            {mainSteps.map((s, i) => (
              <div key={s.step} className={`flex flex-col md:flex-row gap-6 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 ${i % 2 === 0 ? "bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950" : "bg-white dark:bg-gray-950"}`}>
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl shadow-amber-500/20">
                    <s.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-amber-600 bg-amber-100 dark:bg-amber-950/30 px-2.5 py-0.5 rounded-full">STEP {s.step}</span>
                    <h3 className="text-xl font-bold">{s.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{s.desc}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {s.details.map((d) => (
                      <div key={d} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              प्लॅटफॉर्म <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">वैशिष्ट्ये</span>
            </h2>
            <p className="text-muted-foreground text-lg">तुमच्या सोयीसाठी अनेक फीचर्स</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {platformFeatures.map((f) => (
              <div key={f.title} className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div className="h-11 w-11 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-base font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Use */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            कोण <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">वापरू शकतो?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whoCanUse.map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-900/50 border border-gray-100 dark:border-gray-800">
                <CheckCircle2 className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <span className="text-sm sm:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">समजलं? आता सुरू करा!</h2>
          <p className="text-amber-100 text-lg mb-8">मोफत नोंदणी — 30 सेकंदात खाते तयार.</p>
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

      {/* SEO Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "SETU Suvidha पोर्टल कसे वापरायचे",
        description: "सेतु सुविधा पोर्टलवर सरकारी फॉर्म्स कसे भरायचे — 5 सोप्या स्टेप्स",
        step: mainSteps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: s.desc,
        })),
      })}} />
    </div>
  );
};

export default HowItWorksPage;
