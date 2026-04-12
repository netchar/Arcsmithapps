"use client";

import { Mail, Shield, Smartphone, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface AboutContentProps {
  lang: string;
  dict: {
    about: {
      heroHeadline: string;
      paragraphs: string[];
      contact: {
        heading: string;
        email: string;
        entity: string;
        nip: string;
      };
    };
  };
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const values: Record<string, { title: string; desc: string }[]> = {
  en: [
    { title: "Thoughtful design", desc: "Each app does one thing well" },
    { title: "Privacy first", desc: "No tracking, ads, or unnecessary permissions" },
    { title: "Built to last", desc: "Modern tools, best practices" },
  ],
  pl: [
    { title: "Przemy\u015blany design", desc: "Ka\u017cda aplikacja robi jedn\u0105 rzecz dobrze" },
    { title: "Prywatno\u015b\u0107 przede wszystkim", desc: "\u017badnego \u015bledzenia, reklam ani zb\u0119dnych uprawnie\u0144" },
    { title: "Stworzone na lata", desc: "Nowoczesne narz\u0119dzia, najlepsze praktyki" },
  ],
  ru: [
    { title: "\u041f\u0440\u043e\u0434\u0443\u043c\u0430\u043d\u043d\u044b\u0439 \u0434\u0438\u0437\u0430\u0439\u043d", desc: "\u041a\u0430\u0436\u0434\u043e\u0435 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0434\u0435\u043b\u0430\u0435\u0442 \u043e\u0434\u043d\u0443 \u0432\u0435\u0449\u044c \u0445\u043e\u0440\u043e\u0448\u043e" },
    { title: "\u041f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u044c \u043f\u0440\u0435\u0436\u0434\u0435 \u0432\u0441\u0435\u0433\u043e", desc: "\u041d\u0438\u043a\u0430\u043a\u043e\u0433\u043e \u0442\u0440\u0435\u043a\u0438\u043d\u0433\u0430, \u0440\u0435\u043a\u043b\u0430\u043c\u044b \u0438\u043b\u0438 \u043b\u0438\u0448\u043d\u0438\u0445 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043d\u0438\u0439" },
    { title: "\u0421\u043e\u0437\u0434\u0430\u043d\u043e \u043d\u0430\u0434\u043e\u043b\u0433\u043e", desc: "\u0421\u043e\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u044b, \u043b\u0443\u0447\u0448\u0438\u0435 \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0438" },
  ],
};

const valueIcons = [Smartphone, Lock, Shield];

export function AboutContent({ lang, dict }: AboutContentProps) {
  const localValues = values[lang] ?? values.en;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#141e1a] via-bg-primary to-bg-primary" />
        <div className="pointer-events-none absolute top-[-300px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(30,77,58,0.12)_0%,transparent_70%)]" />

        <div className="relative mx-auto max-w-[1200px] px-6 pt-28 pb-20 sm:pt-36 sm:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mx-auto text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight leading-[1.1]">
              {dict.about.heroHeadline}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {localValues.map((item, i) => {
              const Icon = valueIcons[i];
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-border bg-bg-card p-8 text-center transition-all duration-300 hover:border-accent/20"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-subtle border border-accent/15 mx-auto mb-5">
                    <Icon size={22} className="text-accent" />
                  </div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-text-secondary text-lg leading-relaxed"
          >
            {dict.about.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              {dict.about.contact.heading}
            </h2>
            <div className="space-y-3 text-text-secondary">
              <a
                href={`mailto:${dict.about.contact.email}`}
                className="inline-flex items-center gap-2.5 text-text-secondary hover:text-text-primary transition-colors"
              >
                <Mail size={16} className="text-accent" />
                {dict.about.contact.email}
              </a>
              <p>{dict.about.contact.entity}</p>
              <p className="text-text-muted text-sm">{dict.about.contact.nip}</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
