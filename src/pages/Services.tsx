import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import {
  FileText, Shield, AlertTriangle, FilePlus, Users, Award,
  CreditCard, Vote, HardHat, BookOpen, Globe, Scale,
  ArrowRight, CheckCircle2, Printer, Clock, IndianRupee,
} from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "हमीपत्र (Affidavit)",
    desc: "शासकीय कामांसाठी लागणारे हमीपत्र तयार करा. न्यायालय, शाळा प्रवेश, पासपोर्ट, जमीन व्यवहार आणि इतर सरकारी कामांसाठी हमीपत्र एका क्लिकवर तयार करा.",
    features: ["मराठी आणि इंग्रजी भाषेत", "कस्टम मजकूर जोडा", "A4 प्रिंट-रेडी", "ग्राहक डेटा सेव्ह"],
    color: "from-blue-500 to-blue-600",
    price: "₹30 पासून",
    path: "/hamipatra",
  },
  {
    icon: Shield,
    title: "स्वयंघोषणापत्र (Self Declaration)",
    desc: "विविध शासकीय योजना, शिष्यवृत्ती, रेशन कार्ड आणि इतर कामांसाठी आवश्यक स्वयंघोषणापत्र फॉर्म डिजिटली भरा.",
    features: ["प्रमाणित फॉर्मॅट", "ऑटो-फिल सपोर्ट", "प्रिंट आणि डाउनलोड", "इतिहास सेव्ह"],
    color: "from-emerald-500 to-emerald-600",
    price: "₹30 पासून",
    path: "/self-declaration",
  },
  {
    icon: AlertTriangle,
    title: "तक्रार अर्ज (Grievance Application)",
    desc: "सरकारी कार्यालये, ग्रामपंचायत, नगरपालिका आणि विविध विभागांकडे तक्रार नोंदवण्यासाठी प्रमाणित तक्रार अर्ज तयार करा.",
    features: ["विभागनिहाय टेम्पलेट", "तक्रार क्रमांक", "प्रिंट-रेडी", "ट्रॅकिंग"],
    color: "from-amber-500 to-orange-600",
    price: "₹30 पासून",
    path: "/grievance",
  },
  {
    icon: FilePlus,
    title: "नवीन अर्ज (New Application)",
    desc: "विविध शासकीय योजना, अनुदान, सबसिडी आणि सरकारी सेवांसाठी नवीन अर्ज भरा. सर्व प्रकारच्या अर्जांचे टेम्पलेट उपलब्ध.",
    features: ["योजना-निहाय फॉर्म", "डॉक्युमेंट चेकलिस्ट", "ड्राफ्ट सेव्ह", "ऑटो-फिल"],
    color: "from-purple-500 to-purple-600",
    price: "₹50 पासून",
    path: "/new-application",
  },
  {
    icon: Users,
    title: "जात पडताळणी (Caste Validity)",
    desc: "जात प्रमाणपत्र पडताळणी अर्ज, जात वैधता प्रमाणपत्र फॉर्म आणि संबंधित कागदपत्रे तयार करा. शिक्षण, नोकरी आणि शासकीय योजनांसाठी.",
    features: ["जात प्रमाणपत्र फॉर्म", "वैधता अर्ज", "कागदपत्र यादी", "प्रिंट-रेडी"],
    color: "from-pink-500 to-rose-600",
    price: "₹50 पासून",
    path: "/caste-validity",
  },
  {
    icon: Award,
    title: "उत्पन्न प्रमाणपत्र (Income Certificate)",
    desc: "उत्पन्नाचे स्वयंघोषणापत्र, उत्पन्न प्रमाणपत्र अर्ज आणि संबंधित फॉर्म्स. शिष्यवृत्ती, EWS, शासकीय योजना आणि शैक्षणिक प्रवेशासाठी.",
    features: ["उत्पन्न स्वयंघोषणा", "तहसीलदार फॉर्म", "EWS प्रमाणपत्र", "ऑटो कॅल्क्युलेशन"],
    color: "from-teal-500 to-cyan-600",
    price: "₹50 पासून",
    path: "/income-cert",
  },
  {
    icon: CreditCard,
    title: "PAN Card अर्ज",
    desc: "नवीन PAN कार्ड अर्ज (49A/49AA), PAN कार्ड दुरुस्ती, नाव बदल आणि पत्ता बदल अर्ज. ऑनलाइन फॉर्म भरा, प्रिंट करा.",
    features: ["नवीन PAN अर्ज (49A)", "दुरुस्ती/बदल अर्ज", "फोटो आणि साइन अपलोड", "ट्रॅकिंग"],
    color: "from-indigo-500 to-indigo-600",
    price: "₹100 पासून",
    path: "/pan-card",
  },
  {
    icon: Vote,
    title: "Voter ID Card अर्ज",
    desc: "नवीन मतदार ओळखपत्र अर्ज (Form 6), पत्ता बदल (Form 8A), नाव दुरुस्ती आणि ऑनलाइन अर्ज. निवडणूक आयोगाच्या प्रमाणित फॉर्मॅटमध्ये.",
    features: ["Form 6 — नवीन नोंदणी", "Form 8A — बदल/दुरुस्ती", "फोटो अपलोड", "प्रिंट-रेडी"],
    color: "from-red-500 to-red-600",
    price: "₹100 पासून",
    path: "/voter-id",
  },
  {
    icon: HardHat,
    title: "बांधकाम कामगार नोंदणी (BOCW)",
    desc: "महाराष्ट्र बांधकाम कामगार कल्याण मंडळ (MahaBOCW) अंतर्गत नोंदणी फॉर्म, नूतनीकरण आणि योजना अर्ज. 17+ कल्याणकारी योजनांचे व्यवस्थापन.",
    features: ["नवीन नोंदणी", "नूतनीकरण", "योजना ट्रॅकिंग", "एक्सपायरी अलर्ट"],
    color: "from-yellow-500 to-amber-600",
    price: "₹50 पासून",
    path: "/bandkam-kamgar",
  },
  {
    icon: BookOpen,
    title: "राजपत्र — मराठी (Gazette Marathi)",
    desc: "मराठी राजपत्र शपथपत्र — नाव बदल, धर्म बदल, जन्मतारीख दुरुस्ती इत्यादींसाठी मराठी भाषेतील प्रमाणित राजपत्र शपथपत्र.",
    features: ["नाव बदल शपथपत्र", "धर्म बदल", "जन्मतारीख दुरुस्ती", "प्रमाणित फॉर्मॅट"],
    color: "from-sky-500 to-blue-600",
    price: "₹80 पासून",
    path: "/rajpatra-marathi",
  },
  {
    icon: Globe,
    title: "राजपत्र — English (Gazette English)",
    desc: "English Gazette Affidavit for name change, religion change, date of birth correction. Standard government format, print-ready.",
    features: ["Name Change Affidavit", "Religion Change", "DOB Correction", "Standard Format"],
    color: "from-lime-500 to-green-600",
    price: "₹80 पासून",
    path: "/rajpatra-english",
  },
  {
    icon: Scale,
    title: "राजपत्र ७/१२ (Gazette 7/12)",
    desc: "राजपत्र शपथपत्र 7/12 उतारा — जमीन मालकी, फेरफार नोंद आणि 7/12 संबंधित शपथपत्र. शेतकरी आणि जमीन मालकांसाठी.",
    features: ["7/12 शपथपत्र", "फेरफार नोंद", "जमीन मालकी", "तलाठी फॉर्म"],
    color: "from-fuchsia-500 to-purple-600",
    price: "₹80 पासून",
    path: "/rajpatra-affidavit-712",
  },
];

