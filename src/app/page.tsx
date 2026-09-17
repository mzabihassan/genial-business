import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { WhatWeBuild } from "@/components/home/WhatWeBuild";
import { CompleteProduct } from "@/components/home/CompleteProduct";
import { HumanAi } from "@/components/home/HumanAi";
import { Process } from "@/components/home/Process";
import { Showcase } from "@/components/home/Showcase";
import { Ownership } from "@/components/home/Ownership";
import { CtaBand } from "@/components/site/CtaBand";
import { Faq } from "@/components/site/Faq";

export const metadata: Metadata = {
  title: "Genial Business | De l’idée au produit en ligne",
  description:
    "Studio de développement logiciel. Nous concevons des sites, des applications web et des logiciels métier, de la définition du besoin à la mise en ligne.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <CompleteProduct />
      <Showcase />
      <WhatWeBuild />
      <HumanAi />
      <Process />
      <Ownership />
      <Faq />
      <CtaBand />
    </>
  );
}
