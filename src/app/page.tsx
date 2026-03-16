import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CollectionsCarousel } from "@/components/home/CollectionsCarousel";
import { SocialProofBar } from "@/components/home/SocialProofBar";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoBanner } from "@/components/home/PromoBanner";
import { TestimonialsMarquee } from "@/components/home/TestimonialsMarquee";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { fetchProducts } from "@/lib/feed";
import type { FeedProduct } from "@/lib/feed";

export default async function HomePage() {
  let feedProducts: FeedProduct[] = [];
  try {
    feedProducts = await fetchProducts();
  } catch {
    // fallback to empty – components handle it gracefully
  }

  const heroProducts = feedProducts.slice(0, 3);
  const featuredProducts = feedProducts.slice(0, 8);

  return (
    <>
      <HeroSection heroProducts={heroProducts} />
      <CategoryGrid />
      <CollectionsCarousel />
      <SocialProofBar />
      <FeaturedProducts feedProducts={featuredProducts} />
      <PromoBanner />
      <TestimonialsMarquee />
      <NewsletterSection />
    </>
  );
}
