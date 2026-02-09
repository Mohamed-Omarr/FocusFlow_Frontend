'use client';

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Linkedin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PrivacyPolicy } from "./PrivacyPolicy";
import { TermsOfService } from "./TermsOfService";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("landing.footer"); // i18n namespace for footer
  const [modalContent, setModalContent] = useState<"privacy" | "terms" | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setModalContent(null);
      }
    };
    if (modalContent) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalContent]);

  const footerLinks = {
    Product: [
      { label: t("links.features"), href: "#features", type: "not-modal" },
      { label: t("links.analytics"), href: "#analytics", type: "not-modal" },
    ],
    Legal: [
      { label: t("links.privacy_policy"), href: "privacy", type: "modal" },
      { label: t("links.terms_of_service"), href: "terms", type: "modal" },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div>
              <span className="text-xl font-bold text-white">{t("brand")}</span>
            </motion.div>
            <p className="text-[#A7A7B0] mb-6 max-w-sm">{t("description")}</p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex-center-all text-[#A7A7B0] hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
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
              <h4 className="text-white mb-4">{t(`categories.${category.toLowerCase()}`)}</h4>
              <ul className="space-y-3">
                {links.map((result, index) => (
                  <li key={index}>
                    {result.type === "modal" ? (
                      <button
                        onClick={() =>
                          setModalContent(result.href === "privacy" ? "privacy" : "terms")
                        }
                        className="text-[#A7A7B0] hover:text-white transition-colors"
                      >
                        {result.label}
                      </button>
                    ) : (
                      <Link
                        href={result.href}
                        className="text-[#A7A7B0] hover:text-white transition-colors"
                      >
                        {result.label}
                      </Link>
                    )}
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
            <span className="font-semibold text-primary">{t("brand")}</span>, {t("rights_reserved")}
          </p>
        </div>
      </div>

      {/* Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-3xl max-h-[70vh] overflow-y-auto p-6 relative"
          >
            <button
              onClick={() => setModalContent(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>

            {modalContent === "privacy" && <PrivacyPolicy />}
            {modalContent === "terms" && <TermsOfService />}
          </div>
        </div>
      )}
    </footer>
  );
}
