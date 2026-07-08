import { useState } from "react";
import Head from "next/head";
import { Navbar } from "~/components/layout/navbar";
import {
  HeroSearch,
  type ModalityFilter,
} from "~/components/landing/hero-search";
import { SpecialtiesGrid } from "~/components/landing/specialties-grid";
import { DoctorList } from "~/components/landing/doctor-list";
import { HowItWorks } from "~/components/landing/how-it-works";
import { BenefitsSection } from "~/components/landing/benefits-section";
import { SiteFooter } from "~/components/landing/site-footer";

export default function Home() {
  const [query, setQuery] = useState("");
  const [modality, setModality] = useState<ModalityFilter>("all");
  const [specialtySlug, setSpecialtySlug] = useState<string | null>(null);

  const scrollToResults = () => {
    document
      .getElementById("resultados")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Head>
        <title>Centro Médico Telehealth — Agenda tu hora médica online</title>
        <meta
          name="description"
          content="Agenda telemedicina y consultas presenciales. Paga online, recibe tu boleta al instante y reembolsa automáticamente en tu isapre y seguros."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-white">
        <Navbar showLandingLinks />
        <HeroSearch
          query={query}
          onQueryChange={setQuery}
          modality={modality}
          onModalityChange={setModality}
          onSearch={scrollToResults}
        />
        <SpecialtiesGrid
          selected={specialtySlug}
          onSelect={(slug) => {
            setSpecialtySlug(slug);
            if (slug) scrollToResults();
          }}
        />
        <DoctorList
          query={query}
          modality={modality}
          specialtySlug={specialtySlug}
          onClearFilters={() => {
            setQuery("");
            setModality("all");
            setSpecialtySlug(null);
          }}
        />
        <HowItWorks />
        <BenefitsSection />
        <SiteFooter />
      </main>
    </>
  );
}
