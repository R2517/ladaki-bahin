import { UserPlus, FileEdit, Printer } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "नोंदणी करा",
    desc: "मोफत खाते तयार करा. तुमच्या सेतु/CSC केंद्राची माहिती भरा आणि सुरू करा.",
  },
  {
    icon: FileEdit,
    step: "02",
    title: "फॉर्म भरा",
    desc: "ग्राहकाची माहिती भरा. सर्व सरकारी फॉर्म्स तयार — हमीपत्र, राजपत्र, उत्पन्न प्रमाणपत्र आणि बरेच काही.",
  },
  {
    icon: Printer,
    step: "03",
    title: "प्रिंट करा आणि द्या",
    desc: "एका क्लिकवर प्रिंट करा. ग्राहकाला तयार फॉर्म द्या. बिलिंग आपोआप होते.",
  },
];

const HowItWorks = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            कसे <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">काम करते?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            फक्त ३ सोप्या स्टेप्स मध्ये तुमचं काम पूर्ण
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className={`hidden md:block absolute top-16 left-[17%] right-[17%] h-0.5 bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 dark:from-amber-800 dark:via-orange-700 dark:to-amber-800 transition-all duration-1000 delay-500 origin-left ${isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`} />

          {steps.map((s, i) => (
            <div
              key={s.step}
              className={`relative text-center group transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: isVisible ? `${300 + i * 200}ms` : "0ms" }}
            >
              <div className="relative mx-auto mb-6">
                <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl shadow-amber-500/20 group-hover:shadow-amber-500/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <s.icon className="h-9 w-9 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white dark:bg-gray-900 border-2 border-amber-500 flex items-center justify-center text-xs font-bold text-amber-600">
                  {s.step}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
