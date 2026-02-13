import {
  FileText, Shield, AlertTriangle, FilePlus, Users, Award,
  CreditCard, Vote, HardHat, BookOpen, Globe, Scale,
} from "lucide-react";

const services = [
  { icon: FileText, title: "हमीपत्र", desc: "शासकीय कामांसाठी हमीपत्र तयार करा", color: "from-blue-500 to-blue-600" },
  { icon: Shield, title: "स्वयंघोषणापत्र", desc: "स्वयंघोषणापत्र फॉर्म भरा आणि प्रिंट करा", color: "from-emerald-500 to-emerald-600" },
  { icon: AlertTriangle, title: "तक्रार अर्ज", desc: "तक्रार नोंदणी फॉर्म तयार करा", color: "from-amber-500 to-orange-600" },
  { icon: FilePlus, title: "नवीन अर्ज", desc: "विविध शासकीय योजनांसाठी नवीन अर्ज", color: "from-purple-500 to-purple-600" },
  { icon: Users, title: "जात पडताळणी", desc: "जात वैधता प्रमाणपत्र फॉर्म", color: "from-pink-500 to-rose-600" },
  { icon: Award, title: "उत्पन्न प्रमाणपत्र", desc: "उत्पन्नाचे स्वयंघोषणापत्र तयार करा", color: "from-teal-500 to-cyan-600" },
  { icon: CreditCard, title: "PAN Card", desc: "PAN कार्ड अर्ज आणि दुरुस्ती", color: "from-indigo-500 to-indigo-600" },
  { icon: Vote, title: "Voter ID Card", desc: "मतदार ओळखपत्र अर्ज", color: "from-red-500 to-red-600" },
  { icon: HardHat, title: "बांधकाम कामगार", desc: "बांधकाम कामगार नोंदणी फॉर्म", color: "from-yellow-500 to-amber-600" },
  { icon: BookOpen, title: "राजपत्र (मराठी)", desc: "मराठी राजपत्र शपथपत्र", color: "from-sky-500 to-blue-600" },
  { icon: Globe, title: "राजपत्र (English)", desc: "English Gazette Affidavit", color: "from-lime-500 to-green-600" },
  { icon: Scale, title: "राजपत्र ७/१२", desc: "राजपत्र शपथपत्र 7/12 उतारा", color: "from-fuchsia-500 to-purple-600" },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            आमच्या <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">सेवा</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            सर्व महत्त्वाचे सरकारी फॉर्म्स एकाच ठिकाणी. भरा, प्रिंट करा आणि ग्राहकांना द्या.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((svc) => (
            <div
              key={svc.title}
              className="group relative p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <svc.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base mb-1">{svc.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
