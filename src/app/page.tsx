import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Pillars } from "@/components/home/Pillars";
import { WhatWeBuild } from "@/components/home/WhatWeBuild";
import { CompleteProduct } from "@/components/home/CompleteProduct";
import { HumanAi } from "@/components/home/HumanAi";
import { Process } from "@/components/home/Process";
import { Showcase } from "@/components/home/Showcase";
import { Ownership } from "@/components/home/Ownership";
import { NotYourJob } from "@/components/home/NotYourJob";
import { CtaBand } from "@/components/site/CtaBand";
import { Faq } from "@/components/site/Faq";

export const metadata: Metadata = {
  title: "Genial Business — De l’idée au produit en ligne",
  description:
    "Studio de développement logiciel. Nous concevons et construisons des produits digitaux complets — site, application, dashboard, back-office — de l’idée jusqu’à la mise en ligne. Votre produit vous appartient.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Pillars />
      <WhatWeBuild />
      <CompleteProduct />
      <HumanAi />
      <Process />
      <Showcase />
      <Ownership />
      <NotYourJob />
      <CtaBand />
      <Faq />
    </>
  );
}
