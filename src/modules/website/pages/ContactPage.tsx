import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { erpService } from '../../../services/erpService';

interface ContactPageProps {
  onNavigate: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const settings = erpService.getWebsiteSettings();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Admissions Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    erpService.addContactMessage({
      fullName: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message
    });

    setSubmitted(true);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Get in Touch
            </div>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Contact Grace Seminary
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              We are delighted to assist you with program inquiries, campus tours, admissions consultations, and church partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Seminary Grounds</span>
              <h2 className="font-serif font-black text-3xl text-slate-950 mt-1 mb-4">
                Visit Our Campus
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Situated in the serene and peaceful Karen highlands, our campus provides an environment free of urban noise, ideal for prayer, deep study, and reflection.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-slate-900 mb-0.5">Main Campus Address</h4>
                  <p className="text-slate-600">{settings.contact.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-slate-900 mb-0.5">Telephone & WhatsApp</h4>
                  <p className="text-slate-600">{settings.contact.phone}</p>
                  <p className="text-slate-400 text-[11px]">Admissions Desk: +254 700 123 456</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-slate-900 mb-0.5">Official Email Desks</h4>
                  <p className="text-slate-600">{settings.contact.email}</p>
                  <p className="text-slate-400 text-[11px]">Registrar: registrar@graceseminary.ac.ke</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-slate-900 mb-0.5">Administration Office Hours</h4>
                  <p className="text-slate-600">Monday – Friday: 8:00 AM – 5:00 PM EAT</p>
                  <p className="text-slate-400 text-[11px]">Saturday: 9:00 AM – 1:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-slate-950 mb-2">
                    Message Dispatched Successfully!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto mb-6">
                    Thank you, {form.name}. Our admissions office will respond to <strong>{form.email}</strong> within 24 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', phone: '', subject: 'Admissions Inquiry', message: '' });
                    }}
                    className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-slate-950 mb-1">
                      Send an Inquiry
                    </h3>
                    <p className="text-slate-500 mb-6">
                      Fill out this form and our academic team will contact you promptly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+254 712 345 678"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Subject</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                      >
                        <option value="Admissions Inquiry">Admissions Inquiry</option>
                        <option value="Fee Schedule Question">Fee Schedule Question</option>
                        <option value="Pastoral Scholarship">Pastoral Scholarship</option>
                        <option value="Campus Tour Booking">Campus Tour Booking</option>
                        <option value="Certificate Verification">Certificate Verification</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Your Message *</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
