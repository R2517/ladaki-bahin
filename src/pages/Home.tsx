import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import HowItWorks from "@/components/home/HowItWorks";
import BandkamKamgarSection from "@/components/home/BandkamKamgarSection";
import Footer from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Wallet, BarChart3, ShieldCheck, Clock, Headphones, Zap,
  ArrowRight, CheckCircle2,
} from "lucide-react";

const benefits = [
  { icon: Wallet, title: "वॉलेट सिस्टम", desc: "प्रत्येक फॉर्मचे शुल्क आपोआप वॉलेट मधून कापले जाते. Razorpay ने रिचार्ज करा." },
  { icon: BarChart3, title: "बिलिंग ट्रॅकिंग", desc: "प्रत्येक ग्राहकाचे फॉर्म, शुल्क आणि व्यवहार रेकॉर्ड ठेवा." },
  { icon: ShieldCheck, title: "सुरक्षित डेटा", desc: "Supabase वर एन्क्रिप्टेड डेटा. तुमचा आणि ग्राहकांचा डेटा पूर्णपणे सुरक्षित." },
  { icon: Clock, title: "वेळ वाचवा", desc: "एकदा फॉर्म भरा, कधीही प्रिंट करा. रेकॉर्ड कायम सेव्ह राहतो." },
  { icon: Headphones, title: "सपोर्ट", desc: "कोणतीही अडचण आली तर आमची टीम मदतीसाठी तयार आहे." },
  { icon: Zap, title: "वेगवान", desc: "मोबाईल आणि कॉम्प्युटर दोन्हीवर वेगाने चालते. कुठूनही वापरा." },
];

const faqs = [
  { q: "SETU Suvidha म्हणजे काय?", a: "SETU Suvidha हे महाराष्ट्रातील सेतु केंद्र, CSC केंद्र आणि ई-सेवा दुकानदारांसाठी एक ऑनलाइन फॉर्म पोर्टल आहे. येथे तुम्ही सर्व सरकारी फॉर्म्स भरू शकता, प्रिंट करू शकता आणि ग्राहकांना देऊ शकता." },
  { q: "नोंदणी मोफत आहे का?", a: "होय! नोंदणी पूर्णपणे मोफत आहे. तुम्हाला फक्त फॉर्म वापरताना वॉलेट बॅलन्स लागते." },
  { q: "वॉलेट कसे रिचार्ज करायचे?", a: "Razorpay पेमेंट गेटवे द्वारे तुम्ही UPI, डेबिट कार्ड, क्रेडिट कार्ड किंवा नेट बँकिंगने वॉलेट रिचार्ज करू शकता." },
  { q: "प्रत्येक फॉर्मचे शुल्क किती?", a: "वेगवेगळ्या फॉर्म्सचे शुल्क वेगवेगळे आहे. साधारणपणे ₹1 ते ₹5 प्रति फॉर्म. तपशीलवार किंमत डॅशबोर्ड मध्ये दिसते." },
  { q: "डेटा सुरक्षित आहे का?", a: "होय. आम्ही Supabase (PostgreSQL) वापरतो जे एन्क्रिप्टेड कनेक्शन आणि Row Level Security वापरते. तुमचा डेटा फक्त तुम्हालाच दिसतो." },
  { q: "परतावा मिळतो का?", a: "वॉलेट रिचार्ज केल्यानंतर रक्कम non-refundable आहे. अधिक माहितीसाठी आमचे परतावा धोरण पहा." },
];

const plans = [
  { name: "बेसिक", price: "मोफत", features: ["खाते तयार करा", "सर्व फॉर्म्स वापरा", "प्रति फॉर्म शुल्क", "व्यवहार इतिहास"] },
  { name: "प्रो", price: "₹49/महिना", features: ["सर्व बेसिक फीचर्स", "कमी शुल्क दर", "प्राधान्य सपोर्ट", "बल्क प्रिंट", "अॅडव्हान्स रिपोर्ट्स"], popular: true },
  { name: "एंटरप्राइज", price: "संपर्क करा", features: ["सर्व प्रो फीचर्स", "कस्टम ब्रँडिंग", "API ऍक्सेस", "डेडिकेटेड सपोर्ट", "मल्टी-लोकेशन"] },
];

const Home = () => {
  useEffect(() => {
    document.title = "SETU Suvidha — महाराष्ट्रातील #1 ई-सेवा फॉर्म पोर्टल";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <HowItWorks />
      <BandkamKamgarSection />

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              सेतु/CSC केंद्रांसाठी <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">विशेष फायदे</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              तुमचे दुकान डिजिटल करा. ग्राहक व्यवस्थापन, बिलिंग आणि फॉर्म सगळं एकाच ठिकाणी.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-900/50 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <b.icon className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              सोप्या <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">किंमती</span>
            </h2>
            <p className="text-muted-foreground text-lg">तुमच्या गरजेनुसार प्लॅन निवडा</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-2xl border ${
                  plan.popular
                    ? "border-amber-500 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/30 dark:to-gray-950 shadow-xl shadow-amber-500/10"
                    : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold rounded-full">
                    लोकप्रिय
                  </span>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="text-3xl font-extrabold mb-4 text-foreground">{plan.price}</div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${plan.popular ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link to="/signup">सुरू करा</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {["🔒 SSL Encrypted", "🏛️ Government Forms", "💳 Razorpay Secure", "📱 Mobile Friendly"].map((badge) => (
              <span key={badge} className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900 text-sm font-medium">
                {badge}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            SETU Suvidha हे सरकारी सेवा केंद्रांसाठी एक विश्वासार्ह डिजिटल प्लॅटफॉर्म आहे.
            तुमचा डेटा एन्क्रिप्टेड कनेक्शनद्वारे सुरक्षित ठेवला जातो.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              वारंवार विचारले जाणारे <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">प्रश्न</span>
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

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">आजच सुरू करा!</h2>
          <p className="text-amber-100 text-lg mb-8">
            मोफत नोंदणी करा आणि तुमच्या केंद्राचे सर्व फॉर्म काम डिजिटल करा.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-amber-700 hover:bg-gray-100 h-13 px-8 text-base font-semibold" asChild>
              <Link to="/signup">
                मोफत नोंदणी करा
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-13 px-8 text-base" asChild>
              <Link to="/contact">संपर्क करा</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
