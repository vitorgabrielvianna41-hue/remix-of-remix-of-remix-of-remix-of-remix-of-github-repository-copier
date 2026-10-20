import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import landingHtml from "../../public/mapa.html?raw";
import { landingTrackingScript } from "@/lib/landing-tracking";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import kitMockupAsset from "@/assets/mockup-biomedicina.local.webp";

import depoEstudo1 from "@/assets/depoimento-estudo-1.local.webp";
import depoEstudo2 from "@/assets/depoimento-estudo-2.local.webp";
import depoEstudo3 from "@/assets/depoimento-estudo-3.local.webp";
import depoEstudo4 from "@/assets/depoimento-estudo-4.local.webp";
import avatarMarianaAsset from "@/assets/aluno-mariana.jpg";
import avatarRafaelAsset from "@/assets/aluno-rafael.jpg";
import avatarBeatrizAsset from "@/assets/aluno-beatriz.jpg";
import avatarFernandaAsset from "@/assets/aluno-fernanda.jpg";

import preview1 from "@/assets/preview-biomedicina-1.local.webp";
import preview2 from "@/assets/preview-biomedicina-2.local.webp";
import preview3 from "@/assets/preview-biomedicina-3.local.webp";
import preview4 from "@/assets/preview-biomedicina-4.local.webp";
import preview5 from "@/assets/preview-biomedicina-5.local.webp";
import preview6 from "@/assets/preview-biomedicina-6.local.webp";

const kitMockup = kitMockupAsset;
import bonusBiblia1 from "@/assets/bonus-biomedicina-1.local.webp";
import bonusBiblia2 from "@/assets/bonus-biomedicina-2.local.webp";
import bonusBiblia3 from "@/assets/bonus-biomedicina-3.local.webp";
import bonusBiblia4 from "@/assets/bonus-biomedicina-4.local.webp";
import bonusBiblia5 from "@/assets/bonus-biomedicina-5.local.webp";
import bonusBiblia6 from "@/assets/bonus-biomedicina-6.local.webp";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import avatar5 from "@/assets/avatar-5.jpg";

const assetSrc = (src: string) => src;

const mapas = [preview1, preview2, preview3, preview4, preview5, preview6];
const bonusImgs = [bonusBiblia1, bonusBiblia2, bonusBiblia3, bonusBiblia4, bonusBiblia5, bonusBiblia6];

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

// Cada depoimento tem sua própria foto de produto e seu próprio avatar,
// pareados para que a foto combine com o que a pessoa fala.
const depoimentos: Record<string, { produto: string; avatar: string }> = {
  mariana: { produto: depoEstudo1, avatar: avatarMarianaAsset },
  camila: { produto: depoEstudo2, avatar: avatarRafaelAsset },
  beatriz: { produto: depoEstudo3, avatar: avatarBeatrizAsset },
  patricia: { produto: depoEstudo4, avatar: avatarFernandaAsset },
};

const slides = [
  { src: preview1, alt: "Biomedicina: conceito e áreas de atuação" },
  { src: preview2, alt: "Método científico nas ciências biomédicas" },
  { src: preview3, alt: "Níveis de organização do corpo humano" },
  { src: preview4, alt: "Homeostase e mecanismos de regulação" },
  { src: preview5, alt: "Terminologia anatômica, planos e eixos" },
  { src: preview6, alt: "Ética profissional e biossegurança: princípios" },
];


