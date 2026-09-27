import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [weightKg, setWeightKg] = useState(6);
  const [selectedService, setSelectedService] = useState('wash-fold');
  const [ecoAddon, setEcoAddon] = useState(true);

  // Pricing math in INR (₹)
  const RATE_WASH_FOLD = 89; // per kg
  const RATE_DRY_CLEAN = 149;
  const RATE_BEDDING = 299;
  const RATE_ECO = 99;

  const baseRate = selectedService === 'wash-fold' ? RATE_WASH_FOLD : selectedService === 'dry-clean' ? RATE_DRY_CLEAN : RATE_BEDDING;
  const subtotal = (weightKg * baseRate) + (ecoAddon ? RATE_ECO : 0);
  const delivery = subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 49;
  const estimatedTotal = (subtotal + delivery).toFixed(2);

  const handleBookNow = () => {
    navigate('/book-pickup', {
      state: {
        prefilledWeight: weightKg,
        prefilledService: selectedService,
        prefilledEco: ecoAddon
      }
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Ambient Glow Accents */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-primary-fixed/40 via-secondary-container/20 to-transparent blur-3xl pointer-events-none rounded-full"></div>

        {/* 1. HERO SECTION */}
        <section className="relative max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop pt-10 md:pt-16 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start gap-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high text-primary text-xs font-semibold shadow-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span>Hospital-Grade Botanical Sanitization</span>
                <span className="text-outline-variant">•</span>
                <span className="font-bold text-on-surface">Available in Pune & Tech Hubs</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tight leading-[1.15]">
                Doorstep Laundry & Dry Cleaning,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">
                  Starting ₹89/kg
                </span>
              </h1>

              <p className="text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed">
                Crisp, sanitized, and neatly folded garments delivered back in 24 hours. Zero chemicals, organic fabric conditioners, free pickup above ₹499, and zero weekend chores.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2">
                <Link
                  to="/book-pickup"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all text-center"
                >
                  <span>Book a Pickup</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface text-sm font-semibold px-6 py-4 rounded-xl transition-all"
                >
                  <span className="material-symbols-outlined text-primary text-xl">calculate</span>
                  <span>Estimate by kg</span>
                </a>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-on-surface-variant">
                <span className="inline-flex items-center gap-1.5 text-secondary font-semibold">
                  <span className="material-symbols-outlined text-base">verified</span>
                  Free Doorstep Pickup & Return above ₹499
                </span>
                <span className="inline-flex items-center gap-1.5 text-primary font-semibold">
                  <span className="material-symbols-outlined text-base">eco</span>
                  100% Eco-Friendly Detergents
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual Feature Card */}
            <div className="lg:col-span-5 relative">
              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 md:p-8 shadow-2xl shadow-primary/10 flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                      <span className="material-symbols-outlined text-2xl">local_shipping</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-on-surface">Next Pickup Slot</h3>
                      <p className="text-xs text-secondary font-semibold">Today • 2:00 PM – 4:00 PM</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary-container/30 text-secondary text-xs font-bold">
                    Vans Active
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Live Order in Progress:</span>
                    <span className="font-mono font-bold text-primary">AW-9482</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-3/5 animate-pulse"></div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-on-surface-variant">
                    <span>Van Dispatched</span>
                    <span className="text-secondary font-semibold">Wash & Steam (Active)</span>
                    <span>Delivered</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container">
                    <span className="block text-2xl font-extrabold text-primary">24 hrs</span>
                    <span className="text-[11px] text-on-surface-variant font-medium">Fast Turnaround</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container">
                    <span className="block text-2xl font-extrabold text-secondary">₹89/kg</span>
                    <span className="text-[11px] text-on-surface-variant font-medium">Transparent Pricing</span>
                  </div>
                </div>

                <Link
                  to="/track-order?id=AW-9482"
                  className="w-full py-3 text-center text-xs font-bold text-primary bg-primary-fixed/40 hover:bg-primary-fixed rounded-xl transition-all border border-primary-fixed flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">visibility</span>
                  <span>View Sample Live Order Tracker</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 2. INTERACTIVE PRICING CALCULATOR (IN KG) */}
      <section id="calculator" className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-16 w-full">
        <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 md:p-12 shadow-xl shadow-primary/5 flex flex-col gap-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">Clear Rates in Kilograms</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface mt-1">Instant Price Estimator</h2>
            <p className="text-xs md:text-sm text-on-surface-variant mt-2">
              No hidden laundry charges. Adjust your load in kg (starts from 0 kg) to preview your exact estimate.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-2">Select Primary Care:</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'wash-fold', name: 'Wash & Fold', rate: '₹89/kg', icon: 'local_laundry_service' },
                    { id: 'dry-clean', name: 'Dry Clean & Press', rate: '₹149/pc', icon: 'dry_cleaning' },
                    { id: 'bedding', name: 'Blankets & Quilts', rate: '₹299/pc', icon: 'bed' }
                  ].map((srv) => (
                    <button
                      key={srv.id}
                      onClick={() => setSelectedService(srv.id)}
                      className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        selectedService === srv.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                          : 'border-surface-container bg-surface-container-lowest hover:bg-surface-container-low'
                      }`}
                    >
                      <span className="material-symbols-outlined text-primary text-xl">{srv.icon}</span>
                      <span className="text-xs font-bold text-on-surface">{srv.name}</span>
                      <span className="text-[11px] text-on-surface-variant">{srv.rate}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider Weight Control (0 kg to 25 kg) */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-on-surface">Garment Weight (in kg):</label>
                  <span className="text-sm font-extrabold text-primary px-3 py-1 bg-surface-container-high rounded-full">
                    {weightKg} kg {weightKg === 0 ? '(0 kg selected)' : `(~${Math.round(weightKg * 3.5)} garments)`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-on-surface-variant font-medium">
                  <span>0 kg (None)</span>
                  <span>5 kg (1-2 persons)</span>
                  <span>12 kg (Family load)</span>
                  <span>25 kg (Bulk wash)</span>
                </div>
              </div>

              {/* Eco Detergent Checkbox */}
              <div
                onClick={() => setEcoAddon(!ecoAddon)}
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-surface-container bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors"
              >
                <input
                  type="checkbox"
                  checked={ecoAddon}
                  onChange={() => {}}
                  className="w-4 h-4 accent-secondary rounded cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Hypoallergenic Botanical Sanitizer (+₹99)</span>
                  <span className="text-[11px] text-on-surface-variant">Zero phosphates, natural organic lavender, fabric softening.</span>
                </div>
              </div>
            </div>

            {/* Right Result Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6 shadow-xl">
              <div className="flex flex-col gap-4">
                <span className="text-xs uppercase tracking-wider text-primary-fixed font-bold">Estimated Quote</span>
                
                <div className="flex justify-between items-center text-xs border-b border-white/20 pb-2">
                  <span>Laundry Service ({weightKg} kg)</span>
                  <span className="font-bold">₹{(weightKg * baseRate).toFixed(2)}</span>
                </div>

                {ecoAddon && (
                  <div className="flex justify-between items-center text-xs border-b border-white/20 pb-2">
                    <span>Botanical Sanitizer Add-on</span>
                    <span className="font-bold">₹99.00</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs border-b border-white/20 pb-2">
                  <span>Doorstep Pickup & Delivery</span>
                  <span className="font-bold text-secondary-container">
                    {delivery === 0 ? 'FREE (Orders > ₹499)' : '₹49.00'}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-sm font-semibold">Estimated Total:</span>
                  <span className="text-3xl font-extrabold tracking-tight">₹{estimatedTotal}</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full py-3.5 bg-white text-primary hover:bg-surface-container-low font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book With This Estimate</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Convenient Steps</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface mt-1">How AuraWash Operates</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Schedule Van Pickup',
              desc: 'Select a 2-hour window. Leave bags with building security, concierge, or hand directly to our van captain.',
              icon: 'calendar_month'
            },
            {
              step: '02',
              title: 'Weighed & Sanitized',
              desc: 'Digital scale weight receipt sent to your phone. Treated with botanical anti-bacterial hygiene solutions.',
              icon: 'sanitizer'
            },
            {
              step: '03',
              title: 'Returned Neatly Folded',
              desc: 'Your clothes return packed in protective reusable garment bags within 24 to 48 hours.',
              icon: 'checkroom'
            }
          ].map((item) => (
            <div key={item.step} className="bg-surface-container-lowest border border-surface-container rounded-3xl p-8 flex flex-col gap-4 relative shadow-sm hover:shadow-md transition-shadow">
              <span className="text-3xl font-extrabold text-primary/20">{item.step}</span>
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">{item.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
