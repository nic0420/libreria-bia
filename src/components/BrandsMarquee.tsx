export default function BrandsMarquee() {
  const brands = [
    "Cuadernos Universitarios", "Resaltadores Pastel", "Artística", "Mochilas", 
    "Agendas 2026", "Marcadores", "Sets de Lettering", "Papelería Comercial"
  ];

  return (
    <div className="relative flex overflow-hidden bg-secondary-400 py-3">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...brands, ...brands, ...brands].map((brand, i) => (
          <span key={i} className="mx-8 text-sm font-black uppercase tracking-widest text-zinc-900/80">
            • {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
