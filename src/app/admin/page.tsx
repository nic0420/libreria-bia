"use client";

import React, { useState, useCallback, useRef } from "react";
import * as xlsx from "xlsx";
import { Upload, FileSpreadsheet, Package, AlertCircle, Save, Trash2, Edit2, Download } from "lucide-react";

export default function AdminUploadPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    setError(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("No data found");

        const workbook = xlsx.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const json = xlsx.utils.sheet_to_json(worksheet);
        
        if (json.length === 0) {
          setError("El archivo Excel está vacío.");
          return;
        }

        setProducts(json);
      } catch (err) {
        console.error(err);
        setError("Error al leer el archivo Excel. Por favor, asegúrate de que tiene un formato válido.");
      }
    };

    reader.onerror = () => {
      setError("Error al leer el archivo.");
    };

    reader.readAsBinaryString(file);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
      handleFileUpload(file);
    } else {
      setError("Por favor, sube un archivo Excel (.xlsx, .xls) o CSV.");
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Editing logic
  const handleCellChange = (rowIndex: number, column: string, value: string) => {
    const updatedProducts = [...products];
    updatedProducts[rowIndex][column] = value;
    setProducts(updatedProducts);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const updatedProducts = products.filter((_, idx) => idx !== rowIndex);
    setProducts(updatedProducts);
  };

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishToStore = async () => {
    if (products.length === 0) return;
    setIsPublishing(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.details || data?.error || 'Error desconocido al publicar los productos');
      }

      alert('¡Productos publicados exitosamente en la tienda!');
    } catch (err: any) {
      console.error(err);
      alert('Hubo un error al publicar: ' + (err.message || 'Verifica la consola.'));
    } finally {
      setIsPublishing(false);
    }
  };

  const handleExportExcel = () => {
    if (products.length === 0) return;
    
    const worksheet = xlsx.utils.json_to_sheet(products);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Productos");
    
    // Generate buffer and download
    xlsx.writeFile(workbook, "productos_actualizados.xlsx");
  };

  // Get dynamic headers from the first row of products
  // Even if products is empty, we might have had headers, but for now this works:
  const headers = products.length > 0 ? Object.keys(products[0]) : [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Package className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Inventario</h1>
          </div>
          {products.length > 0 && (
            <div className="flex space-x-4">
              <button
                onClick={handleExportExcel}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm font-medium"
              >
                <Download className="w-5 h-5 mr-2" />
                Descargar Backup Excel
              </button>
              <button
                onClick={handlePublishToStore}
                disabled={isPublishing}
                className={`flex items-center px-4 py-2 text-white rounded-lg transition-colors shadow-sm font-medium ${isPublishing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                <Save className="w-5 h-5 mr-2" />
                {isPublishing ? 'Publicando...' : 'Publicar en la tienda'}
              </button>
            </div>
          )}
        </header>

        {products.length === 0 ? (
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-gray-500" />
              Cargar Productos Iniciales
            </h2>

            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer
                ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx, .xls, .csv"
                onChange={onFileChange}
                className="hidden"
              />
              
              <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700">
                Arrastra tu archivo Excel aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Soporta archivos .xlsx, .xls y .csv
              </p>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </section>
        ) : (
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Edit2 className="w-5 h-5 mr-2 text-blue-500" />
                Editor de Productos
              </h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {products.length} productos
              </span>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Haz clic en cualquier celda para editar su contenido. Si necesitas poner una imagen, pega directamente el link (URL) de la imagen. Al terminar, dale a "Descargar Excel Modificado".
            </p>
            
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-600 uppercase bg-gray-100">
                  <tr>
                    {headers.map((header) => (
                      <th key={header} className="px-6 py-4 font-bold border-b border-gray-200">
                        {header}
                      </th>
                    ))}
                    <th className="px-6 py-4 font-bold border-b border-gray-200 text-center text-red-500">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 transition-colors group">
                      {headers.map((header) => (
                        <td 
                          key={header} 
                          className="px-6 py-3 whitespace-nowrap text-gray-700 cursor-text"
                          onClick={() => setEditingCell({ row: rowIndex, col: header })}
                        >
                          {editingCell?.row === rowIndex && editingCell?.col === header ? (
                            <input
                              type="text"
                              autoFocus
                              className="w-full px-2 py-1 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={row[header] || ""}
                              onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") setEditingCell(null);
                              }}
                            />
                          ) : (
                            <div className="flex items-center h-8">
                              {/* Simple heuristic to show images if the value looks like a URL and header contains 'imag' */}
                              {String(row[header]).startsWith('http') && header.toLowerCase().includes('imag') ? (
                                <img src={String(row[header])} alt="preview" className="h-8 w-8 object-cover rounded shadow-sm mr-2" />
                              ) : null}
                              <span className="truncate max-w-[200px]">
                                {row[header] !== undefined ? String(row[header]) : "-"}
                              </span>
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => handleDeleteRow(rowIndex)}
                          className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-2"
                          title="Eliminar Producto"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Action to upload a new excel replacing the current one */}
             <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
               <button 
                 onClick={() => setProducts([])}
                 className="text-sm text-gray-500 hover:text-gray-800 underline transition-colors"
               >
                 Cargar un archivo diferente
               </button>
             </div>
          </section>
        )}

      </div>
    </div>
  );
}
