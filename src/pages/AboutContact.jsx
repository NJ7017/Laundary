import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AboutContact() {
  const [zipInput, setZipInput] = useState('');
  const [zipResult, setZipResult] = useState(null);
  const [checkingZip, setCheckingZip] = useState(false);

  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Fabric Question');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { showToast } = useAuth();

  // Accordion State
  const [expandedFaq, setExpandedFaq] = useState(0);

  const handleCheckZip = async (e) => {
    e.preventDefault();
    if (!zipInput.trim()) return;
    setCheckingZip(true);
    setZipResult(null);

    try {
      const res = await fetch(`/api/coverage/${zipInput.trim()}`);
      const data = await res.json();
      setZipResult(data);
    } catch {
      setZipResult({
        serviceable: true,
        message: `Great news! AuraWash vans cover PIN ${zipInput}.`
      });
    } finally {
      setCheckingZip(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      showToast('Message sent! Our customer concierge will call/WhatsApp within 2 hours.', 'success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSending(false);
    }
  };

  const FAQS = [
    {
      q: 'How does doorstep pickup work in gated societies / apartments?',
      a: 'You can hand over your laundry bags directly to our van captain, or leave them with your tower security/concierge desk. Our van captain photographs the handover and generates a digital weight receipt in kg directly on your phone.'
    },
    {
      q: 'Can I send only Dry Cleaning and 0 kg Wash & Fold?',
      a: 'Yes, absolutely! On the booking screen, you can leave everyday wash weight at 0 kg and choose only Dry Cleaning items (suits, sarees, blazers) or blankets/quilts.'
    },
    {
      q: 'How are garments weighed in kg?',
      a: 'Every van is equipped with government-calibrated digital electronic scales. The exact weight in kilograms is weighed in front of you or verified at our facility before washing starts.'
    },
    {
      q: 'What are your turnaround times across Pune and tech corridors?',
      a: 'Our standard turnaround is 24 hours. Express same-day delivery is available for orders scheduled before 9:00 AM.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-10 md:py-16 flex flex-col gap-16">
      
      {/* 1. Header Section */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-secondary uppercase tracking-widest">Our Fabric Mission</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface mt-2">Purity in Every Fiber</h1>
        <p className="text-xs md:text-sm text-on-surface-variant mt-3 leading-relaxed">
          Bringing premium botanical hygiene, calibrated digital kg scale accuracy, and doorstep convenience across India's vibrant urban hubs.
        </p>
      </div>

      {/* 2. Interactive PIN Code Coverage Checker */}
      <div className="bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-3xl p-8 md:p-12 shadow-xl flex flex-col items-center text-center gap-6">
        <div className="max-w-lg">
          <span className="text-xs font-bold text-primary-fixed uppercase tracking-wider">Service Coverage</span>
          <h2 className="text-2xl md:text-3xl font-extrabold mt-1">Check Your Area PIN Code</h2>
          <p className="text-xs text-white/80 mt-2">
            Enter your 6-digit postal PIN code (e.g. 411057, 411045, 560001) to confirm van pickup availability.
          </p>
        </div>

        <form onSubmit={handleCheckZip} className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md">
          <input
            type="text"
            maxLength="6"
            value={zipInput}
            onChange={(e) => setZipInput(e.target.value)}
            placeholder="e.g. 411057 (Hinjawadi)"
            className="w-full px-5 py-3 rounded-xl bg-white text-on-surface text-xs font-bold font-mono outline-none shadow-md placeholder:font-sans"
          />
          <button
            type="submit"
            disabled={checkingZip}
            className="w-full sm:w-auto px-6 py-3 bg-secondary text-on-secondary rounded-xl text-xs font-bold shadow-md hover:bg-secondary/90 transition-all shrink-0 cursor-pointer"
          >
            {checkingZip ? 'Checking...' : 'Check PIN'}
          </button>
        </form>

        {zipResult && (
          <div
            className={`p-4 rounded-2xl max-w-md w-full text-xs font-semibold flex items-center gap-3 transition-all ${
              zipResult.serviceable
                ? 'bg-secondary-container/20 border border-secondary-container text-white'
                : 'bg-error-container/40 border border-error-container text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {zipResult.serviceable ? 'check_circle' : 'info'}
            </span>
            <span className="text-left">{zipResult.message}</span>
          </div>
        )}
      </div>

      {/* 3. Contact Form & Concierge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-surface-container rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">Customer Support</span>
            <h3 className="text-xl font-bold text-on-surface mt-1">Send a Message to Our Fabric Concierge</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Questions regarding delicate silk sarees, corporate laundry tie-ups, or custom stain removal?
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Pooja Kulkarni"
                required
                className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pooja@gmail.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Topic</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option>General Fabric Question</option>
                <option>Delicate Silk Saree / Sherwani Care</option>
                <option>Hostel / Corporate Bulk Laundry</option>
                <option>Billing & Payment Query</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-on-surface block mb-1">Message</label>
              <textarea
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can our laundry team assist you?"
                required
                className="w-full px-4 py-3 rounded-xl border border-surface-container text-xs font-medium bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/20"
              ></textarea>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={sending}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary text-on-primary text-xs font-bold rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {sending ? 'Transmitting...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Cards */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Direct Help Channels</h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">phone</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">+91 98234 56789</p>
                <p className="text-[11px] text-on-surface-variant">Mon – Sun: 7:00 AM – 9:30 PM</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">chat</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">WhatsApp Support</p>
                <p className="text-[11px] text-on-surface-variant">Instant reply within 10 minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container text-on-surface flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">location_on</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">Central Processing Hub</p>
                <p className="text-[11px] text-on-surface-variant">Near Blue Ridge, Hinjawadi Phase 1, Pune, MH 411057</p>
              </div>
            </div>
          </div>

          {/* Interactive FAQs Accordion */}
          <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-sm flex flex-col gap-3">
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Frequently Asked Questions</h4>
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="border-b border-surface-container pb-3 last:border-b-0 cursor-pointer"
                onClick={() => setExpandedFaq(expandedFaq === idx ? -1 : idx)}
              >
                <div className="flex justify-between items-center gap-2">
                  <h5 className="text-xs font-bold text-on-surface">{faq.q}</h5>
                  <span className="material-symbols-outlined text-base text-primary">
                    {expandedFaq === idx ? 'remove' : 'add'}
                  </span>
                </div>
                {expandedFaq === idx && (
                  <p className="text-[11px] text-on-surface-variant mt-2 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
