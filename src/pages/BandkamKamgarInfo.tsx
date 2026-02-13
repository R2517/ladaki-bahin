import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HardHat, Shield, GraduationCap, Heart, Package, Calendar,
  FileText, Users, CheckCircle2, ArrowRight, ClipboardList,
  Wallet, Bell, Building2, Stethoscope, Home, Wrench,
  ChevronUp, BadgeIndianRupee, Baby, Flame, BookOpen,
} from "lucide-react";

/* ─── Data ─── */

const eligibility = [
  "वय: 18 ते 60 वर्षे",
  "मागील 12 महिन्यात किमान 90 दिवस बांधकाम कामगार म्हणून काम केलेले असावे",
  "90 दिवसांचे कामाचे प्रमाणपत्र (ठेकेदार/बिल्डर कडून)",
  "महाराष्ट्रातील रहिवासी असणे आवश्यक",
];

const documents = [
  { icon: FileText, name: "आधार कार्ड", desc: "ओळखपत्र म्हणून" },
  { icon: FileText, name: "PAN कार्ड", desc: "आर्थिक ओळख" },
  { icon: FileText, name: "रेशन कार्ड", desc: "कुटुंब ओळख" },
  { icon: FileText, name: "90 दिवस कामाचे प्रमाणपत्र", desc: "ठेकेदार/बिल्डर कडून" },
  { icon: FileText, name: "पासपोर्ट फोटो (2)", desc: "अलीकडील फोटो" },
  { icon: FileText, name: "वयाचा दाखला", desc: "जन्म प्रमाणपत्र / शाळा दाखला" },
  { icon: FileText, name: "रहिवासी दाखला", desc: "पत्ता पुरावा" },
  { icon: FileText, name: "बँक पासबुक", desc: "बँक खाते तपशील" },
];

const welfareSchemes = [
  {
    icon: Package,
    name: "सेफ्टी किट (Safety Kit)",
    desc: "बूट, हेल्मेट, हातमोजे, गॉगल्स इ. सुरक्षा साहित्य बांधकाम कामगारांना मोफत दिले जाते.",
    amount: "सुरक्षा साहित्य किट",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Home,
    name: "इसेन्शिअल किट (Essential Kit)",
    desc: "घरगुती वस्तू जसे की भांडी, बेडशीट, छत्री इ. आवश्यक वस्तूंचा किट.",
    amount: "घरगुती वस्तू किट",
    color: "from-teal-500 to-emerald-500",
  },
  {
    icon: GraduationCap,
    name: "शैक्षणिक शिष्यवृत्ती (Scholarship)",
    desc: "कामगारांच्या मुलांना इयत्ता 1ली ते इंजिनिअरिंग पर्यंत शिष्यवृत्ती. ₹2,500 ते ₹60,000 पर्यंत.",
    amount: "₹2,500 — ₹60,000",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Heart,
    name: "विवाह सहाय्य (Marriage Assistance)",
    desc: "कामगार किंवा त्यांच्या मुलींच्या पहिल्या विवाहासाठी आर्थिक सहाय्य.",
    amount: "₹30,000",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Baby,
    name: "मातृत्व लाभ (Maternity Benefit)",
    desc: "महिला बांधकाम कामगारांना गर्भधारणा व प्रसूती काळात आर्थिक मदत.",
    amount: "₹15,000",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: Shield,
    name: "मृत्यू लाभ (Death Benefit)",
    desc: "नैसर्गिक मृत्यू: ₹2,00,000 | अपघाती मृत्यू: ₹5,00,000 कुटुंबीयांना.",
    amount: "₹2L — ₹5L",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: BadgeIndianRupee,
    name: "PM जीवन ज्योती बिमा (PMJJBY)",
    desc: "₹2 लाख जीवन विमा कव्हर. वार्षिक प्रीमियम फक्त ₹436.",
    amount: "₹2,00,000 कव्हर",
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: Shield,
    name: "PM सुरक्षा बिमा (PMSBY)",
    desc: "₹2 लाख अपघात विमा कव्हर. वार्षिक प्रीमियम फक्त ₹20.",
    amount: "₹2,00,000 कव्हर",
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: BadgeIndianRupee,
    name: "PM श्रम योगी मानधन (PMSYM)",
    desc: "60 वर्षानंतर मासिक ₹3,000 पेन्शन. असंघटित कामगारांसाठी.",
    amount: "₹3,000/महिना पेन्शन",
    color: "from-yellow-500 to-amber-500",
  },
  {
    icon: Stethoscope,
    name: "वैद्यकीय सहाय्य (Medical Aid)",
    desc: "गंभीर आजारांवर उपचारासाठी आर्थिक मदत.",
    amount: "उपचार खर्च",
    color: "from-sky-500 to-blue-500",
  },
  {
    icon: Building2,
    name: "गृहनिर्माण सहाय्य (Housing)",
    desc: "बांधकाम कामगारांना घर बांधणी किंवा दुरुस्तीसाठी आर्थिक सहाय्य.",
    amount: "गृहनिर्माण मदत",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Flame,
    name: "अंत्यविधी सहाय्य (Funeral)",
    desc: "कामगाराच्या मृत्यूनंतर अंत्यविधी खर्चासाठी सहाय्य.",
    amount: "₹10,000",
    color: "from-gray-500 to-slate-500",
  },
  {
    icon: Wrench,
    name: "कौशल्य प्रशिक्षण (Skill Training)",
    desc: "बांधकाम कामगारांना नवीन कौशल्ये शिकण्यासाठी प्रशिक्षण कार्यक्रम.",
    amount: "मोफत प्रशिक्षण",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: BookOpen,
    name: "मध्यान्ह भोजन योजना (Mid-day Meal)",
    desc: "कामगारांच्या मुलांसाठी शालेय पोषण आहार योजना.",
    amount: "पोषण आहार",
    color: "from-lime-500 to-green-500",
  },
];

