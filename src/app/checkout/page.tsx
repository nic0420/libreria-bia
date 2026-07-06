"use client";

import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MapPin, Truck, Store, CreditCard, Banknote, Wallet, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type DeliveryMethod = 'home' | 'pickup';
type PaymentMethod = 'mercadopago' | 'wallet' | 'cash';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mercadopago');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  });

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      router.push('/carrito');
    }
  }, [items.length, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const WHATSAPP_NUMBER = "5491100000000"; // Dummy number

  const generateWhatsAppMessage = () => {
    let message = `*¡Hola Librería Bia! Quiero realizar un pedido:*\n\n`;
    
    message += `*📝 Mis Datos:*\n`;
    message += `- Nombre: ${formData.name}\n`;
    message += `- Teléfono: ${formData.phone}\n\n`;

    message += `*🛍️ Mi Pedido:*\n`;
    items.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (${formatPrice(item.price)})\n`;
    });
    message += `\n*💰 Total: ${formatPrice(getTotalPrice())}*\n\n`;

    message += `*🚚 Método de Entrega:*\n`;
    if (deliveryMethod === 'home') {
      message += `Envío a domicilio a coordinar\n`;
      message += `- Dirección: ${formData.address}, ${formData.city}\n`;
    } else {
      message += `Retiro en local / Punto de encuentro\n`;
    }
    message += `\n`;

    message += `*💳 Método de Pago:*\n`;
    if (paymentMethod === 'mercadopago') {
      message += `Mercado Pago (Transferiré al alias)\n`;
    } else if (paymentMethod === 'wallet') {
      message += `Otra Billetera Virtual (Transferiré al CBU/Alias)\n`;
    } else {
      message += `Efectivo (Al retirar/entregar)\n`;
    }

    if (formData.notes) {
      message += `\n*Nota extra:* ${formData.notes}\n`;
    }

    return encodeURIComponent(message);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    // Clear cart (optional, maybe clear only after successful return? Let's clear it now since we send them to WA)
    clearCart();
    
    // Open WA in new tab
    window.open(whatsappUrl, '_blank');
    router.push('/');
  };

  if (!mounted || items.length === 0) return null;

  return (
    <div className="min-h-screen bg-zinc-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb simple */}
        <nav className="flex text-sm text-zinc-500 mb-8 font-medium">
          <Link href="/carrito" className="hover:text-primary-600 transition-colors">Carrito</Link>
          <span className="mx-2 text-zinc-400">/</span>
          <span className="text-zinc-900">Finalizar Compra</span>
        </nav>

        <form onSubmit={handleConfirmOrder} className="flex flex-col lg:flex-row gap-8">
          
          {/* Columna Izquierda: Formularios */}
          <div className="flex-1 space-y-8">
            
            {/* 1. Datos Personales */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-zinc-900">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 text-sm">1</span>
                Tus Datos Personales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre Completo *</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Juan Pérez" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Teléfono (WhatsApp) *</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="11 2345 6789" />
                </div>
              </div>
            </section>

            {/* 2. Método de Entrega */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-zinc-900">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 text-sm">2</span>
                Método de Entrega
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div 
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${deliveryMethod === 'pickup' ? 'border-primary-500 bg-primary-50' : 'border-zinc-200 hover:border-primary-200'}`}
                >
                  <Store className={`w-8 h-8 ${deliveryMethod === 'pickup' ? 'text-primary-600' : 'text-zinc-400'}`} />
                  <span className="font-bold text-center">Retiro en local<br/><span className="text-sm font-normal text-zinc-500">O punto de encuentro</span></span>
                </div>
                <div 
                  onClick={() => setDeliveryMethod('home')}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${deliveryMethod === 'home' ? 'border-primary-500 bg-primary-50' : 'border-zinc-200 hover:border-primary-200'}`}
                >
                  <Truck className={`w-8 h-8 ${deliveryMethod === 'home' ? 'text-primary-600' : 'text-zinc-400'}`} />
                  <span className="font-bold text-center">Envío a domicilio<br/><span className="text-sm font-normal text-zinc-500">A coordinar por WhatsApp</span></span>
                </div>
              </div>

              {deliveryMethod === 'home' && (
                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Dirección completa *</label>
                    <input required={deliveryMethod === 'home'} type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Calle Falsa 123, Piso 2 Depto B" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Localidad / Ciudad *</label>
                    <input required={deliveryMethod === 'home'} type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="CABA" />
                  </div>
                </div>
              )}
            </section>

            {/* 3. Método de Pago */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-zinc-900">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 text-sm">3</span>
                Método de Pago
              </h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'mercadopago' ? 'border-primary-500 bg-primary-50' : 'border-zinc-200'}`}>
                  <input type="radio" name="payment" value="mercadopago" checked={paymentMethod === 'mercadopago'} onChange={() => setPaymentMethod('mercadopago')} className="w-5 h-5 text-primary-600 focus:ring-primary-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Mercado Pago</span>
                      <span className="text-sm text-zinc-500">Transferencia al Alias (ALIAS.MERCADOPAGO)</span>
                    </div>
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'mercadopago' ? 'text-primary-600' : 'text-zinc-400'}`} />
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'wallet' ? 'border-primary-500 bg-primary-50' : 'border-zinc-200'}`}>
                  <input type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className="w-5 h-5 text-primary-600 focus:ring-primary-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Otras Billeteras Virtuales</span>
                      <span className="text-sm text-zinc-500">Transferencia bancaria / CBU (ALIAS.BILLETERA)</span>
                    </div>
                    <Wallet className={`w-6 h-6 ${paymentMethod === 'wallet' ? 'text-primary-600' : 'text-zinc-400'}`} />
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-primary-500 bg-primary-50' : 'border-zinc-200'}`}>
                  <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-5 h-5 text-primary-600 focus:ring-primary-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Efectivo</span>
                      <span className="text-sm text-zinc-500">A coordinar al entregar o retirar</span>
                    </div>
                    <Banknote className={`w-6 h-6 ${paymentMethod === 'cash' ? 'text-primary-600' : 'text-zinc-400'}`} />
                  </div>
                </label>
              </div>

              <div className="mt-6">
                 <label className="block text-sm font-medium text-zinc-700 mb-1">Notas del pedido (Opcional)</label>
                 <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={2} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Ej: Timbre no funciona, dejar en portería..."></textarea>
              </div>
            </section>
          </div>

          {/* Columna Derecha: Resumen */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100 sticky top-24">
              <h3 className="text-xl font-bold text-zinc-900 mb-6 border-b border-zinc-100 pb-4">Tu Pedido</h3>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <div className="absolute -top-1 -right-1 bg-zinc-800 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-900 line-clamp-2">{item.name}</p>
                      <p className="text-sm font-bold text-primary-600">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pt-4 border-t border-zinc-100">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Envío</span>
                  <span className="font-medium text-zinc-900">{deliveryMethod === 'pickup' ? '¡Gratis!' : 'A coordinar'}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-zinc-100">
                  <span className="text-lg font-bold text-zinc-900">Total a pagar</span>
                  <span className="text-2xl font-black text-primary-600">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center h-14 bg-[#25D366] text-white rounded-full font-bold text-lg hover:bg-[#20bd5a] transition-all shadow-md group"
              >
                <Phone className="w-5 h-5 mr-2" />
                Confirmar por WhatsApp
              </button>
              
              <p className="text-xs text-center text-zinc-500 mt-4 px-4">
                Al confirmar, se abrirá WhatsApp con el detalle de tu pedido para coordinar el pago y la entrega.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
