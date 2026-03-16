import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/feed";
import { FeedProductDetail } from "@/components/product/FeedProductDetail";

interface Props {
  params: { slug: string };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  return <FeedProductDetail product={product} />;
}
