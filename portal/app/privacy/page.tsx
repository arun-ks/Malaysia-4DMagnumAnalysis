"use client";

import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { LANGUAGE_OPTIONS, type Language } from "@/lib/i18n";

export default function PrivacyPage() {
  const { language, setLanguage, t } = useLanguage();
  const sections = [
    [t.privacyCollectTitle, t.privacyCollect],
    [t.privacyPurposeTitle, t.privacyPurpose],
    [t.privacyRetentionTitle, t.privacyRetention],
    [t.privacySharingTitle, t.privacySharing],
    [t.privacyChoiceTitle, t.privacyChoice],
  ];

  return <main className="privacy-page">
    <header className="site-header">
      <Link className="brand" href="/"><span className="brand-mark">4D</span><span>Results</span></Link>
      <label className="language-picker"><span className="sr-only">{t.language}</span><select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label={t.language}>{LANGUAGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
    </header>
    <article className="privacy-shell">
      <div className="privacy-icon"><ShieldCheck size={34} /></div>
      <p className="eyebrow">4D Results</p>
      <h1>{t.privacyTitle}</h1>
      <p className="privacy-updated">{t.privacyUpdated}</p>
      <p className="privacy-intro">{t.privacyIntro}</p>
      <div className="privacy-sections">
        {sections.map(([title, body]) => <section key={title}><h2>{title}</h2><p>{body}</p></section>)}
      </div>
      <div className="contribute-actions privacy-actions">
        <Link href="/"><ArrowLeft size={18} />{t.back}</Link>
        <a href="mailto:info@result4d.com.my"><Mail size={18} />{t.contact}</a>
      </div>
    </article>
  </main>;
}
