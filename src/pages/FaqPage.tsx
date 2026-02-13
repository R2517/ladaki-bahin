import { useEffect } from "react";
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
  ArrowRight, HelpCircle, Wallet, FileText, Shield,
  CreditCard, Users, RefreshCw, Headphones, HardHat,
} from "lucide-react";

const categories = [
  {
    icon: HelpCircle,
    title: "सामान्य प्रश्न (General)",
    faqs: [
      { q: "SETU Suvidha म्हणजे काय?", a: "SETU Suvidha (सेतु सुविधा) हे महाराष्ट्रातील सेतु सुविधा केंद्र, CSC केंद्र आणि ई-सेवा दुकानदारांसाठी एक ऑनलाइन फॉर्म पोर्टल आहे. येथे तुम्ही सर्व सरकारी फॉर्म्स डिजिटली भरू शकता, प्रिंट करू शकता आणि ग्राहकांना देऊ शकता. 12+ प्रकारचे फॉर्म्स उपलब्ध आहेत." },
      { q: "SETU Suvidha कोण वापरू शकतो?", a: "सेतु सुविधा केंद्र (Setu Suvidha Kendra) संचालक, CSC (Common Service Center) केंद्र संचालक, ई-सेवा केंद्र दुकानदार, महा ई-सेवा केंद्र ऑपरेटर आणि कोणताही सरकारी सेवा एजंट SETU Suvidha वापरू शकतो." },
      { q: "SETU Suvidha वापरण्यासाठी काय लागते?", a: "फक्त इंटरनेट कनेक्शन असलेला मोबाईल, टॅबलेट किंवा कॉम्प्युटर लागतो. कोणतेही सॉफ्टवेअर इन्स्टॉल करण्याची गरज नाही — ब्राउझर मधूनच सर्व काम होते." },
      { q: "SETU Suvidha मोबाईलवर चालते का?", a: "होय! SETU Suvidha पूर्णपणे मोबाईल-फ्रेंडली आहे. मोबाईल, टॅबलेट आणि कॉम्प्युटर — कोणत्याही डिव्हाइसवर तुम्ही फॉर्म भरू शकता आणि प्रिंट करू शकता." },
      { q: "SETU Suvidha किती भाषांमध्ये उपलब्ध आहे?", a: "सध्या SETU Suvidha मराठी आणि इंग्रजी या दोन भाषांमध्ये उपलब्ध आहे. इंटरफेस मराठी मध्ये आहे, तर फॉर्म्स मराठी आणि इंग्रजी दोन्ही भाषांमध्ये भरता येतात." },
    ],
  },
  {
    icon: Users,
    title: "नोंदणी (Registration)",
    faqs: [
      { q: "नोंदणी मोफत आहे का?", a: "होय! नोंदणी पूर्णपणे मोफत आहे. तुम्हाला फक्त फॉर्म वापरताना वॉलेट बॅलन्स लागते. खाते तयार करणे, डॅशबोर्ड पाहणे आणि फीचर्स एक्सप्लोर करणे मोफत आहे." },
      { q: "नोंदणी कशी करायची?", a: "setusuvidha.com वर जा → 'मोफत नोंदणी करा' बटण क्लिक करा → तुमचे नाव, ईमेल आणि पासवर्ड टाका → खाते तयार! 30 सेकंदात खाते तयार होते." },
      { q: "नोंदणीसाठी कोणती कागदपत्रे लागतात?", a: "नोंदणीसाठी कोणतीही कागदपत्रे लागत नाहीत. फक्त एक वैध ईमेल पत्ता आणि पासवर्ड (किमान 6 अक्षरे) लागतो." },
      { q: "एका ईमेलवर एकापेक्षा जास्त खाती तयार करता येतात का?", a: "नाही. एका ईमेल पत्त्यावर फक्त एकच खाते तयार करता येते. वेगवेगळ्या केंद्रांसाठी वेगवेगळे ईमेल वापरा." },
    ],
  },
  {
    icon: Wallet,
    title: "वॉलेट आणि पेमेंट (Wallet & Payment)",
    faqs: [
      { q: "वॉलेट कसे रिचार्ज करायचे?", a: "डॅशबोर्ड मधून 'वॉलेट' वर जा → रिचार्ज रक्कम टाका → Razorpay पेमेंट गेटवे उघडेल → UPI, डेबिट कार्ड, क्रेडिट कार्ड किंवा नेट बँकिंगने पेमेंट करा. बॅलन्स तात्काळ अपडेट होते." },
      { q: "किमान किती रिचार्ज करता येते?", a: "किमान ₹100 पासून वॉलेट रिचार्ज करता येते. कोणतीही जास्तीत जास्त मर्यादा नाही." },
      { q: "पेमेंट सुरक्षित आहे का?", a: "होय! आम्ही Razorpay पेमेंट गेटवे वापरतो जे RBI-अनुमोदित आणि PCI DSS सुरक्षित आहे. तुमची बँक माहिती आमच्याकडे सेव्ह होत नाही." },
      { q: "वॉलेट रिचार्ज केल्यानंतर परतावा मिळतो का?", a: "वॉलेट रिचार्ज केल्यानंतर रक्कम non-refundable आहे. कारण ती रक्कम तुमच्या वॉलेटमध्ये जमा होते आणि फॉर्म भरण्यासाठी वापरली जाते. अधिक माहितीसाठी आमचे परतावा धोरण पहा." },
      { q: "वॉलेट बॅलन्स संपला तर काय?", a: "वॉलेट बॅलन्स संपल्यास तुम्ही फॉर्म भरू शकत नाही. तुम्हाला पुन्हा रिचार्ज करावे लागेल. आधीच भरलेले फॉर्म्स कधीही पुन्हा प्रिंट करता येतात." },
    ],
  },
  {
    icon: FileText,
    title: "फॉर्म्स आणि सेवा (Forms & Services)",
    faqs: [
      { q: "कोणकोणते फॉर्म्स उपलब्ध आहेत?", a: "हमीपत्र (Affidavit), स्वयंघोषणापत्र (Self Declaration), तक्रार अर्ज (Grievance), नवीन अर्ज, जात पडताळणी (Caste Validity), उत्पन्न प्रमाणपत्र (Income Certificate), PAN Card अर्ज, Voter ID अर्ज, बांधकाम कामगार (BOCW) नोंदणी, राजपत्र मराठी, राजपत्र English आणि राजपत्र 7/12." },
      { q: "प्रत्येक फॉर्मचे शुल्क किती?", a: "वेगवेगळ्या फॉर्म्सचे शुल्क वेगवेगळे आहे. साधारणपणे ₹30 ते ₹100 प्रति फॉर्म. हमीपत्र, स्वयंघोषणा — ₹30 पासून. PAN Card, Voter ID — ₹100 पासून. तपशीलवार किंमत डॅशबोर्ड मध्ये दिसते." },
      { q: "एकदा भरलेला फॉर्म पुन्हा प्रिंट करता येतो का?", a: "होय! एकदा भरलेला आणि शुल्क भरलेला फॉर्म कधीही पुन्हा प्रिंट करता येतो. कोणतेही अतिरिक्त शुल्क नाही." },
      { q: "फॉर्म PDF म्हणून डाउनलोड करता येतो का?", a: "होय! प्रत्येक फॉर्म PDF म्हणून डाउनलोड करता येतो. तुम्ही ऑफलाइन सेव्ह करू शकता किंवा ग्राहकाला WhatsApp वर पाठवू शकता." },
      { q: "नवीन फॉर्म्स कधी जोडले जातात?", a: "आम्ही नियमितपणे नवीन फॉर्म्स जोडतो. नवीन फॉर्म जोडल्यावर सर्व वापरकर्त्यांना नोटिफिकेशन मिळते. कोणत्या फॉर्मची गरज आहे ते आम्हाला कळवा!" },
    ],
  },
  {
    icon: Shield,
    title: "सुरक्षा आणि डेटा (Security & Data)",
    faqs: [
      { q: "माझा डेटा सुरक्षित आहे का?", a: "होय. आम्ही Supabase (PostgreSQL) वापरतो जे SSL एन्क्रिप्शन आणि Row Level Security (RLS) वापरते. तुमचा डेटा फक्त तुम्हालाच दिसतो — इतर कोणत्याही VLE ला किंवा आम्हालाही तुमचे ग्राहक डेटा दिसत नाहीत." },
      { q: "माझा डेटा कोणाशी शेअर केला जातो का?", a: "नाही! तुमचा डेटा कोणत्याही तृतीय पक्षाशी शेअर केला जात नाही. डेटा फक्त तुमच्या खात्यासाठी वापरला जातो." },
      { q: "पासवर्ड विसरलो तर?", a: "लॉगिन पेज वर 'पासवर्ड विसरलात?' लिंक वर क्लिक करा. तुमच्या ईमेलवर पासवर्ड रिसेट लिंक पाठवली जाईल." },
    ],
  },
  {
    icon: CreditCard,
    title: "किंमत आणि प्लॅन (Pricing)",
    faqs: [
      { q: "कोणते प्लॅन उपलब्ध आहेत?", a: "बेसिक (मोफत) — सर्व फॉर्म्स वापरा, प्रति फॉर्म शुल्क. प्रो (₹499/महिना) — कमी शुल्क दर, प्राधान्य सपोर्ट, बल्क प्रिंट, अॅडव्हान्स रिपोर्ट्स. एंटरप्राइज — कस्टम ब्रँडिंग, API ऍक्सेस, डेडिकेटेड सपोर्ट." },
      { q: "प्रो प्लॅन मध्ये काय वेगळे आहे?", a: "प्रो प्लॅन मध्ये कमी शुल्क दर (20-30% कमी), प्राधान्य सपोर्ट (24 तासात उत्तर), बल्क प्रिंट सुविधा, अॅडव्हान्स बिलिंग रिपोर्ट्स आणि ग्राहक अॅनालिटिक्स मिळतात." },
      { q: "प्लॅन बदलता येतो का?", a: "होय! तुम्ही कधीही बेसिक वरून प्रो किंवा प्रो वरून एंटरप्राइज वर अपग्रेड करू शकता. डाउनग्रेड पुढील बिलिंग सायकल पासून लागू होते." },
    ],
  },
  {
    icon: HardHat,
    title: "बांधकाम कामगार (BOCW)",
    faqs: [
      { q: "बांधकाम कामगार नोंदणी SETU Suvidha वर करता येते का?", a: "SETU Suvidha वर तुम्ही बांधकाम कामगार ग्राहकांचे डिजिटल व्यवस्थापन करू शकता — नोंदणी ट्रॅकिंग, योजना ट्रॅकिंग, पेमेंट रेकॉर्ड आणि एक्सपायरी अलर्ट्स. अधिक माहितीसाठी बांधकाम कामगार माहिती पेज पहा." },
      { q: "बांधकाम कामगार योजनांचे ट्रॅकिंग कसे करायचे?", a: "डॅशबोर्ड मधून बांधकाम कामगार सेक्शन वापरा. ग्राहकाची नोंदणी एंटर करा, योजना (Safety Kit, Essential Kit, Scholarship इ.) ट्रॅक करा, एक्सपायरी अलर्ट्स सेट करा आणि कमिशन रेकॉर्ड ठेवा." },
    ],
  },
  {
    icon: Headphones,
    title: "सपोर्ट (Support)",
    faqs: [
      { q: "कोणतीही अडचण आली तर काय करायचे?", a: "आमच्या संपर्क पेज वरून ईमेल पाठवा (support@setusuvidha.com) किंवा WhatsApp वर संपर्क करा. आम्ही 24 तासात उत्तर देतो. प्रो प्लॅन वापरकर्त्यांना प्राधान्य सपोर्ट मिळतो." },
      { q: "व्हिडिओ ट्युटोरिअल उपलब्ध आहेत का?", a: "होय! आम्ही YouTube वर मराठी व्हिडिओ ट्युटोरिअल तयार करत आहोत. लवकरच डॅशबोर्ड मध्ये हेल्प सेक्शन जोडले जाईल." },
      { q: "सूचना किंवा फीचर रिक्वेस्ट कसा करायचा?", a: "संपर्क पेज वरून किंवा support@setusuvidha.com वर ईमेल पाठवा. तुमच्या सूचना आम्हाला खूप मोलाच्या आहेत!" },
    ],
  },
  {
    icon: RefreshCw,
    title: "तांत्रिक (Technical)",
    faqs: [
      { q: "कोणते ब्राउझर सपोर्ट करतात?", a: "Google Chrome, Microsoft Edge, Firefox, Safari आणि Opera — सर्व आधुनिक ब्राउझर सपोर्ट करतात. सर्वोत्तम अनुभवासाठी Chrome किंवा Edge वापरा." },
      { q: "प्रिंटर कोणता लागतो?", a: "कोणताही A4 प्रिंटर वापरता येतो — Inkjet, Laser, Thermal. USB किंवा WiFi कनेक्टेड." },
      { q: "इंटरनेट बंद पडले तर डेटा गमावला जातो का?", a: "नाही! तुमचा डेटा क्लाउड सर्व्हर वर सेव्ह असतो. इंटरनेट पुन्हा आल्यावर तुम्ही कुठून सोडले होते तेथून सुरू करू शकता." },
    ],
  },
];

