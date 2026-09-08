import React, { useState } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { erpService } from '../../../services/erpService';
import { PublicEvent } from '../../../types';

interface EventsPageProps {
  onNavigate: (route: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onNavigate }) => {
  const events = erpService.getPublicEvents();
  const [selectedEvent, setSelectedEvent] = useState<PublicEvent | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', church: '' });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterSuccess(true);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Seminary Calendar
            </div>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Conferences, Lectures & Chapel Events
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Join us on campus and online for transformative theological lectures, pastors' conferences, and spiritual revival gatherings.
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 hover:border-amber-500/40 hover:shadow-xl transition-all flex flex-col sm:flex-row gap-6 items-start justify-between"
            >
              <div className="flex items-start gap-5">
                {/* Date Block */}
                <div className="w-16 h-20 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-amber-700">
                    {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="font-serif font-black text-2xl leading-none my-0.5">
                    {new Date(evt.date).getDate()}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(evt.date).getFullYear()}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                      {evt.category}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700">
                      {evt.fee}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-slate-950 mb-2">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 max-w-2xl">
                    {evt.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{evt.time}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{evt.venue}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  setSelectedEvent(evt);
                  setRegisterSuccess(false);
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 self-end sm:self-center transition-colors cursor-pointer shadow-xs"
              >
                <span>Event Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Registration Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {registerSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-slate-950 mb-2">
                  Registration Confirmed!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Thank you, {regForm.name}. A confirmation pass for <strong>{selectedEvent.title}</strong> has been sent to your email.
                </p>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 mb-2 inline-block">
                  {selectedEvent.category} • {selectedEvent.fee}
                </span>

                <h3 className="font-serif font-bold text-2xl text-slate-950 mb-2">
                  {selectedEvent.title}
                </h3>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  {selectedEvent.description}
                </p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1 mb-6">
                  <div><strong>Date:</strong> {selectedEvent.date}</div>
                  <div><strong>Time:</strong> {selectedEvent.time}</div>
                  <div><strong>Location:</strong> {selectedEvent.venue}</div>
                </div>

                <form onSubmit={handleRegister} className="space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                    Reserve Your Seat
                  </h4>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Your Email Address"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Church / Institution Name"
                      value={regForm.church}
                      onChange={(e) => setRegForm({ ...regForm, church: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl mt-2 cursor-pointer shadow-md"
                  >
                    Confirm Registration
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
