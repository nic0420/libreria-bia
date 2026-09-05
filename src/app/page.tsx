import { getProducts as getSheetProducts } from "@/lib/google-sheets";
import { getProducts as getDbProducts, createTable, Product } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import { ArrowRight, BookOpen, Package, PenLine } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  let products: Product[] = [];
  try { await createTable(); products = await getDbProducts(); } catch { console.log("No DB configured, falling back to Google Sheets"); }
  if (products.length === 0) products = await getSheetProducts();
  const carouselProducts = products.slice(0, 12);
  const featuredProducts = products.slice(0, 8);
  const categories = [{ label: "Papelería", icon: PenLine, tone: "bg-[#fff7f0] text-[#e8572f]" }, { label: "Útiles", icon: BookOpen, tone: "bg-[#f6faf8] text-[#3d6b63]" }, { label: "Oficina", icon: Package, tone: "bg-[#f5f1ec] text-[#8b6f57]" }];

  return <div className="bg-[#faf8f6]">
    <HeroSlider />
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a68d76]">Encontrá tu próximo favorito</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#1c1917]">Explorá por mundo</h2></div><Link href="/libreria" className="group inline-flex items-center gap-2 text-sm font-semibold text-[#e8572f]">Ver todo <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link></div><div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">{categories.map(({ label, icon: Icon, tone }) => <Link href="/libreria" key={label} className={`group flex items-center justify-between rounded-2xl p-5 transition-transform hover:-translate-y-1 ${tone}`}><span className="flex items-center gap-3 text-sm font-semibold"><Icon className="size-5" />{label}</span><ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>)}</div></section>
    {carouselProducts.length > 0 && <section className="overflow-hidden border-y border-[#e7e5e4] bg-white py-5"><div className="flex w-max animate-[marquee_35s_linear_infinite] gap-3">{[...carouselProducts, ...carouselProducts].map((product, index) => <Link href={`/producto/${product.id}`} key={`${product.id}-${index}`} className="flex items-center gap-3 rounded-full border border-[#e7e5e4] bg-[#faf8f6] py-2 pl-2 pr-4"><img src={product.image} alt="" className="size-8 rounded-full object-cover" /><span className="max-w-40 truncate text-xs font-medium text-[#57534e]">{product.name}</span></Link>)}</div></section>}
    <section id="novedades" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20"><div className="mb-8 flex items-end justify-between border-b border-[#d6d3d1] pb-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a68d76]">La selección Bia</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#1c1917]">Lo que está pasando</h2></div><span className="text-xs text-[#a8a29d]">{products.length} productos</span></div>{products.length === 0 ? <p className="py-16 text-center text-sm text-[#78716f]">No hay productos disponibles por el momento.</p> : <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">{featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>}</section>
  </div>;
}
