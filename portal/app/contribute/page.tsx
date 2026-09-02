"use client";

import Link from "next/link";
import { ArrowLeft, Coffee, Mail } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { LANGUAGE_OPTIONS, type Language } from "@/lib/i18n";

export default function ContributePage() {
  const { language, setLanguage, t } = useLanguage();

  return <main className="contribute-page">
    <header className="site-header">
      <Link className="brand" href="/"><span className="brand-mark">4D</span><span>Results</span></Link>
      <label className="language-picker"><span className="sr-only">{t.language}</span><select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label={t.language}>{LANGUAGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
    </header>
    <section className="contribute-shell">
      <div className="contribute-icon"><Coffee size={34} /></div>
      <p className="eyebrow">4D Results</p>
      <h1>{t.contributionTitle}</h1>
      <p>{t.contributionCopy}</p>
      <div className="coming-soon">{t.contributionSoon}</div>
      <div className="contribute-actions">
        <Link href="/"><ArrowLeft size={18} />{t.back}</Link>
        <a href="mailto:info@result4d.com.my"><Mail size={18} />{t.contact}</a>
      </div>
    </section>
  </main>;
}
