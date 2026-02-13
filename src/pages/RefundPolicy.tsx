import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

const RefundPolicy = () => {
  useEffect(() => {
    document.title = "परतावा धोरण — SETU Suvidha";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">परतावा आणि रद्दीकरण धोरण</h1>
          <p className="text-sm text-muted-foreground mb-10">Refund & Cancellation Policy | शेवटचे अपडेट: फेब्रुवारी 2026</p>

          <div className="prose dark:prose-invert max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. वॉलेट रिचार्ज</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>वॉलेट मध्ये जमा केलेली रक्कम सर्वसाधारणपणे <strong>non-refundable</strong> आहे.</li>
                <li>रक्कम फक्त प्लॅटफॉर्मवरील सेवांसाठी (फॉर्म शुल्क) वापरता येते.</li>
                <li>वॉलेट बॅलन्सची मुदत संपत नाही — तो कायम तुमच्या खात्यात राहतो.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. पेमेंट अयशस्वी झाल्यास</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>जर पेमेंट अयशस्वी झाले पण रक्कम बँक खात्यातून कापली गेली, तर ती 5-7 कामकाजाच्या दिवसांत स्वयंचलितपणे परत होते.</li>
                <li>जर रक्कम 7 दिवसांत परत आली नाही, तर कृपया support@setusuvidha.com वर संपर्क करा.</li>
                <li>ट्रान्झॅक्शन ID आणि पेमेंट स्क्रीनशॉट सोबत पाठवा.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. फॉर्म शुल्क</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>फॉर्म वापरल्यानंतर कापलेले शुल्क <strong>परत केले जात नाही</strong>.</li>
                <li>तांत्रिक बिघाडामुळे फॉर्म सेव्ह न झाल्यास, शुल्क परत केले जाऊ शकते.</li>
                <li>अशा परिस्थितीत कृपया 24 तासांच्या आत संपर्क करा.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. सबस्क्रिप्शन रद्दीकरण</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>सबस्क्रिप्शन कधीही रद्द करता येते.</li>
                <li>रद्द केल्यानंतर, सबस्क्रिप्शन कालावधी संपेपर्यंत सेवा चालू राहते.</li>
                <li>उर्वरित कालावधीसाठी प्रमाणशीर (pro-rata) परतावा दिला जात नाही.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. अपवादात्मक परतावा</h2>
              <p>खालील परिस्थितीत पूर्ण किंवा आंशिक परतावा विचारात घेतला जाऊ शकतो:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>प्लॅटफॉर्ममधील तांत्रिक दोषामुळे सेवा वापरता आली नाही</li>
                <li>चुकीची रक्कम कापली गेली (duplicate deduction)</li>
                <li>खाते unauthorized access मुळे compromise झाले</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. परतावा प्रक्रिया</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>मान्यताप्राप्त परतावा 7-10 कामकाजाच्या दिवसांत मूळ पेमेंट पद्धतीद्वारे केला जातो.</li>
                <li>परतावा विनंतीसाठी: support@setusuvidha.com वर ईमेल करा.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. संपर्क</h2>
              <p>
                परतावा संबंधित प्रश्नांसाठी: <Link to="/contact" className="text-teal-600 hover:underline">संपर्क पृष्ठ</Link> किंवा support@setusuvidha.com
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

export default RefundPolicy;
