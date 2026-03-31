const learningResourceSchema = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  provider: {
    "@type": "Organization",
    name: "English Nerd",
    url: "https://englishnerd.cc",
  },
  educationalLevel: "Beginner to Advanced (A1–C1)",
  inLanguage: "en",
  isAccessibleForFree: true,
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
  },
};

export default function GrammarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceSchema) }}
      />
      {children}
    </div>
  );
}
