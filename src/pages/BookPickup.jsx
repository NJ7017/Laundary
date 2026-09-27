import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BookPickup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, showToast } = useAuth();

  // Prefill state from Home calculator or default
  const prefilled = location.state || {};

  // Form State - Allow starting at 0 kg or prefilled kg
  const [washFoldKg, setWashFoldKg] = useState(prefilled.prefilledWeight !== undefined ? prefilled.prefilledWeight : 0);
  const [dryCleanItems, setDryCleanItems] = useState(0);
  const [comforters, setComforters] = useState(0);
  const [botanicalAddon, setBotanicalAddon] = useState(prefilled.prefilledEco ?? false);
  const [stainTreatment, setStainTreatment] = useState(false);

  // Scheduling State
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 172800000).toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(tomorrow);
  const [pickupSlot, setPickupSlot] = useState('Morning (8:00 AM - 11:00 AM)');
  const [deliveryDate, setDeliveryDate] = useState(dayAfter);
  const [deliverySlot, setDeliverySlot] = useState('Afternoon (1:00 PM - 4:00 PM)');

  // Contact & Address Details (Indian Context)
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState(user ? user.phone : '+91 98234 56789');
  const [address, setAddress] = useState(user ? user.address : 'Tower 4, Flat 602, Blue Ridge, Hinjawadi Phase 1');
  const [city, setCity] = useState('Pune');
  const [pincode, setPincode] = useState('411057');
  const [specialNotes, setSpecialNotes] = useState('Leave with tower security or ring bell.');

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automatically sync user fields when user logs in
  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
      if (user.address && !address) setAddress(user.address);
      if (user.phone && !phone) setPhone(user.phone);
    }
  }, [user]);

  // Pricing math in INR (₹)
  const RATE_WASH_FOLD_PER_KG = 89;
  const RATE_DRY_CLEAN = 149;
  const RATE_BEDDING = 299;
  const RATE_BOTANICAL = 99;
  const RATE_STAIN = 79;
  const FREE_DELIVERY_THRESHOLD = 499;
  const STANDARD_DELIVERY_FEE = 49;

  const washFoldTotal = washFoldKg * RATE_WASH_FOLD_PER_KG;
  const dryCleanTotal = dryCleanItems * RATE_DRY_CLEAN;
  const comforterTotal = comforters * RATE_BEDDING;
  const addonTotal = (botanicalAddon ? RATE_BOTANICAL : 0) + (stainTreatment ? RATE_STAIN : 0);

  const subtotal = washFoldTotal + dryCleanTotal + comforterTotal + addonTotal;
  const hasItems = (washFoldKg > 0) || (dryCleanItems > 0) || (comforters > 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  const finalTotal = Math.max(0, subtotal + deliveryFee - appliedDiscount).toFixed(2);

  const handleApplyPromo = () => {
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'FIRSTWASH' || clean === 'WELCOME100') {
      setAppliedDiscount(100.00);
      showToast('Promo code applied: ₹100.00 OFF!', 'success');
    } else if (clean === 'FREESHIP') {
      setAppliedDiscount(STANDARD_DELIVERY_FEE);
      showToast('Promo code applied: Free Doorstep Delivery!', 'success');
    } else {
      showToast('Invalid promo code. Try FIRSTWASH or WELCOME100', 'error');
    }
  };

  const handleWeightChange = (val) => {
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) {
      setWashFoldKg(0);
    } else {
      setWashFoldKg(Math.round(num * 10) / 10);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!hasItems) {
      showToast('Please choose at least 1 garment item or enter wash weight (kg).', 'error');
      return;
    }

    if (!name || !address || !pincode || !pickupDate) {
      showToast('Please fill in your name, pickup address, and date.', 'error');
      return;
    }

    setIsSubmitting(true);

    const items = [];
    if (washFoldKg > 0) items.push({ name: 'Everyday Wash & Fold', quantity: washFoldKg, unit: 'kg', pricePerUnit: RATE_WASH_FOLD_PER_KG });
    if (dryCleanItems > 0) items.push({ name: 'Dry Cleaned Garments', quantity: dryCleanItems, unit: 'pcs', pricePerUnit: RATE_DRY_CLEAN });
    if (comforters > 0) items.push({ name: 'Double Bed Blanket / Quilt', quantity: comforters, unit: 'pcs', pricePerUnit: RATE_BEDDING });
    if (botanicalAddon) items.push({ name: 'Botanical Sanitizer Add-on', quantity: 1, unit: 'load', pricePerUnit: RATE_BOTANICAL });
    if (stainTreatment) items.push({ name: 'Eco-Enzyme Stain Treatment', quantity: 1, unit: 'service', pricePerUnit: RATE_STAIN });

    const orderPayload = {
      userId: user ? user.id : 'usr_guest',
      customerName: name,
      customerEmail: email || 'guest@aurawash.com',
      customerPhone: phone,
      pickupAddress: `${address}, ${city} - ${pincode}`,
      pickupDate,
      pickupTimeSlot: pickupSlot,
      deliveryDate,
      deliveryTimeSlot: deliverySlot,
      services: ['Wash & Fold', botanicalAddon ? 'Botanical Eco-Wash' : 'Standard Care'],
      items,
      subtotal,
      deliveryFee,
      discount: appliedDiscount,
      total: Number(finalTotal),
      paymentMethod: 'UPI / Cash on Delivery',
      specialInstructions: specialNotes
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to place order');

      showToast(`Order ${data.order.id} scheduled successfully!`, 'success');
      navigate(`/track-order?id=${data.order.id}`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-10 md:py-16">
      
      {/* Header */}
      <div className="flex flex-col gap-2 mb-10">
        <span className="text-xs font-bold text-secondary uppercase tracking-widest">Doorstep Laundry Service</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface">Book a Pickup</h1>
        <p className="text-xs md:text-sm text-on-surface-variant">
          Select garments, specify laundry weight in kg (or start at 0 kg for dry cleaning only), and pick a convenient slot.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Step Configuration */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* STEP 1: Garment Services & Quantities */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-white font-extrabold text-xs flex items-center justify-center">1</span>
              <div>
                <h3 className="text-base font-bold text-on-surface">Choose Garments & Weight (in kg)</h3>
                <p className="text-[11px] text-on-surface-variant">
                  You can set weight to 0 kg if you only need Dry Cleaning or Bedding. Certified digital scale verification at pickup.
                </p>
              </div>
            </div>

            {/* Wash & Fold Counter (Allows 0 kg) */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">local_laundry_service</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Everyday Wash & Fold</h4>
                  <p className="text-[11px] text-on-surface-variant">T-shirts, trousers, kurtas, daily wear (₹89/kg)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWashFoldKg((prev) => Math.max(0, Math.round((prev - 1) * 10) / 10))}
                  className="w-9 h-9 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-center font-bold text-base hover:bg-surface-container transition-colors"
                  title="Decrease weight"
                >
                  -
                </button>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={washFoldKg}
                    onChange={(e) => handleWeightChange(e.target.value)}
                    className="w-20 px-2 py-1.5 text-center font-extrabold text-sm text-primary bg-surface-container-lowest border border-surface-container rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-xs font-bold text-on-surface-variant ml-1.5">kg</span>
                </div>
                <button
                  type="button"
                  onClick={() => setWashFoldKg((prev) => Math.round((prev + 1) * 10) / 10)}
                  className="w-9 h-9 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-center font-bold text-base hover:bg-surface-container transition-colors"
                  title="Increase weight"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dry Clean Items Counter */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">dry_cleaning</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Dry Cleaning & Steam Press</h4>
                  <p className="text-[11px] text-on-surface-variant">Suits, blazers, sarees, delicate silk, sherwanis (₹149/pc)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDryCleanItems(Math.max(0, dryCleanItems - 1))}
                  className="w-9 h-9 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-center font-bold text-base hover:bg-surface-container transition-colors"
                >
                  -
                </button>
                <span className="font-extrabold text-sm text-secondary min-w-[50px] text-center">
                  {dryCleanItems} pcs
                </span>
                <button
                  type="button"
                  onClick={() => setDryCleanItems(dryCleanItems + 1)}
                  className="w-9 h-9 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-center font-bold text-base hover:bg-surface-container transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Comforters & Bulky Bedding */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">bed</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Blankets, Quilts & Bedding</h4>
                  <p className="text-[11px] text-on-surface-variant">Heavy winter blankets, duvets, razai, bedsheets (₹299/pc)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setComforters(Math.max(0, comforters - 1))}
                  className="w-9 h-9 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-center font-bold text-base hover:bg-surface-container transition-colors"
                >
                  -
                </button>
                <span className="font-extrabold text-sm text-primary min-w-[50px] text-center">
                  {comforters} pcs
                </span>
                <button
                  type="button"
                  onClick={() => setComforters(comforters + 1)}
                  className="w-9 h-9 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-center font-bold text-base hover:bg-surface-container transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add-ons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div
                onClick={() => setBotanicalAddon(!botanicalAddon)}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  botanicalAddon ? 'border-secondary bg-secondary/5 ring-1 ring-secondary' : 'border-surface-container bg-surface-container-lowest'
                }`}
              >
                <input type="checkbox" checked={botanicalAddon} onChange={() => {}} className="accent-secondary" />
                <div>
                  <span className="text-xs font-bold text-on-surface block">Botanical Sanitizer (+₹99)</span>
                  <span className="text-[11px] text-on-surface-variant">Hospital-grade hygiene & delicate fragrance.</span>
                </div>
              </div>

              <div
                onClick={() => setStainTreatment(!stainTreatment)}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  stainTreatment ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-surface-container bg-surface-container-lowest'
                }`}
              >
                <input type="checkbox" checked={stainTreatment} onChange={() => {}} className="accent-primary" />
                <div>
                  <span className="text-xs font-bold text-on-surface block">Pre-Wash Stain Care (+₹79)</span>
                  <span className="text-[11px] text-on-surface-variant">Enzymatic spot treatment for stubborn marks.</span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: Scheduling Windows */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-white font-extrabold text-xs flex items-center justify-center">2</span>
              <div>
                <h3 className="text-base font-bold text-on-surface">Pickup & Delivery Timing</h3>
                <p className="text-[11px] text-on-surface-variant">Electric delivery vans operate 7 days a week.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup Window */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-on-surface">Pickup Date:</label>
                <input
                  type="date"
                  value={pickupDate}
                  min={today}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-semibold bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                />

                <label className="text-xs font-bold text-on-surface mt-2">Pickup Time Slot:</label>
                <select
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-semibold bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option>Morning (8:00 AM - 11:00 AM)</option>
                  <option>Afternoon (1:00 PM - 4:00 PM)</option>
                  <option>Evening (5:00 PM - 8:00 PM)</option>
                </select>
              </div>

              {/* Delivery Window */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-on-surface">Delivery Date (24-48 hrs):</label>
                <input
                  type="date"
                  value={deliveryDate}
                  min={pickupDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-semibold bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                />

                <label className="text-xs font-bold text-on-surface mt-2">Delivery Time Slot:</label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-semibold bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option>Morning (8:00 AM - 11:00 AM)</option>
                  <option>Afternoon (1:00 PM - 4:00 PM)</option>
                  <option>Evening (5:00 PM - 8:00 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 3: Address & Notes */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-white font-extrabold text-xs flex items-center justify-center">3</span>
              <div>
                <h3 className="text-base font-bold text-on-surface">Address & Delivery Notes</h3>
                <p className="text-[11px] text-on-surface-variant">Where should our van captain collect and return your garments?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Your Full Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Phone Number for Driver SMS/WhatsApp:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-on-surface block mb-1">Society / Building / Flat / Street:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat 402, Wing B, Green Glen Layout, Hinjawadi"
                  className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">City:</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Pune"
                  className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">6-Digit PIN Code:</label>
                <input
                  type="text"
                  maxLength="6"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="411057"
                  className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-mono font-bold bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-on-surface block mb-1">Security / Gate Instructions:</label>
                <textarea
                  rows="2"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Leave with building security guard, call on arrival..."
                  className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary/20"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Order Summary */}
        <div className="lg:col-span-4 sticky top-28 bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-xl flex flex-col gap-6">
          <h3 className="text-base font-extrabold text-on-surface pb-3 border-b border-surface-container">
            Price Estimate
          </h3>

          <div className="flex flex-col gap-3 text-xs">
            {washFoldKg > 0 ? (
              <div className="flex justify-between text-on-surface-variant">
                <span>Everyday Wash & Fold ({washFoldKg} kg)</span>
                <span className="font-semibold text-on-surface">₹{washFoldTotal.toFixed(2)}</span>
              </div>
            ) : (
              <div className="flex justify-between text-on-surface-variant text-[11px] italic">
                <span>Wash & Fold: 0 kg (None selected)</span>
                <span>₹0.00</span>
              </div>
            )}

            {dryCleanItems > 0 && (
              <div className="flex justify-between text-on-surface-variant">
                <span>Dry Cleaning ({dryCleanItems} pcs)</span>
                <span className="font-semibold text-on-surface">₹{dryCleanTotal.toFixed(2)}</span>
              </div>
            )}

            {comforters > 0 && (
              <div className="flex justify-between text-on-surface-variant">
                <span>Bedding & Blankets ({comforters} pcs)</span>
                <span className="font-semibold text-on-surface">₹{comforterTotal.toFixed(2)}</span>
              </div>
            )}

            {botanicalAddon && (
              <div className="flex justify-between text-on-surface-variant">
                <span>Botanical Sanitizer Add-on</span>
                <span className="font-semibold text-on-surface">₹{RATE_BOTANICAL}.00</span>
              </div>
            )}

            {stainTreatment && (
              <div className="flex justify-between text-on-surface-variant">
                <span>Pre-Wash Stain Care</span>
                <span className="font-semibold text-on-surface">₹{RATE_STAIN}.00</span>
              </div>
            )}

            <div className="flex justify-between text-on-surface-variant pt-2 border-t border-surface-container">
              <span>Doorstep Pickup & Delivery</span>
              <span className={`font-semibold ${deliveryFee === 0 ? 'text-secondary font-bold' : 'text-on-surface'}`}>
                {deliveryFee === 0 ? 'FREE (Orders > ₹499)' : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            {appliedDiscount > 0 && (
              <div className="flex justify-between text-secondary font-bold">
                <span>Promotional Discount</span>
                <span>-₹{appliedDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline pt-3 border-t border-surface-container text-base font-extrabold text-on-surface">
              <span>Estimated Total:</span>
              <span className="text-3xl text-primary font-black">₹{finalTotal}</span>
            </div>
          </div>

          {/* Promo code input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Code: FIRSTWASH"
              className="w-full px-3 py-2 rounded-xl border border-surface-container text-xs uppercase font-mono outline-none"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              className="px-4 py-2 bg-surface-container text-xs font-bold rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !hasItems}
            className={`w-full py-4 text-on-primary font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
              hasItems
                ? 'bg-gradient-to-r from-primary to-primary-container shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 cursor-pointer'
                : 'bg-surface-container-high text-on-surface-variant opacity-60 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <span>Scheduling Van...</span>
            ) : !hasItems ? (
              <span>Select Garments / Enter Weight (kg)</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>Confirm & Schedule Pickup</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-on-surface-variant">
            Zero advance payment. Pay via UPI / Cash upon doorstep delivery.
          </p>
        </div>
      </form>
    </div>
  );
}
