import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Target, Eye, Users, Shield } from "lucide-react";

const About = () => {
  useEffect(() => {
    document.title = "आमच्याबद्दल — SETU Suvidha";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">
            आमच्याबद्दल — <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">SETU Suvidha</span>
          </h1>
          <p className="text-muted-foreground text-sm mb-10">शेवटचे अपडेट: फेब्रुवारी 2026</p>

          <div className="prose dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Target className="h-6 w-6 text-teal-500" /> आमचे ध्येय
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                SETU Suvidha हे महाराष्ट्रातील सेतु सुविधा केंद्र, CSC केंद्र आणि ई-सेवा दुकानदारांसाठी एक सर्वसमावेशक डिजिटल प्लॅटफॉर्म आहे. 
                आमचे ध्येय आहे की प्रत्येक सरकारी सेवा केंद्राला डिजिटल साधने उपलब्ध करून देणे, ज्यामुळे त्यांचे काम जलद, सोपे आणि कार्यक्षम होईल.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Eye className="h-6 w-6 text-teal-500" /> आमची दृष्टी
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                महाराष्ट्रातील प्रत्येक तालुक्यात, प्रत्येक गावात सरकारी सेवा सहज उपलब्ध व्हाव्यात. 
                नागरिकांना त्यांच्या जवळच्या सेतु/CSC केंद्रातून सर्व सरकारी फॉर्म्स आणि सेवा मिळाव्यात — हेच आमचे स्वप्न आहे.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Users className="h-6 w-6 text-teal-500" /> आम्ही काय करतो
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">• सर्व प्रकारचे सरकारी फॉर्म्स — हमीपत्र, स्वयंघोषणापत्र, उत्पन्न प्रमाणपत्र, जात पडताळणी, राजपत्र इत्यादी</li>
                <li className="flex items-start gap-2">• PAN Card, Voter ID Card अर्ज व्यवस्थापन</li>
                <li className="flex items-start gap-2">• बांधकाम कामगार नोंदणी</li>
                <li className="flex items-start gap-2">• वॉलेट सिस्टम — Razorpay द्वारे सुरक्षित पेमेंट</li>
                <li className="flex items-start gap-2">• बिलिंग, ग्राहक व्यवस्थापन आणि रिपोर्टिंग</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Shield className="h-6 w-6 text-teal-500" /> तंत्रज्ञान आणि सुरक्षा
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                SETU Suvidha अत्याधुनिक तंत्रज्ञान वापरते — React, Supabase (PostgreSQL), आणि Razorpay. 
                SSL एन्क्रिप्शन, Row Level Security, आणि सुरक्षित authentication द्वारे तुमचा डेटा पूर्णपणे संरक्षित राहतो.
              </p>
            </section>
          </div>

          <div className="mt-12 flex gap-4">
            <Link to="/" className="text-teal-600 hover:text-teal-700 text-sm font-medium">← मुख्यपृष्ठ</Link>
            <Link to="/contact" className="text-teal-600 hover:text-teal-700 text-sm font-medium">संपर्क करा →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