const highlights = [
  { icon: Printer, text: "एका क्लिकवर प्रिंट" },
  { icon: Clock, text: "24/7 उपलब्ध" },
  { icon: IndianRupee, text: "₹30 पासून सुरू" },
  { icon: Shield, text: "डेटा सुरक्षित" },
];

const ServicesPage = () => {
  useEffect(() => {
    document.title = "आमच्या सेवा — सर्व सरकारी फॉर्म्स | SETU Suvidha सेतु सुविधा";
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
            आमच्या <span className="text-amber-200">सेवा</span> — सर्व सरकारी फॉर्म्स एकाच ठिकाणी
          </h1>
          <p className="text-lg sm:text-xl text-amber-100 max-w-3xl mx-auto mb-8">
            SETU Suvidha वर 12+ प्रकारचे सरकारी फॉर्म्स उपलब्ध आहेत. हमीपत्र, राजपत्र, उत्पन्न प्रमाणपत्र, PAN Card, Voter ID, बांधकाम कामगार नोंदणी आणि बरेच काही — सर्व डिजिटली भरा, प्रिंट करा.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {highlights.map((h) => (
              <div key={h.text} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-sm font-medium">
                <h.icon className="h-4 w-4" />
                {h.text}
              </div>
            ))}
          </div>
          <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 h-13 px-8 text-base font-semibold shadow-lg" asChild>
            <Link to="/signup">
              मोफत नोंदणी करा
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              सर्व <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">12+ सेवा</span> तपशीलवार
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              प्रत्येक सेवेचा तपशील, किंमत आणि वैशिष्ट्ये पहा
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((svc) => (
              <div key={svc.title} className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-900/50 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-amber-200 dark:hover:border-amber-800 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <svc.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold">{svc.title}</h3>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">{svc.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{svc.desc}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {svc.features.map((f) => (
                    <div key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Pricing Works */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            शुल्क कसे <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">काम करते?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <div className="text-3xl font-extrabold text-amber-600 mb-2">01</div>
              <h3 className="font-semibold mb-1">वॉलेट रिचार्ज</h3>
              <p className="text-sm text-muted-foreground">Razorpay ने UPI, कार्ड किंवा नेट बँकिंगने वॉलेट रिचार्ज करा</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <div className="text-3xl font-extrabold text-amber-600 mb-2">02</div>
              <h3 className="font-semibold mb-1">फॉर्म भरा</h3>
              <p className="text-sm text-muted-foreground">ग्राहकाची माहिती भरा. शुल्क आपोआप वॉलेट मधून कापले जाते</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <div className="text-3xl font-extrabold text-amber-600 mb-2">03</div>
              <h3 className="font-semibold mb-1">प्रिंट करा</h3>
              <p className="text-sm text-muted-foreground">तयार फॉर्म एका क्लिकवर प्रिंट करा. कधीही पुन्हा प्रिंट करा</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">आजच सुरू करा!</h2>
          <p className="text-amber-100 text-lg mb-8">मोफत नोंदणी करा आणि सर्व सेवा वापरायला सुरुवात करा.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 h-13 px-8 text-base font-semibold" asChild>
              <Link to="/signup">मोफत नोंदणी करा <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-13 px-8 text-base" asChild>
              <Link to="/contact">संपर्क करा</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* SEO Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "SETU Suvidha सेवा — सरकारी फॉर्म्स",
        description: "महाराष्ट्रातील सेतु केंद्र, CSC केंद्रांसाठी सर्व सरकारी फॉर्म सेवा",
        numberOfItems: services.length,
        itemListElement: services.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.title,
          description: s.desc,
        })),
      })}} />
    </div>
  );
};

export default ServicesPage;
