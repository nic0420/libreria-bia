"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import * as xlsx from "xlsx";
import { 
  Package, Upload, FileSpreadsheet, AlertCircle, Save, 
  Trash2, Edit2, Download, Plus, DollarSign, TrendingUp, 
  ShoppingBag, X, BarChart3, Loader2, Image as ImageIcon
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  discountPrice?: number;
  stock: number;
  category: string;
  image: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'finance' | 'categories'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string, slug: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    id: '', name: '', description: '', price: 0, cost: 0, stock: 0, category: '', image: ''
  });

  // Fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const [resProd, resCat] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      if (resProd.ok) setProducts(await resProd.json());
      if (resCat.ok) setCategories(await resCat.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoCategorize = async () => {
    if (!confirm('¿Quieres asignar categorías automáticamente a todos tus productos? Esto modificará la categoría de los productos.')) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/categorize-run');
      if (res.ok) {
        alert("¡Categorización automática exitosa!");
        await fetchProducts();
      } else {
        alert("Hubo un problema con la categorización");
      }
    } catch (err) {
      alert("Error: " + String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Form handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : undefined) : value
    }));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = !!editingProduct;
      const url = isEditing ? `/api/products/${formData.id}` : '/api/products/new';
      
      // If we don't have a specific POST for single new product, let's just use the PUT route for everything 
      // since the db insert uses ON CONFLICT DO UPDATE.
      const saveUrl = `/api/products/${formData.id || Date.now().toString()}`;

      const res = await fetch(saveUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           ...formData,
           id: formData.id || Date.now().toString()
        }),
      });

      if (!res.ok) throw new Error('Error saving product');
      
      await fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ id: '', name: '', description: '', price: 0, cost: 0, stock: 0, category: '', image: '' });
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error deleting product');
      await fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setFormData({ id: '', name: '', description: '', price: 0, cost: 0, stock: 0, category: '', image: '' });
    setIsModalOpen(true);
  };

  // Excel Logic
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const handleFileUpload = (file: File) => {
    setError(null);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("No data found");
        const workbook = xlsx.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        
        if (json.length === 0) {
          alert("El archivo Excel está vacío.");
          return;
        }

        setIsPublishing(true);
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(json),
        });

        if (!res.ok) throw new Error('Error uploading excel data');
        
        await fetchProducts();
        setIsExcelModalOpen(false);
        alert('Productos subidos con éxito');
      } catch (err) {
        alert("Error al leer/subir el archivo: " + (err instanceof Error ? err.message : String(err)));
      } finally {
        setIsPublishing(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Finance Calculations
  const totalCapital = products.reduce((sum, p) => sum + (Number(p.cost) * Number(p.stock)), 0);
  const potentialProfit = products.reduce((sum, p) => {
    const salePrice = p.discountPrice || p.price;
    return sum + ((Number(salePrice) - Number(p.cost)) * Number(p.stock));
  }, 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + (Number(p.price) * Number(p.stock)), 0);

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <Package className="w-10 h-10 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Panel de Administración</h1>
              <p className="text-gray-500 text-sm">Gestiona tu inventario y finanzas en un solo lugar</p>
            </div>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'products' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Package className="w-4 h-4" /> Inventario
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'finance' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <BarChart3 className="w-4 h-4" /> Finanzas
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'categories' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Package className="w-4 h-4" /> Categorías
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <>
            {/* INVENTORY TAB */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-gray-500" /> Productos ({products.length})
                  </h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsExcelModalOpen(true)}
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-2" /> Importar Excel
                    </button>
                    <button
                      onClick={openNewProductModal}
                      className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium text-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Nuevo Producto
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4">Producto</th>
                          <th className="px-6 py-4">Categoría</th>
                          <th className="px-6 py-4">Precio</th>
                          <th className="px-6 py-4">Costo</th>
                          <th className="px-6 py-4">Stock</th>
                          <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {currentProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-3">
                                {p.image && p.image !== "https://via.placeholder.com/300" ? (
                                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover border border-gray-200" />
                                ) : (
                                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center border border-gray-200">
                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium text-gray-900">{p.name}</div>
                                  <div className="text-xs text-gray-500">ID: {p.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-gray-600">{p.category || '-'}</td>
                            <td className="px-6 py-3">
                              <div className="font-medium">${p.price}</div>
                              {p.discountPrice && <div className="text-xs text-green-600">Oferta: ${p.discountPrice}</div>}
                            </td>
                            <td className="px-6 py-3 text-gray-600">${p.cost || 0}</td>
                            <td className="px-6 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock > 10 ? 'bg-green-100 text-green-800' : p.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                {p.stock} un.
                              </span>
                            </td>
                            <td className="px-6 py-3 text-right">
                              <button onClick={() => openEditModal(p)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {products.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                              No hay productos. Añade uno manualmente o importa un Excel.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                      <span className="text-sm text-gray-500">
                        Mostrando {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, products.length)} de {products.length} productos
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded-md bg-white border border-gray-200 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                        >
                          Anterior
                        </button>
                        <span className="px-3 py-1 text-sm font-medium text-gray-700">
                          Página {currentPage} de {totalPages}
                        </span>
                        <button
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded-md bg-white border border-gray-200 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                        >
                          Siguiente
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FINANCE TAB */}
            {activeTab === 'finance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Capital Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Capital Invertido</h3>
                        <p className="text-2xl font-bold text-gray-900">${totalCapital.toLocaleString('es-AR')}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Costo total de los productos en stock.</p>
                  </div>

                  {/* Profit Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Ganancia Potencial</h3>
                        <p className="text-2xl font-bold text-gray-900">${potentialProfit.toLocaleString('es-AR')}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Ganancia estimada si se vende todo el stock.</p>
                  </div>

                  {/* Valuation Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Valor de Venta (Stock)</h3>
                        <p className="text-2xl font-bold text-gray-900">${totalInventoryValue.toLocaleString('es-AR')}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Valor total de venta al público sin descuentos.</p>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-2">Resumen de Inventario</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Productos Únicos</p>
                      <p className="text-xl font-bold">{products.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Unidades en Stock</p>
                      <p className="text-xl font-bold">{products.reduce((acc, p) => acc + p.stock, 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Categorías Activas</p>
                      <p className="text-xl font-bold">{new Set(products.map(p => p.category).filter(Boolean)).size}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Productos sin stock</p>
                      <p className="text-xl font-bold text-red-500">{products.filter(p => p.stock <= 0).length}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
             {/* CATEGORIES TAB */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-500" /> Gestionar Categorías ({categories.length})
                  </h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAutoCategorize}
                      className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium text-sm"
                    >
                      <Package className="w-4 h-4 mr-2" /> Categorización Automática
                    </button>
                    <button
                      onClick={() => {
                        const name = prompt('Nombre de la nueva categoría:');
                        if (name) {
                           fetch('/api/categories', {
                             method: 'POST',
                             body: JSON.stringify({ name }),
                             headers: { 'Content-Type': 'application/json' }
                           }).then(() => fetchProducts());
                        }
                      }}
                      className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium text-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Nueva Categoría
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">Nombre</th>
                        <th className="px-6 py-4">Slug</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {categories.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3 font-medium text-gray-900">{c.name}</td>
                          <td className="px-6 py-3 text-gray-600">{c.slug}</td>
                          <td className="px-6 py-3 text-right">
                            <button 
                              onClick={() => {
                                const name = prompt('Editar nombre de categoría:', c.name);
                                if (name) {
                                  fetch(`/api/categories/${c.id}`, {
                                    method: 'PUT',
                                    body: JSON.stringify({ name }),
                                    headers: { 'Content-Type': 'application/json' }
                                  }).then(() => fetchProducts());
                                }
                              }} 
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm('¿Seguro que quieres eliminar esta categoría?')) {
                                  fetch(`/api/categories/${c.id}`, { method: 'DELETE' }).then(() => fetchProducts());
                                }
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {categories.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                            No hay categorías. Añade una para empezar.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">ID / Código</label>
                  <input required name="id" value={formData.id} onChange={handleInputChange} disabled={!!editingProduct} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-100" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nombre</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Descripción</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Categoría</label>
                  <select name="category" value={formData.category} onChange={handleInputChange as any} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                    <option value="">Sin Categoría</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Stock</label>
                  <input type="number" required name="stock" value={formData.stock} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Costo ($)</label>
                  <input type="number" step="0.01" name="cost" value={formData.cost} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Precio Regular ($)</label>
                  <input type="number" step="0.01" required name="price" value={formData.price} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Precio de Oferta ($) <span className="text-xs text-gray-400 font-normal">(Opcional)</span></label>
                  <input type="number" step="0.01" name="discountPrice" value={formData.discountPrice || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">URL de Imagen</label>
                  <input name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                  {formData.image && formData.image.startsWith('http') && (
                    <div className="mt-2 flex justify-center bg-gray-50 p-2 rounded border border-gray-200">
                      <img src={formData.image} alt="Preview" className="h-32 object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXCEL UPLOAD MODAL */}
      {isExcelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Importar Excel</h2>
              <button onClick={() => setIsExcelModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx, .xls, .csv"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
                <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="font-medium text-gray-700 mb-1">Haz clic para seleccionar archivo</p>
                <p className="text-xs text-gray-500">Soporta .xlsx, .xls y .csv</p>
                <p className="text-xs text-red-500 mt-4 font-medium">¡Atención! Esto reemplazará todos los productos actuales.</p>
              </div>

              {isPublishing && (
                <div className="mt-4 flex items-center justify-center gap-2 text-primary-600">
                  <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