const portalFeatures = [
  { icon: ClipboardList, title: "डिजिटल नोंदणी ट्रॅकिंग", desc: "नवीन आणि नूतनीकरण नोंदण्या एकत्र ट्रॅक करा" },
  { icon: Bell, title: "ऑटो रिमाइंडर्स", desc: "Safety Kit, Essential Kit, Scholarship वेळापत्रक अलर्ट्स" },
  { icon: Wallet, title: "पेमेंट ट्रॅकिंग", desc: "प्रत्येक नोंदणीचे शुल्क आणि कमिशन कॅल्क्युलेशन" },
  { icon: Calendar, title: "एक्सपायरी मॉनिटरिंग", desc: "3 वर्षाच्या वैधतेची ट्रॅकिंग, वेळेवर नूतनीकरण" },
  { icon: Users, title: "ग्राहक प्रोफाइल", desc: "संपूर्ण ग्राहक इतिहास — नोंदणी, योजना, पेमेंट" },
  { icon: Building2, title: "जिल्हा/तालुका फिल्टरिंग", desc: "जिल्हा, तालुका, गाव निहाय ग्राहक फिल्टर करा" },
];

const faqs = [
  {
    q: "बांधकाम कामगार नोंदणी कशी करायची?",
    a: "MahaBOCW (महाराष्ट्र बांधकाम कामगार कल्याण मंडळ) कडे नोंदणी करण्यासाठी सेतू सुविधा केंद्र, CSC केंद्र किंवा ई-सेवा केंद्रात जा. आवश्यक कागदपत्रे सादर करा आणि नोंदणी शुल्क भरा. नोंदणी 3 वर्षांसाठी वैध असते.",
  },
  {
    q: "कोणकोणत्या योजना उपलब्ध आहेत?",
    a: "MahaBOCW अंतर्गत 17+ कल्याणकारी योजना उपलब्ध आहेत — Safety Kit, Essential Kit, शिष्यवृत्ती (₹2,500 ते ₹60,000), विवाह सहाय्य (₹30,000), मातृत्व लाभ (₹15,000), मृत्यू लाभ (₹2L-₹5L), PM बिमा योजना, वैद्यकीय सहाय्य, गृहनिर्माण, कौशल्य प्रशिक्षण इत्यादी.",
  },
  {
    q: "Safety Kit मध्ये काय मिळते?",
    a: "Safety Kit मध्ये सुरक्षा बूट, हेल्मेट, हातमोजे (ग्लोव्हज), सेफ्टी गॉगल्स आणि इतर सुरक्षा साहित्य समाविष्ट आहे. हे बांधकाम कामाच्या ठिकाणी सुरक्षिततेसाठी दिले जाते.",
  },
  {
    q: "Essential Kit मध्ये काय मिळते?",
    a: "Essential Kit मध्ये घरगुती वस्तू जसे की स्टील भांडी, बेडशीट, छत्री, चादर आणि इतर दैनंदिन गरजेच्या वस्तू समाविष्ट आहेत.",
  },
  {
    q: "Scholarship किती मिळते?",
    a: "शिष्यवृत्ती रक्कम शैक्षणिक स्तरानुसार बदलते: इयत्ता 1ली ते 7वी — ₹2,500, इयत्ता 8वी ते 10वी — ₹5,000, इयत्ता 11वी-12वी — ₹10,000, पदवी — ₹25,000, अभियांत्रिकी/वैद्यकीय — ₹60,000.",
  },
  {
    q: "नोंदणी कालावधी किती असतो?",
    a: "बांधकाम कामगार नोंदणी 3 वर्षांसाठी वैध असते. नोंदणी शुल्क ₹1 आणि वार्षिक वर्गणी ₹1 आहे (सध्या शासन निर्णयानुसार मोफत).",
  },
  {
    q: "नूतनीकरण कसे करायचे?",
    a: "नोंदणी कालबाह्य होण्यापूर्वी 30 दिवस आधी नूतनीकरण करता येते. सेतू सुविधा केंद्रात जाऊन आवश्यक कागदपत्रे आणि नूतनीकरण शुल्क भरून नूतनीकरण होते.",
  },
  {
    q: "सेतू सुविधा पोर्टलवर कसे manage करायचे?",
    a: "SETU Suvidha पोर्टलवर मोफत नोंदणी करा. बांधकाम कामगार सेक्शन मध्ये ग्राहकांची नोंदणी एंटर करा, योजना ट्रॅक करा, एक्सपायरी अलर्ट्स मिळवा आणि पेमेंट/कमिशन रेकॉर्ड ठेवा.",
  },
  {
    q: "नोंदणी शुल्क किती आहे?",
    a: "MahaBOCW नोंदणी शुल्क: ₹1 (एक रुपया) आणि वार्षिक वर्गणी: ₹1. सध्या शासन निर्णयानुसार हे शुल्क माफ आहे. सेतू संचालकाचे सेवा शुल्क वेगळे असू शकते.",
  },
  {
    q: "कोणत्या वयोगटातील कामगार नोंदणी करू शकतात?",
    a: "18 ते 60 वर्षे वयोगटातील बांधकाम कामगार नोंदणी करू शकतात. मागील 12 महिन्यात किमान 90 दिवस बांधकाम कामगार म्हणून काम केलेले असणे आवश्यक आहे.",
  },
];