const FaqPage = () => {
  useEffect(() => {
    document.title = "वारंवार विचारले जाणारे प्रश्न (FAQ) — SETU Suvidha सेतु सुविधा";
  }, []);

  const allFaqs = categories.flatMap((c) => c.faqs);

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
          <HelpCircle className="h-14 w-14 mx-auto mb-6 text-amber-200" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6">
            वारंवार विचारले जाणारे <span className="text-amber-200">प्रश्न (FAQ)</span>
          </h1>
          <p className="text-lg sm:text-xl text-amber-100 max-w-3xl mx-auto">
            SETU Suvidha बद्दल तुमच्या सर्व प्रश्नांची उत्तरे. नोंदणी, वॉलेट, फॉर्म्स, सुरक्षा, किंमत आणि बरेच काही.
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          {categories.map((cat, ci) => (
            <div key={cat.title} className={ci > 0 ? "mt-12" : ""}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <cat.icon className="h-5 w-5 text-amber-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">{cat.title}</h2>
              </div>
              <Accordion type="single" collapsible className="space-y-3">
                {cat.faqs.map((faq, i) => (
                  <AccordionItem key={`${ci}-${i}`} value={`faq-${ci}-${i}`} className="border rounded-xl px-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 shadow-sm">
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
          ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-2xl mx-auto text-center">
          <Headphones className="h-12 w-12 mx-auto mb-4 text-amber-600" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">अजूनही प्रश्न आहेत?</h2>
          <p className="text-muted-foreground mb-6">
            तुमचा प्रश्न वर नसेल तर आम्हाला संपर्क करा. आम्ही 24 तासात उत्तर देतो.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/25 h-12 px-6" asChild>
              <Link to="/contact">संपर्क करा</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6" asChild>
              <Link to="/signup">मोफत नोंदणी करा</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* FAQPage Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: allFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      })}} />
    </div>
  );
};

export default FaqPage;
