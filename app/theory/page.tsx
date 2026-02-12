"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Lang, LANGUAGES, translations } from "./translations";

export default function TheoryPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [photoOpen, setPhotoOpen] = useState(false);
  const t = translations[lang];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </Link>

        {/* Language Switcher */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-10">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                lang === l.code
                  ? "bg-orange-500/20 text-orange-500 border border-orange-500/40"
                  : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-white hover:border-zinc-600"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Author Header */}
        <div className="flex flex-col md:flex-row items-center md:items-center gap-5 text-center md:text-left mb-12">
          <div
            className="w-28 h-28 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden ring-2 ring-orange-500/40 ring-offset-4 ring-offset-black cursor-pointer hover:ring-orange-500/70 transition-all"
            onClick={() => setPhotoOpen(true)}
          >
            <Image
              src="/pavel.jpg"
              alt="Pavel Solodkov"
              width={144}
              height={144}
              className="object-cover object-[center_20%] w-full h-full"
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-2xl font-bold mb-1">{t.title}</h1>
            <p className="text-zinc-500 text-sm font-medium">{t.subtitle}</p>
          </div>
        </div>

        {/* Article Content */}
        <article className="space-y-8 text-zinc-300 leading-relaxed">
          {/* Section 1: What is the Energy Floor Theory */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3">{t.s1_title}</h2>
            <p>{t.s1_p1}</p>
            <p className="mt-3">{t.s1_p2}</p>
          </section>

          {/* Section 2: How the Calculator Works */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3">{t.s2_title}</h2>
            <p className="mb-3">{t.s2_p1}</p>
            <ul className="space-y-2 ml-1">
              <li className="flex gap-2">
                <span className="text-orange-500 mt-0.5 shrink-0">▸</span>
                <span>{t.s2_bullet1}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 mt-0.5 shrink-0">▸</span>
                <span>{t.s2_bullet2}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 mt-0.5 shrink-0">▸</span>
                <span>{t.s2_bullet3}</span>
              </li>
            </ul>
          </section>

          {/* Section 3: About the Author */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3">{t.s3_title}</h2>
            <p>{t.s3_p1}</p>
            <p className="mt-3">{t.s3_p2}</p>
          </section>

          {/* Section 4: Why Use This Tool */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3">{t.s4_title}</h2>
            <p>{t.s4_p1}</p>
          </section>

          {/* Section 5: Historical Record */}
          <section>
            <h2 className="text-lg font-bold text-white mb-3">{t.s5_title}</h2>
            <p>{t.s5_p1}</p>
          </section>

          {/* Quote */}
          <blockquote className="border-l-2 border-orange-500/50 pl-4 py-2 text-zinc-400 italic">
            {t.quote}
            <span className="block mt-1 text-xs text-zinc-600 not-italic">— Pavel Solodkov</span>
          </blockquote>

          {/* Disclaimer */}
          <p className="text-xs text-zinc-600 text-center pt-4 border-t border-zinc-800">
            {t.disclaimer}
          </p>
        </article>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-orange-500 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </Link>
        </div>
      </div>

      {/* Photo Lightbox */}
      {photoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer animate-[fadeIn_150ms_ease-out]"
          onClick={() => setPhotoOpen(false)}
        >
          <div className="max-w-sm max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-zinc-700 animate-[scaleIn_150ms_ease-out]">
            <Image
              src="/pavel.jpg"
              alt="Pavel Solodkov"
              width={600}
              height={800}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}
