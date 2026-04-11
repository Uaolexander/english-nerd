interface LessonSchemaProps {
  title: string;
  description: string;
  url: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1";
}

const LEVEL_LABELS: Record<string, string> = {
  A1: "A1 — Beginner",
  A2: "A2 — Elementary",
  B1: "B1 — Intermediate",
  B2: "B2 — Upper Intermediate",
  C1: "C1 — Advanced",
};

export default function LessonSchema({ title, description, url, level }: LessonSchemaProps) {
  const levelSlug = level.toLowerCase();
  const levelLabel = LEVEL_LABELS[level] ?? level;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://englishnerd.cc" },
      { "@type": "ListItem", position: 2, name: "Grammar", item: "https://englishnerd.cc/grammar" },
      { "@type": "ListItem", position: 3, name: levelLabel, item: `https://englishnerd.cc/grammar/${levelSlug}` },
      { "@type": "ListItem", position: 4, name: title, item: url },
    ],
  };

  const learningResource = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: title,
    description,
    url,
    inLanguage: "en",
    educationalLevel: levelLabel,
    educationalUse: "practice",
    learningResourceType: "quiz",
    isAccessibleForFree: true,
    provider: {
      "@type": "EducationalOrganization",
      name: "English Nerd",
      url: "https://englishnerd.cc",
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResource) }}
      />
    </>
  );
}
