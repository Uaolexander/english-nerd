const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "English Nerd",
  url: "https://englishnerd.cc",
  description: "Free English grammar exercises and lessons for A1–C1 learners.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://englishnerd.cc/grammar?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "English Nerd",
  url: "https://englishnerd.cc",
  logo: "https://englishnerd.cc/logo.jpg",
  sameAs: [],
  description: "English Nerd provides free interactive grammar exercises for English learners at all levels from A1 to C1.",
  knowsAbout: ["English grammar", "ESL", "EFL", "Language learning"],
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "English Grammar A1–C1",
  description: "Complete English grammar course covering all levels from A1 Beginner to C1 Advanced with interactive exercises.",
  provider: {
    "@type": "EducationalOrganization",
    name: "English Nerd",
    url: "https://englishnerd.cc",
  },
  url: "https://englishnerd.cc/grammar",
  inLanguage: "en",
  isAccessibleForFree: true,
  educationalLevel: "Beginner to Advanced",
  hasCourseInstance: [
    { "@type": "CourseInstance", courseMode: "online", name: "A1 Beginner Grammar" },
    { "@type": "CourseInstance", courseMode: "online", name: "A2 Elementary Grammar" },
    { "@type": "CourseInstance", courseMode: "online", name: "B1 Intermediate Grammar" },
    { "@type": "CourseInstance", courseMode: "online", name: "B2 Upper Intermediate Grammar" },
    { "@type": "CourseInstance", courseMode: "online", name: "C1 Advanced Grammar" },
  ],
};

export default function GrammarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      {children}
    </div>
  );
}
