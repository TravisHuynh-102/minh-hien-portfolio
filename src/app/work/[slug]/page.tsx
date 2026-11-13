import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FEATURED_PROJECTS } from "@/data/projects";
import { SITE_CONFIG } from "@/data/site-config";
import { CaseStudyDetailView } from "@/components/case-study/case-study-detail-view";

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return FEATURED_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = FEATURED_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${project.title.vi} | ${SITE_CONFIG.marketerName}`,
    description: `${project.shortSummary.vi} (${project.cardMiniMetrics
      .map((m) => m.value)
      .join(" • ")})`,
    openGraph: {
      title: `${project.title.vi} — Full-Funnel Case Study`,
      description: project.shortSummary.en,
      type: "article",
    },
  };
}

export default async function WorkCaseStudyPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const currentIndex = FEATURED_PROJECTS.findIndex((p) => p.slug === slug);

  const project =
    currentIndex !== -1 ? FEATURED_PROJECTS[currentIndex] : FEATURED_PROJECTS[0];
  const nextProject =
    currentIndex !== -1
      ? FEATURED_PROJECTS[(currentIndex + 1) % FEATURED_PROJECTS.length]
      : FEATURED_PROJECTS[0];

  return (
    <CaseStudyDetailView
      slug={slug}
      project={project}
      nextProject={nextProject}
    />
  );
}