function rewriteAssets(html: string) {
  return html
    // carregamento leve: imagens só quando aparecem na tela
    .replace(/<img(?![^>]*\bloading=)/gi, '<img loading="lazy" decoding="async"')
    .replace(/\/assets\/kit_mockup_v2\.webp/g, kitMockup)
    .replace(/\/assets\/mapa_preview_(\d)\.webp/g, (_m, n) => mapas[(Number(n) - 1) % mapas.length] ?? preview1)
    .replace(/\/assets\/bonus_(\d)\.webp/g, (_m, n) => bonusImgs[(Number(n) - 1) % bonusImgs.length] ?? bonusImgs[0] ?? "")
    .replace(
      /\/assets\/depoimento_(\w+)_produto\.webp/g,
      (_m, name: string) => depoimentos[name]?.produto ?? assetSrc(depoEstudo1),
    )
    .replace(
      /\/assets\/depoimento_(\w+)_avatar\.webp/g,
      (_m, name: string) => depoimentos[name]?.avatar ?? avatar1,
    )
    .replace(
      /\/assets\/hero_avatar_(\d)\.webp/g,
      (_m, idx: string) => avatars[(Number(idx) - 1) % avatars.length] ?? avatar1,
    );
}


const rawBody = (landingHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? "")
  .replace(/<script[\s\S]*?<\/script>/gi, "")
  .trim();

// The dark "preview" section is replaced by the React coverflow carousel.
const previewSection = /<section class="section section--dark">[\s\S]*?<\/section>/i;
const match = rawBody.match(previewSection);
const splitIndex = match ? (match.index ?? 0) : rawBody.length;

const beforeHtml = rewriteAssets(rawBody.slice(0, splitIndex));
const afterHtml = rewriteAssets(rawBody.slice(splitIndex + (match?.[0].length ?? 0)));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "300 Mapas Mentais de Biomedicina — Estudo Visual" },
      {
        name: "description",
        content:
          "300 Mapas Mentais de Biomedicina para estudar e revisar Biologia Celular, Anatomia, Bioquímica, Microbiologia e outras disciplinas do curso.",
      },
      { property: "og:title", content: "300 Mapas Mentais de Biomedicina" },
      {
        property: "og:description",
        content:
          "As principais disciplinas de Biomedicina organizadas em 300 mapas mentais para apoiar seus estudos e revisões.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preload", as: "image", href: kitMockup, fetchPriority: "high" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      { rel: "stylesheet", href: "/style.css" },
    ],
    scripts: [{ children: landingTrackingScript }],
  }),
  component: Index,
});

function useLandingScript() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    let cleanup: (() => void) | undefined;

    const run = () => {
      const init = (window as unknown as { initLanding?: (r: ParentNode) => (() => void) | void })
        .initLanding;
      if (init) cleanup = init(document) || undefined;
    };

    (window as unknown as { __LANDING_MANUAL_INIT__?: boolean }).__LANDING_MANUAL_INIT__ = true;

    if ((window as unknown as { initLanding?: unknown }).initLanding) {
      run();
    } else {
      const script = document.createElement("script");
      script.src = "/script.js";
      script.onload = run;
      document.body.appendChild(script);
    }

    return () => cleanup?.();
  }, []);

  return containerRef;
}

function Index() {
  const containerRef = useLandingScript();

  return (
    <div ref={containerRef}>
      <div dangerouslySetInnerHTML={{ __html: beforeHtml }} />

      <section className="section section--dark">
        <div className="container">
          <span className="section-label">O Material por Dentro</span>
          <h2 className="section-title" style={{ color: "#ffffff" }}>
            Veja como o material é por dentro
          </h2>
          <p className="section-subtitle">
            Mapas ilustrados e organizados por disciplina para facilitar seus estudos e revisões rápidas. Arraste para explorar.
          </p>

          <CoverflowCarousel
            slides={slides}
            cardWidth="clamp(210px, 58vw, 300px)"
            cardAspect={438 / 570}
            className="text-white"
            cardClassName="bg-white p-1"
            showNavigation
            showPagination
            label="Prévia dos mapas mentais"
          />

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a href="#value-stack-section" className="btn-cta">
              Quero acessar os 300 mapas
            </a>
          </div>
        </div>
      </section>

      <div dangerouslySetInnerHTML={{ __html: afterHtml }} />
    </div>
  );
}
