export default function BrandsMarquee() {
  const items = [
    "Cuadernos", "Resaltadores", "Marcadores", "Agendas",
    "Biromes", "Carpetas", "Blocks", "Lápices",
    "Borradores", "Sacapuntas", "Sobres", "Geometría"
  ];

  return (
    <div className="relative flex overflow-hidden bg-blue-50 border-b border-blue-100 py-2.5">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="mx-6 text-[11px] font-semibold uppercase tracking-widest text-blue-500">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
