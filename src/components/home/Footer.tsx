import { Link } from "react-router-dom";
import { Landmark } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Landmark size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">SETU Suvidha</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              सेतु सुविधा — महाराष्ट्रातील सेतु केंद्र, CSC केंद्र आणि ई-सेवा दुकानदारांसाठी #1 फॉर्म पोर्टल.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">पेजेस</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm hover:text-amber-400 transition-colors">मुख्यपृष्ठ</Link></li>
              <li><Link to="/about" className="text-sm hover:text-amber-400 transition-colors">आमच्याबद्दल</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-amber-400 transition-colors">संपर्क</Link></li>
              <li><Link to="/login" className="text-sm hover:text-amber-400 transition-colors">लॉगिन</Link></li>
              <li><Link to="/signup" className="text-sm hover:text-amber-400 transition-colors">नोंदणी</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">कायदेशीर</h4>
            <ul className="space-y-2.5">
              <li><Link to="/terms" className="text-sm hover:text-amber-400 transition-colors">अटी व शर्ती</Link></li>
              <li><Link to="/privacy" className="text-sm hover:text-amber-400 transition-colors">गोपनीयता धोरण</Link></li>
              <li><Link to="/refund" className="text-sm hover:text-amber-400 transition-colors">परतावा धोरण</Link></li>
              <li><Link to="/disclaimer" className="text-sm hover:text-amber-400 transition-colors">अस्वीकरण</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">संपर्क</h4>
            <ul className="space-y-2.5 text-sm">
              <li>📧 support@setusuvidha.com</li>
              <li>📞 +91 XXXXX XXXXX</li>
              <li>📍 महाराष्ट्र, भारत</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SETU Suvidha. सर्व हक्क राखीव.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/refund" className="hover:text-gray-300 transition-colors">Refund</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
