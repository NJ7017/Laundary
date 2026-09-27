import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = user ? `/api/orders?userId=${user.id}` : '/api/orders';
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancel = async (orderId) => {
    if (!window.confirm(`Are you sure you want to cancel order ${orderId}?`)) return;

    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel');
      showToast(`Order ${orderId} has been cancelled.`, 'info');
      fetchOrders();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') return o.status !== 'Delivered' && o.status !== 'Cancelled';
    if (filter === 'completed') return o.status === 'Delivered';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-10 md:py-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">Account Dashboard</span>
          <h1 className="text-3xl font-extrabold text-on-surface">My Laundry Orders</h1>
          <p className="text-xs text-on-surface-variant mt-1">Manage active van pickups, view weights in kg, and reorder.</p>
        </div>

        <Link
          to="/book-pickup"
          className="px-5 py-3 bg-primary text-on-primary text-xs font-bold rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Schedule New Pickup</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-surface-container pb-4 mb-8 text-xs font-bold">
        {[
          { id: 'all', label: 'All Orders' },
          { id: 'active', label: 'Active Pickups' },
          { id: 'completed', label: 'Delivered' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-bold text-on-surface-variant">Retrieving your orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-12 text-center max-w-md mx-auto flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">dry_cleaning</span>
          </div>
          <h3 className="text-base font-bold text-on-surface">No Orders Found</h3>
          <p className="text-xs text-on-surface-variant">You don't have any orders matching this filter view.</p>
          <Link
            to="/book-pickup"
            className="px-6 py-3 bg-primary text-on-primary text-xs font-bold rounded-xl mt-2 hover:bg-primary-container transition-all"
          >
            Schedule Your First Pickup
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map((order) => {
            const isCompleted = order.status === 'Delivered';
            const isCancelled = order.status === 'Cancelled';
            const isActive = !isCompleted && !isCancelled;

            return (
              <div
                key={order.id}
                className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:border-primary/30 transition-all"
              >
                {/* Left Info */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-lg font-mono font-black text-primary">{order.id}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        isCompleted
                          ? 'bg-secondary-container/40 text-secondary'
                          : isCancelled
                          ? 'bg-error-container/40 text-error'
                          : 'bg-primary-fixed/50 text-primary'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs text-on-surface-variant">• {order.pickupDate}</span>
                  </div>

                  {/* Garments summary with kg */}
                  <div className="flex flex-wrap gap-2">
                    {order.items &&
                      order.items.map((it, idx) => (
                        <span key={idx} className="px-3 py-1 bg-surface-container-low text-on-surface rounded-lg text-xs font-medium">
                          {it.quantity} {it.unit} • {it.name}
                        </span>
                      ))}
                  </div>

                  {/* Pickup & Return */}
                  <div className="flex flex-col sm:flex-row gap-4 text-xs text-on-surface-variant">
                    <div>
                      <span className="font-bold text-on-surface">Pickup:</span> {order.pickupDate} ({order.pickupTimeSlot})
                    </div>
                    <div>
                      <span className="font-bold text-on-surface">Delivery:</span> {order.deliveryDate} ({order.deliveryTimeSlot})
                    </div>
                  </div>
                </div>

                {/* Right Actions & Total in INR */}
                <div className="flex flex-col items-start md:items-end justify-between gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-surface-container">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] font-bold text-on-surface-variant uppercase">Total Amount</span>
                    <p className="text-2xl font-black text-primary">₹{order.total?.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive && (
                      <>
                        <Link
                          to={`/track-order?id=${order.id}`}
                          className="px-4 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-all flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-base">near_me</span>
                          <span>Track Live</span>
                        </Link>
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="px-3 py-2.5 bg-error/10 text-error rounded-xl text-xs font-bold hover:bg-error/20 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {isCompleted && (
                      <button
                        onClick={() => navigate('/book-pickup')}
                        className="px-4 py-2.5 bg-secondary text-on-secondary rounded-xl text-xs font-bold hover:bg-secondary/90 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">replay</span>
                        <span>Repeat Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
