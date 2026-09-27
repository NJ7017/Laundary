import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlOrderId = searchParams.get('id') || 'AW-9482';

  const [searchId, setSearchId] = useState(urlOrderId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useAuth();

  const fetchOrder = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${id.trim()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order not found');
      setOrder(data.order);
    } catch (err) {
      setError(err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlOrderId) {
      setSearchId(urlOrderId);
      fetchOrder(urlOrderId);
    }
  }, [urlOrderId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setSearchParams({ id: searchId.trim() });
    fetchOrder(searchId.trim());
  };

  const STAGES = [
    { title: 'Order Placed', desc: 'Pickup scheduled & confirmed in system' },
    { title: 'Van Captain Dispatched', desc: 'Driver en route to your society/doorstep' },
    { title: 'Washing & Botanical Sanitization', desc: 'Garments weighed in kg and sanitized' },
    { title: 'Steam Press & Quality Inspection', desc: 'Crisp pressing and breathable packaging' },
    { title: 'Out for Doorstep Delivery', desc: 'Van captain delivering to your address' },
    { title: 'Delivered Clean', desc: 'Garments received & verified' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-10 md:py-16">
      
      {/* Search Bar / Header */}
      <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 md:p-8 mb-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">Real-Time Dispatch</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface">Track Your Laundry</h1>
          <p className="text-xs text-on-surface-variant mt-1">Live digital scale receipts & van captain dispatch telemetry.</p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">search</span>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. AW-9482"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-surface-container text-xs font-mono font-bold bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
          >
            Track
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-bold text-on-surface-variant">Connecting to fleet tracking...</p>
        </div>
      ) : error ? (
        <div className="bg-surface-container-lowest border border-error/20 rounded-3xl p-10 text-center max-w-lg mx-auto flex flex-col gap-4">
          <span className="material-symbols-outlined text-4xl text-error mx-auto">sentiment_dissatisfied</span>
          <h3 className="text-lg font-bold text-on-surface">Order Not Found</h3>
          <p className="text-xs text-on-surface-variant">{error}</p>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => { setSearchId('AW-9482'); fetchOrder('AW-9482'); }}
              className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 cursor-pointer"
            >
              Try Demo Order: AW-9482
            </button>
          </div>
        </div>
      ) : order ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Status & Stepper */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Live Status Hero Card */}
            <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-container">
                <div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase">Order Number</span>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-2xl font-black font-mono text-primary">{order.id}</span>
                    <span className="px-3 py-1 rounded-full bg-secondary-container/40 text-secondary text-xs font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase">Return Window</span>
                  <p className="text-xs font-extrabold text-on-surface mt-0.5">
                    {order.deliveryDate} • {order.deliveryTimeSlot}
                  </p>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="flex flex-col gap-6 pt-2">
                <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Garment Care Lifecycle</h3>
                
                <div className="relative pl-6 flex flex-col gap-8 border-l-2 border-surface-container">
                  {STAGES.map((stage, idx) => {
                    const isDone = idx < order.currentStageIndex;
                    const isCurrent = idx === order.currentStageIndex;

                    return (
                      <div key={stage.title} className="relative flex items-start gap-4">
                        {/* Node circle */}
                        <div
                          className={`absolute -left-[33px] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-secondary text-white'
                              : isCurrent
                              ? 'bg-primary text-white ring-4 ring-primary/20 animate-pulse'
                              : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          {isDone ? (
                            <span className="material-symbols-outlined text-sm">check</span>
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        <div>
                          <h4 className={`text-xs font-bold ${isCurrent ? 'text-primary' : isDone ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                            {stage.title}
                          </h4>
                          <p className="text-[11px] text-on-surface-variant mt-0.5">{stage.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Itemized Order Details */}
            <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-4">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Weight & Itemized Manifest</h3>
              <div className="flex flex-col gap-2">
                {order.items && order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-surface-container text-xs">
                    <span className="font-semibold text-on-surface">
                      {item.quantity} {item.unit} • {item.name}
                    </span>
                    <span className="font-bold text-on-surface-variant">₹{(item.quantity * item.pricePerUnit).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 text-sm font-extrabold text-on-surface">
                <span>Total Amount:</span>
                <span className="text-2xl text-primary font-black">₹{order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Driver Info & Actions */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Driver Contact Card */}
            {order.driver && (
              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-sm flex flex-col gap-5">
                <span className="text-xs font-bold text-secondary uppercase tracking-widest">Assigned Delivery Captain</span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-fixed/50 text-primary flex items-center justify-center text-xl font-black">
                    {order.driver.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">{order.driver.name}</h4>
                    <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                      <span className="text-amber-500 font-bold">★ {order.driver.rating}</span>
                      <span>({order.driver.reviewsCount} trips in Hinjawadi / Pune)</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container text-xs flex flex-col gap-1">
                  <span className="text-on-surface-variant font-medium">Van Fleet:</span>
                  <span className="font-bold text-on-surface">{order.driver.vehicle}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => showToast(`Calling ${order.driver.name} at ${order.driver.phone}...`, 'info')}
                    className="py-2.5 px-3 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                    <span>Call Captain</span>
                  </button>
                  <button
                    onClick={() => showToast(`WhatsApp message opened for ${order.driver.name}`, 'success')}
                    className="py-2.5 px-3 rounded-xl bg-secondary/10 text-secondary text-xs font-bold hover:bg-secondary/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            )}

            {/* Address Details */}
            <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-sm flex flex-col gap-3">
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Pickup / Dropoff Address</h4>
              <p className="text-xs text-on-surface font-semibold">{order.customerName}</p>
              <p className="text-xs text-on-surface-variant">{order.pickupAddress}</p>
              {order.specialInstructions && (
                <div className="p-3 rounded-xl bg-surface-container-low text-[11px] text-on-surface-variant mt-1">
                  <span className="font-bold block text-on-surface">Gate Note:</span>
                  {order.specialInstructions}
                </div>
              )}
            </div>

            <Link
              to="/book-pickup"
              className="w-full py-3.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs rounded-2xl transition-all text-center flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base text-primary">add_circle</span>
              <span>Schedule Another Pickup</span>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
