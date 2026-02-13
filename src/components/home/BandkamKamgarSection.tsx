import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HardHat, Users, Shield, CalendarClock, ArrowRight, ClipboardList, Wallet, Bell } from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "ग्राहक नोंदणी व्यवस्थापन",
    desc: "नवीन नोंदणी, नूतनीकरण ट्रॅकिंग आणि ग्राहक प्रोफाइल — सर्व एकाच ठिकाणी.",
  },
  {
    icon: Shield,
    title: "योजना ट्रॅकिंग",
    desc: "Safety Kit, Essential Kit, Scholarship, विवाह सहाय्य — कोणत्या ग्राहकाला कोणती योजना मिळाली ते ट्रॅक करा.",
  },
  {
    icon: Wallet,
    title: "पेमेंट आणि कमिशन",
    desc: "प्रत्येक नोंदणीचे शुल्क, कमिशन आणि पेमेंट रेकॉर्ड ठेवा.",
  },
  {
    icon: Bell,
    title: "एक्सपायरी अलर्ट्स",
    desc: "नोंदणी कालबाह्य होण्यापूर्वी ऑटो रिमाइंडर. नूतनीकरण मिस होणार नाही.",
  },
];

const stats = [
  { value: "17+", label: "कल्याणकारी योजना" },
  { value: "36", label: "जिल्हे कव्हर" },
  { value: "3 वर्षे", label: "नोंदणी वैधता" },
];

const BandkamKamgarSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50/50 to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-orange-200/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium mb-4">
            <HardHat className="h-4 w-4" />
            MahaBOCW — बांधकाम कामगार कल्याण मंडळ
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            बांधकाम कामगार नोंदणी व{" "}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              योजना व्यवस्थापन
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            महाराष्ट्र बांधकाम कामगार कल्याण मंडळाच्या (MahaBOCW) सर्व 17+ योजनांचे डिजिटल व्यवस्थापन.
            सेतू संचालकांसाठी सोपे ग्राहक ट्रॅकिंग आणि कमिशन मॅनेजमेंट.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-amber-100 dark:border-gray-800 hover:shadow-lg hover:shadow-amber-500/5 transition-all hover:-translate-y-0.5"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-base font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats + CTA */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white">
          <div className="flex flex-wrap justify-center lg:justify-start gap-8 sm:gap-12">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold">{s.value}</div>
                <div className="text-amber-100 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="bg-white text-amber-700 hover:bg-amber-50 h-12 px-6 text-base font-semibold shadow-lg"
              asChild
            >
              <Link to="/bandkam-kamgar-info">
                संपूर्ण माहिती पहा
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 h-12 px-6 text-base"
              asChild
            >
              <Link to="/signup">
                <Users className="mr-2 h-4 w-4" />
                मोफत नोंदणी करा
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BandkamKamgarSection;