const scholarshipTable = [
  { level: "इयत्ता 1ली ते 7वी", amount: "₹2,500" },
  { level: "इयत्ता 8वी ते 10वी", amount: "₹5,000" },
  { level: "इयत्ता 11वी — 12वी", amount: "₹10,000" },
  { level: "ITI / पॉलिटेक्निक", amount: "₹15,000" },
  { level: "पदवी (Graduation)", amount: "₹25,000" },
  { level: "पदव्युत्तर (Post-Graduation)", amount: "₹30,000" },
  { level: "अभियांत्रिकी / वैद्यकीय", amount: "₹60,000" },
];

/* ─── Component ─── */

const BandkamKamgarInfo = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    document.title = "बांधकाम कामगार योजना 2025 | नोंदणी, योजना, लाभ — SETU Suvidha";
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative bg-gradient-to-br from-amber-600 via-orange-600 to-yellow-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-sm font-medium mb-6">
            <HardHat className="h-4 w-4" />
            MahaBOCW — Building & Other Construction Workers Act, 1996
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            महाराष्ट्र बांधकाम कामगार योजना
            <br />
            <span className="text-amber-200">संपूर्ण माहिती 2025</span>
          </h1>
          <p className="text-lg sm:text-xl text-amber-100 max-w-3xl mx-auto mb-8">
            बांधकाम कामगार नोंदणी (Bandkam Kamgar Nondani), 17+ कल्याणकारी योजना, पात्रता, कागदपत्रे आणि SETU Suvidha पोर्टलवर कसे manage करायचे — सर्व माहिती एकाच ठिकाणी.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 h-13 px-8 text-base font-semibold shadow-lg" asChild>
              <Link to="/signup">
                मोफत नोंदणी करा
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-13 px-8 text-base" asChild>
              <a href="#schemes">योजना पहा</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── What is BOCW ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            MahaBOCW म्हणजे काय? — <span className="text-amber-600">बांधकाम कामगार कल्याण मंडळ</span>
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>
              <strong>महाराष्ट्र इमारत व इतर बांधकाम कामगार कल्याणकारी मंडळ (Maharashtra Building and Other Construction Workers Welfare Board — MahaBOCW)</strong> हे
              भारत सरकारच्या <em>Building and Other Construction Workers (Regulation of Employment and Conditions of Service) Act, 1996</em> अंतर्गत स्थापन करण्यात आलेले मंडळ आहे.
            </p>
            <p>
              या मंडळाचा मुख्य उद्देश बांधकाम क्षेत्रातील असंघटित कामगारांना सामाजिक सुरक्षा, आरोग्य सेवा, शिक्षण आणि इतर कल्याणकारी योजनांचा लाभ देणे हा आहे.
              महाराष्ट्रातील सर्व 36 जिल्ह्यांमधील बांधकाम कामगार या योजनेचा लाभ घेऊ शकतात.
            </p>
            <p>
              <strong>सेतू सुविधा केंद्र (Setu Suvidha Kendra)</strong>, CSC केंद्र आणि ई-सेवा केंद्रांचे संचालक या नोंदणी प्रक्रियेत महत्त्वाची भूमिका बजावतात.
              SETU Suvidha पोर्टल संचालकांना ग्राहकांची नोंदणी, योजना ट्रॅकिंग आणि कमिशन व्यवस्थापन करण्यास मदत करते.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Eligibility ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            नोंदणी पात्रता — <span className="text-amber-600">कोण नोंदणी करू शकतो?</span>
          </h2>
          <div className="grid gap-4">
            {eligibility.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm sm:text-base">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>नोंदणी शुल्क:</strong> ₹1 (एक रुपया) | <strong>वार्षिक वर्गणी:</strong> ₹1 — सध्या शासन निर्णयानुसार मोफत | <strong>वैधता:</strong> 3 वर्षे, नूतनीकरण करता येते.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Required Documents ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            आवश्यक कागदपत्रे — <span className="text-amber-600">Documents Required</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div key={doc.name} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-900/50 border border-gray-100 dark:border-gray-800">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <doc.icon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{doc.name}</div>
                  <div className="text-xs text-muted-foreground">{doc.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Welfare Schemes ─── */}
      <section id="schemes" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              सर्व कल्याणकारी योजना — <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">17+ Welfare Schemes</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              MahaBOCW अंतर्गत बांधकाम कामगारांना मिळणाऱ्या सर्व योजनांची संपूर्ण यादी.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {welfareSchemes.map((scheme) => (
              <div key={scheme.name} className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${scheme.color} flex items-center justify-center mb-4`}>
                  <scheme.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-semibold mb-2">{scheme.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{scheme.desc}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                  {scheme.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Scholarship Table ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            शिष्यवृत्ती रक्कम — <span className="text-amber-600">Scholarship Amounts</span>
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-amber-50 dark:bg-amber-950/20">
                  <th className="text-left px-5 py-3 font-semibold">शैक्षणिक स्तर</th>
                  <th className="text-right px-5 py-3 font-semibold">शिष्यवृत्ती रक्कम</th>
                </tr>
              </thead>
              <tbody>
                {scholarshipTable.map((row, i) => (
                  <tr key={row.level} className={i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"}>
                    <td className="px-5 py-3">{row.level}</td>
                    <td className="px-5 py-3 text-right font-semibold text-amber-600">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── How Setu Sanchalak Manages ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              SETU Suvidha पोर्टलवर कसे <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">manage करायचे?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              सेतू संचालकांसाठी बांधकाम कामगार ग्राहक व्यवस्थापन सोपे आणि डिजिटल.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portalFeatures.map((f) => (
              <div key={f.title} className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div className="h-11 w-11 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="text-base font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              वारंवार विचारले जाणारे <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">प्रश्न (FAQ)</span>
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-5 bg-white dark:bg-gray-950 shadow-sm">
                <AccordionTrigger className="text-left font-semibold text-sm sm:text-base hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <HardHat className="h-12 w-12 mx-auto mb-4 text-amber-200" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            आजच SETU Suvidha वर नोंदणी करा!
          </h2>
          <p className="text-amber-100 text-lg mb-8 max-w-xl mx-auto">
            तुमच्या सेतू/CSC केंद्रातील बांधकाम कामगार ग्राहकांचे डिजिटल व्यवस्थापन सुरू करा. मोफत नोंदणी.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 h-13 px-8 text-base font-semibold shadow-lg" asChild>
              <Link to="/signup">
                मोफत नोंदणी करा
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-13 px-8 text-base" asChild>
              <Link to="/login">लॉगिन करा</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Scroll to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full bg-amber-600 text-white shadow-lg hover:bg-amber-700 transition-colors flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      {/* FAQPage Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </div>
  );
};

export default BandkamKamgarInfo;
