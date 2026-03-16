import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CollectionsCarousel } from "@/components/home/CollectionsCarousel";
import { SocialProofBar } from "@/components/home/SocialProofBar";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoBanner } from "@/components/home/PromoBanner";
import { TestimonialsMarquee } from "@/components/home/TestimonialsMarquee";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <CollectionsCarousel />
      <SocialProofBar />
      <FeaturedProducts />
      <PromoBanner />
      <TestimonialsMarquee />
      <NewsletterSection />
    </>
  );
}
