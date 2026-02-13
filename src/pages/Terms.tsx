import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

const Terms = () => {
  useEffect(() => {
    document.title = "अटी व शर्ती — SETU Suvidha";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">अटी व शर्ती</h1>
          <p className="text-sm text-muted-foreground mb-10">Terms of Service | शेवटचे अपडेट: फेब्रुवारी 2026</p>

          <div className="prose dark:prose-invert max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. सेवेचा स्वीकार</h2>
              <p>SETU Suvidha ("प्लॅटफॉर्म", "आम्ही", "आमचे") वापरून, तुम्ही या अटी व शर्ती मान्य करता. जर तुम्ही या अटी मान्य नसाल तर कृपया प्लॅटफॉर्म वापरू नका.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. सेवांचे वर्णन</h2>
              <p>SETU Suvidha हे सेतु सुविधा केंद्र, CSC केंद्र आणि ई-सेवा दुकानदारांसाठी एक ऑनलाइन फॉर्म व्यवस्थापन प्लॅटफॉर्म आहे. आम्ही सरकारी फॉर्म टेम्प्लेट्स, डेटा स्टोरेज, प्रिंटिंग सुविधा, वॉलेट सिस्टम आणि बिलिंग व्यवस्थापन सेवा प्रदान करतो.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. वापरकर्ता खाते</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>तुम्ही नोंदणी करताना अचूक माहिती देणे आवश्यक आहे.</li>
                <li>तुमचा पासवर्ड गोपनीय ठेवणे तुमची जबाबदारी आहे.</li>
                <li>तुमच्या खात्यातून होणाऱ्या सर्व क्रियाकलापांसाठी तुम्ही जबाबदार आहात.</li>
                <li>आम्ही कोणत्याही वेळी, कोणत्याही कारणास्तव खाते निलंबित किंवा बंद करू शकतो.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. वॉलेट आणि पेमेंट</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>वॉलेट रिचार्ज Razorpay पेमेंट गेटवे द्वारे केले जाते.</li>
                <li>प्रत्येक फॉर्म वापरासाठी निर्धारित शुल्क वॉलेट मधून आपोआप कापले जाते.</li>
                <li>वॉलेट मधील रक्कम non-refundable आहे, अपवादात्मक परिस्थिती वगळता.</li>
                <li>फॉर्म शुल्क वेळोवेळी बदलू शकतात, पूर्वसूचनेशिवाय.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. वापरकर्त्याच्या जबाबदाऱ्या</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>फॉर्म मध्ये भरलेली माहिती अचूक असणे तुमची जबाबदारी आहे.</li>
                <li>प्लॅटफॉर्मचा गैरवापर, हॅकिंग किंवा unauthorized access प्रतिबंधित आहे.</li>
                <li>अन्य वापरकर्त्यांचा डेटा ऍक्सेस करण्याचा प्रयत्न प्रतिबंधित आहे.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. बौद्धिक संपदा</h2>
              <p>प्लॅटफॉर्मवरील सर्व सामग्री, डिझाइन, लोगो आणि सॉफ्टवेअर SETU Suvidha च्या मालकीचे आहेत. पूर्वपरवानगीशिवाय कोणत्याही सामग्रीचे पुनरुत्पादन प्रतिबंधित आहे.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. दायित्व मर्यादा</h2>
              <p>SETU Suvidha कोणत्याही प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक किंवा परिणामी नुकसानीसाठी जबाबदार नाही. सरकारी फॉर्म्सची अचूकता सुनिश्चित करणे वापरकर्त्याची जबाबदारी आहे.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. अटींमधील बदल</h2>
              <p>आम्ही कोणत्याही वेळी या अटी अपडेट करू शकतो. बदल या पृष्ठावर प्रकाशित केले जातील. प्लॅटफॉर्म सतत वापरणे म्हणजे अद्ययावत अटी स्वीकारणे.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">9. संपर्क</h2>
              <p>या अटींबद्दल प्रश्न असल्यास, कृपया <Link to="/contact" className="text-teal-600 hover:underline">संपर्क पृष्ठ</Link> वर संपर्क करा.</p>
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

export default Terms;
