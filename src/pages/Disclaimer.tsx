import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

const Disclaimer = () => {
  useEffect(() => {
    document.title = "अस्वीकरण — SETU Suvidha";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">अस्वीकरण</h1>
          <p className="text-sm text-muted-foreground mb-10">Disclaimer | शेवटचे अपडेट: फेब्रुवारी 2026</p>

          <div className="prose dark:prose-invert max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. सामान्य अस्वीकरण</h2>
              <p>
                SETU Suvidha प्लॅटफॉर्मवर उपलब्ध माहिती "जशी आहे तशी" (as-is) आधारावर प्रदान केली जाते.
                आम्ही माहितीच्या अचूकता, पूर्णता किंवा उपयुक्ततेबद्दल कोणतीही हमी देत नाही.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. सरकारी फॉर्म्स</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>SETU Suvidha हे फॉर्म टेम्प्लेट प्रदान करणारे प्लॅटफॉर्म आहे. आम्ही कोणतीही सरकारी संस्था नाही.</li>
                <li>फॉर्म मध्ये भरलेल्या माहितीची अचूकता सुनिश्चित करणे पूर्णपणे वापरकर्त्याची जबाबदारी आहे.</li>
                <li>फॉर्ममधील चुकीच्या माहितीमुळे होणाऱ्या कोणत्याही कायदेशीर परिणामांसाठी SETU Suvidha जबाबदार नाही.</li>
                <li>सरकारी नियम आणि फॉर्म फॉरमॅट बदलू शकतात. नवीनतम फॉर्मसाठी संबंधित सरकारी कार्यालयाशी संपर्क साधा.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. सेवा उपलब्धता</h2>
              <p>
                आम्ही सेवेची 100% उपलब्धता सुनिश्चित करण्याचा प्रयत्न करतो, परंतु तांत्रिक कारणांमुळे, देखभालीमुळे किंवा इतर कारणांमुळे
                सेवा तात्पुरती अनुपलब्ध असू शकते. सेवा व्यत्ययामुळे होणाऱ्या नुकसानीसाठी आम्ही जबाबदार नाही.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. तृतीय पक्ष लिंक्स</h2>
              <p>
                आमच्या प्लॅटफॉर्मवर तृतीय पक्ष वेबसाइटच्या लिंक्स असू शकतात. या वेबसाइटच्या सामग्री किंवा गोपनीयता धोरणांवर
                आमचे नियंत्रण नाही आणि आम्ही त्यांच्यासाठी जबाबदार नाही.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. आर्थिक अस्वीकरण</h2>
              <p>
                वॉलेट व्यवहार आणि पेमेंट Razorpay पेमेंट गेटवे द्वारे प्रक्रिया केले जातात.
                पेमेंट संबंधित समस्यांसाठी Razorpay च्या अटी लागू होतात.
                दुहेरी शुल्क किंवा तांत्रिक बिघाडाच्या बाबतीत कृपया तात्काळ आमच्याशी संपर्क साधा.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. कायदेशीर अधिकार क्षेत्र</h2>
              <p>
                या अस्वीकरणाशी संबंधित कोणताही विवाद भारतीय कायद्यानुसार आणि महाराष्ट्र राज्यातील न्यायालयांच्या अधिकार क्षेत्रात निकाली काढला जाईल.
              </p>
            </section>
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

export default Disclaimer;
