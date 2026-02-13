import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

const Privacy = () => {
  useEffect(() => {
    document.title = "गोपनीयता धोरण — SETU Suvidha";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">गोपनीयता धोरण</h1>
          <p className="text-sm text-muted-foreground mb-10">Privacy Policy | शेवटचे अपडेट: फेब्रुवारी 2026</p>

          <div className="prose dark:prose-invert max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. माहिती संकलन</h2>
              <p>आम्ही खालील माहिती गोळा करतो:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>वैयक्तिक माहिती:</strong> नाव, ईमेल, मोबाईल नंबर, पत्ता, दुकानाचे नाव</li>
                <li><strong>फॉर्म डेटा:</strong> ग्राहकांसाठी भरलेल्या फॉर्ममधील माहिती (नाव, आधार, पत्ता इ.)</li>
                <li><strong>आर्थिक माहिती:</strong> वॉलेट व्यवहार, पेमेंट रेकॉर्ड (क्रेडिट/डेबिट कार्ड माहिती आम्ही साठवत नाही)</li>
                <li><strong>तांत्रिक माहिती:</strong> IP पत्ता, ब्राउझर प्रकार, वापराचे पॅटर्न</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. माहितीचा वापर</h2>
              <p>गोळा केलेली माहिती खालीलप्रमाणे वापरली जाते:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>सेवा प्रदान करणे आणि सुधारणे</li>
                <li>वापरकर्ता खाते व्यवस्थापन</li>
                <li>पेमेंट प्रक्रिया (Razorpay द्वारे)</li>
                <li>ग्राहक सहाय्य</li>
                <li>सुरक्षा आणि फसवणूक प्रतिबंध</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. डेटा सुरक्षा</h2>
              <p>
                आम्ही तुमचा डेटा सुरक्षित ठेवण्यासाठी उद्योग-मानक सुरक्षा उपाय वापरतो:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>SSL/TLS एन्क्रिप्शन सर्व डेटा ट्रान्समिशनसाठी</li>
                <li>Supabase Row Level Security (RLS) — प्रत्येक वापरकर्त्याला फक्त त्यांचाच डेटा दिसतो</li>
                <li>Razorpay PCI DSS compliant पेमेंट प्रोसेसिंग</li>
                <li>नियमित सुरक्षा ऑडिट</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. तृतीय पक्ष सेवा</h2>
              <p>आम्ही खालील तृतीय पक्ष सेवा वापरतो:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Supabase:</strong> डेटाबेस आणि ऑथेंटिकेशन</li>
                <li><strong>Razorpay:</strong> पेमेंट गेटवे</li>
              </ul>
              <p>या सेवांची स्वतःची गोपनीयता धोरणे आहेत.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. माहितीचे अधिकार (IT Act, 2000 अंतर्गत)</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>तुमची वैयक्तिक माहिती पाहण्याचा आणि अपडेट करण्याचा अधिकार</li>
                <li>तुमचे खाते हटवण्याची विनंती करण्याचा अधिकार</li>
                <li>डेटा प्रोसेसिंगवर आक्षेप घेण्याचा अधिकार</li>
                <li>तुमच्या डेटाची प्रत निर्यात करण्याचा अधिकार</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. कुकीज</h2>
              <p>
                आम्ही session व्यवस्थापनासाठी आवश्यक कुकीज वापरतो. या कुकीज प्लॅटफॉर्मच्या कार्यासाठी आवश्यक आहेत.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. संपर्क</h2>
              <p>गोपनीयतेबद्दल प्रश्न असल्यास: <Link to="/contact" className="text-teal-600 hover:underline">संपर्क करा</Link></p>
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

export default Privacy;
