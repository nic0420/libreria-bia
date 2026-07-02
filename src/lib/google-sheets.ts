import { Product } from "@/types/product";

// Constantes para el entorno
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
// El script de App Script o la API Route segura para postear datos (como se hizo en Vito)
const API_URL = process.env.API_URL; 

export async function getProducts(): Promise<Product[]> {
  if (!SHEET_ID) {
    // Retornamos mock data si no hay sheet
    return [
      {
        id: "1",
        name: "Cuaderno A5 Rayado pastel",
        description: "Cuaderno tamaño A5, 80 hojas rayadas. Tapas duras en tonos pasteles.",
        price: 3500,
        stock: 10,
        category: "Cuadernos",
        image: "https://via.placeholder.com/300x300.png?text=Cuaderno+Pastel"
      },
      {
        id: "2",
        name: "Resaltadores Pastel x6",
        description: "Set de 6 resaltadores en tonos pastel, ideales para lettering y estudio.",
        price: 2800,
        stock: 15,
        category: "Librería",
        image: "https://via.placeholder.com/300x300.png?text=Resaltadores"
      },
      {
        id: "3",
        name: "Agenda 2026 Semanal",
        description: "Agenda diseño minimalista, formato semanal con anillado.",
        price: 9500,
        stock: 5,
        category: "Agendas",
        image: "https://via.placeholder.com/300x300.png?text=Agenda+2026"
      }
    ];
  }

  try {
    // Usamos el export CSV para obtener datos rápidos de Google Sheets (Requiere que sea público)
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Productos`;
    const res = await fetch(url, { next: { revalidate: 60 } }); // ISR (Vito Store optimization)
    const csvStr = await res.text();
    
    // Parseo muy básico de CSV (Asume comillas dobles y comas estándar sin saltos de linea dentro)
    const lines = csvStr.split('\n');
    const products: Product[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      
      const values = line.split('","').map(v => v.replace(/(^")|("$)/g, ''));
      if (values.length < 6) continue;

      products.push({
        id: values[0] || i.toString(),
        name: values[1] || "",
        description: values[2] || "",
        price: parseFloat(values[3]) || 0,
        stock: parseInt(values[4]) || 0,
        category: values[5] || "",
        image: values[6] || "https://via.placeholder.com/300"
      });
    }

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
