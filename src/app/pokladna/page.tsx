"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronRight, CreditCard, Truck, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/formatPrice";
import { RippleButton } from "@/components/ui/RippleButton";

const steps = [
  { id: 1, label: "Doručenie", icon: User },
  { id: 2, label: "Doprava", icon: Truck },
  { id: 3, label: "Platba", icon: CreditCard },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const { items, totalPrice, clear } = useCartStore();
  const total = totalPrice();

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", zip: "",
    shipping: "standard",
    payment: "card",
  });

  const updateForm = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    setCompleted(true);
    clear();
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-lg"
        >
          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-accent-green/10 rounded-full mb-6"
          >
            <svg viewBox="0 0 52 52" className="w-12 h-12">
              <circle cx="26" cy="26" r="25" fill="none" stroke="#52C97E" strokeWidth="2" />
              <motion.path
                fill="none"
                stroke="#52C97E"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27 l8 8 l16 -16"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            </svg>
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-neutral-900 mb-3">Objednávka prijatá!</h1>
          <p className="text-neutral-600 mb-2">Ďakujeme za váš nákup. Potvrdenie sme zaslali na email.</p>
          <p className="text-sm text-neutral-400 mb-8">Číslo objednávky: <strong>#SD-{Math.random().toString(36).substring(2, 8).toUpperCase()}</strong></p>
          <a href="/">
            <RippleButton className="w-full h-12 bg-primary text-white font-semibold rounded-xl">
              Pokračovať v nakupovaní
            </RippleButton>
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-display text-3xl font-bold text-neutral-900 mb-8 text-center">Pokladňa</h1>

        {/* Progress steps */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    currentStep >= step.id ? "bg-primary text-white" : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle size={18} /> : <step.icon size={16} />}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${currentStep >= step.id ? "text-primary" : "text-neutral-400"}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-12 md:w-20 mx-3 transition-all ${currentStep > step.id ? "bg-primary" : "bg-neutral-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="bg-white rounded-2xl p-6 space-y-4"
                >
                  <h2 className="font-semibold text-lg mb-5">Doručovacie údaje</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-neutral-700 block mb-1">Meno</label>
                      <input value={formData.firstName} onChange={(e) => updateForm("firstName", e.target.value)}
                        className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Ján" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700 block mb-1">Priezvisko</label>
                      <input value={formData.lastName} onChange={(e) => updateForm("lastName", e.target.value)}
                        className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Novák" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 block mb-1">Email</label>
                    <input type="email" value={formData.email} onChange={(e) => updateForm("email", e.target.value)}
                      className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="jan@example.sk" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 block mb-1">Telefón</label>
                    <input type="tel" value={formData.phone} onChange={(e) => updateForm("phone", e.target.value)}
                      className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="+421 900 000 000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 block mb-1">Adresa</label>
                    <input value={formData.address} onChange={(e) => updateForm("address", e.target.value)}
                      className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Hlavná 12" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-neutral-700 block mb-1">Mesto</label>
                      <input value={formData.city} onChange={(e) => updateForm("city", e.target.value)}
                        className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Bratislava" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700 block mb-1">PSČ</label>
                      <input value={formData.zip} onChange={(e) => updateForm("zip", e.target.value)}
                        className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="81101" />
                    </div>
                  </div>
                  <RippleButton onClick={() => setCurrentStep(2)} className="w-full h-12 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 mt-4">
                    Pokračovať <ChevronRight size={16} />
                  </RippleButton>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="bg-white rounded-2xl p-6"
                >
                  <h2 className="font-semibold text-lg mb-5">Spôsob dopravy</h2>
                  <div className="space-y-3">
                    {[
                      { id: "standard", label: "Štandardná doprava", sub: "2–3 pracovné dni", price: "2,90 €" },
                      { id: "express", label: "Expresná doprava", sub: "Nasledujúci pracovný deň", price: "5,90 €" },
                      { id: "pickup", label: "Osobný odber", sub: "Bratislava, Hlavná 12", price: "Zadarmo" },
                    ].map((opt) => (
                      <label key={opt.id} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.shipping === opt.id ? "border-primary bg-primary-light" : "border-neutral-200 hover:border-neutral-300"}`}>
                        <input type="radio" name="shipping" value={opt.id} checked={formData.shipping === opt.id} onChange={(e) => updateForm("shipping", e.target.value)} className="accent-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{opt.label}</p>
                          <p className="text-xs text-neutral-500">{opt.sub}</p>
                        </div>
                        <span className="font-semibold text-sm font-mono-price">{opt.price}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setCurrentStep(1)} className="flex-1 h-12 border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors">
                      Späť
                    </button>
                    <RippleButton onClick={() => setCurrentStep(3)} className="flex-1 h-12 bg-primary text-white font-semibold rounded-xl">
                      Pokračovať →
                    </RippleButton>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="bg-white rounded-2xl p-6"
                >
                  <h2 className="font-semibold text-lg mb-5">Spôsob platby</h2>
                  <div className="space-y-3">
                    {[
                      { id: "card", label: "Platobná karta", sub: "Visa, Mastercard" },
                      { id: "paypal", label: "PayPal", sub: "Bezpečná online platba" },
                      { id: "gopay", label: "GoPay", sub: "Slovenská platobná brána" },
                      { id: "transfer", label: "Bankový prevod", sub: "Platba vopred" },
                    ].map((opt) => (
                      <label key={opt.id} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.payment === opt.id ? "border-primary bg-primary-light" : "border-neutral-200 hover:border-neutral-300"}`}>
                        <input type="radio" name="payment" value={opt.id} checked={formData.payment === opt.id} onChange={(e) => updateForm("payment", e.target.value)} className="accent-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{opt.label}</p>
                          <p className="text-xs text-neutral-500">{opt.sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setCurrentStep(2)} className="flex-1 h-12 border border-neutral-200 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors">
                      Späť
                    </button>
                    <RippleButton onClick={handleComplete} className="flex-1 h-12 bg-accent-green text-white font-semibold rounded-xl">
                      Objednať a zaplatiť ✓
                    </RippleButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-5 sticky top-24">
              <h3 className="font-semibold mb-4">Súhrn ({items.length} pol.)</h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 text-sm">
                    <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100">
                      <img src={item.product.images?.[0] ?? item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-neutral-500">×{item.quantity}</p>
                    </div>
                    <span className="font-mono-price font-bold">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Medzisúčet</span>
                  <span className="font-mono-price">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Doprava</span>
                  <span className={total >= 35 ? "text-accent-green" : "font-mono-price"}>
                    {total >= 35 ? "Zadarmo" : "2,90 €"}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-neutral-100">
                  <span>Celkom</span>
                  <span className="font-mono-price">{formatPrice(total + (total >= 35 ? 0 : 2.90))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
