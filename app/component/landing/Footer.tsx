import { motion } from "motion/react";
import { Target, Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  const footerLinks = {
    Product: ["Features", "Analytics", "Download", "Pricing"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Resources: ["Help Center", "Community", "Privacy", "Terms"],
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div>
              <span className="text-xl font-bold text-white">FocusFlow</span>
            </motion.div>
            <p className="text-[#A7A7B0] mb-6 max-w-sm">
              Your calm productivity companion for building focus, habits, and
              achieving deep work without pressure.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg  flex-center-all text-[#A7A7B0] hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      className="text-[#A7A7B0] hover:text-white transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between flex-center gap-4">
          <p className="small-muted-text flex flex-center gap-1 mt-6">
            © {new Date().getFullYear()}
            <span className="font-semibold text-primary">FocusFlow</span> made
            by
            <div className="font-medium text-accent  hover:text-primary/80 transition-colors duration-200">
              ByteLab
            </div>
            , All rights reserved.
          </p>

          <div className="flex gap-6">
            <a
              href="#"
              className="text-[#A7A7B0] hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[#A7A7B0] hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
