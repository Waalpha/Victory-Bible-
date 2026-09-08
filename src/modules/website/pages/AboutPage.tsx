import React from 'react';
import { 
  BookOpen, ShieldCheck, Award, Users, CheckCircle2, 
  ArrowRight, Church, HeartHandshake, Compass, ChevronRight 
} from 'lucide-react';
import { erpService } from '../../../services/erpService';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const settings = erpService.getWebsiteSettings();

  const doctrinalPillars = [
    {
      title: '1. The Holy Scriptures',
      desc: 'We affirm that the Bible, consisting of sixty-six books of the Old and New Testaments, is the verbally inspired Word of God, without error in the original manuscripts, and the sole infallible rule of faith and practice.'
    },
    {
      title: '2. The Triune God',
      desc: 'We believe in one God eternally existing in three co-equal and co-eternal persons: the Father, the Son, and the Holy Spirit, each possessing identically all divine attributes and perfections.'
    },
    {
      title: '3. The Lord Jesus Christ',
      desc: 'We affirm the full deity and true humanity of Jesus Christ, His miraculous virgin birth, His sinless life, His miracles, His penal substitutionary death on the cross, His bodily resurrection, and His ascension to the Father.'
    },
    {
      title: '4. The Holy Spirit',
      desc: 'We believe the Holy Spirit regenerates, indwells, baptizes, seals, and sanctifies every believer at conversion, distributing spiritual gifts according to His sovereign will for building the Body of Christ.'
    },
    {
      title: '5. The Human Condition',
      desc: 'We affirm that mankind was created in the image and likeness of God, but through Adam’s rebellion plunged the human race into sin and spiritual death, rendering all persons totally depraved and incapable of saving themselves.'
    },
    {
      title: '6. Salvation by Grace Alone',
      desc: 'We believe salvation is completely by grace alone through faith alone in Jesus Christ alone, apart from human works, merits, or religious ceremonies.'
    },
    {
      title: '7. The Church and Sacraments',
      desc: 'We affirm the universal church as the mystical body and bride of Christ, manifested locally in gathered assemblies of baptized believers observing the ordinances of Believer’s Baptism and the Lord’s Supper.'
    },
    {
      title: '8. Christian Holiness and Sanctification',
      desc: 'We believe in the progressive sanctification of the believer through the Holy Spirit, the application of Scripture, and the discipline of grace, bearing fruit in obedience and moral purity.'
    },
    {
      title: '9. The Great Commission',
      desc: 'We affirm the solemn mandate given by the risen Christ to proclaim the Gospel to every tribe, tongue, and nation, planting biblical churches and making obedient disciples across all cultures.'
    },
    {
      title: '10. The Return of Christ and Final Judgement',
      desc: 'We believe in the personal, bodily, and imminent return of our Lord Jesus Christ in power and glory, the bodily resurrection of the just and unjust, the eternal conscious torment of the lost in Hell, and the everlasting blessedness of the redeemed with God.'
    }
  ];

  return (
    <div className="w-full bg-white text-slate-900">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-20 border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              About the Institution
            </div>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
              A Legacy of Uncompromising Truth and Faithful Ministry
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Founded on the bedrock of the Reformation solas, Grace Theological Seminary prepares shepherds, missionaries, and teachers to preach Christ with clarity and compassion.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-black text-2xl text-slate-900 mb-3">Our Mission</h3>
              <p className="text-slate-600 text-base leading-relaxed">
                To provide rigorous, biblically faithful theological education and ministry formation that equips servant leaders to shepherd churches, proclaim the Gospel to the nations, and advance the Kingdom of God with academic excellence and personal holiness.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-black text-2xl text-slate-900 mb-3">Our Vision</h3>
              <p className="text-slate-600 text-base leading-relaxed">
                To be the premier theological institution in Africa, recognized globally for exegetical depth, pastoral integrity, and missionary zeal, releasing thousands of godly leaders into churches and frontline harvest fields.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History & Heritage */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
                50-Year Heritage
              </div>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-slate-950 tracking-tight mb-6">
                From a Humble Bible School to a Respected Continental Seminary
              </h2>
              <div className="space-y-4 text-slate-600 text-base leading-relaxed">
                <p>
                  Established in 1976 by evangelical missionary pioneers and African church elders, Grace Theological Seminary began with a modest cohort of twelve pastoral candidates gathered under an acacia canopy in Nairobi.
                </p>
                <p>
                  Guided by a profound burden for theological depth and expository preaching, the founders laid down an unwavering mandate: that every student must be saturated in original biblical languages, historical theology, systematic doctrine, and genuine pastoral compassion.
                </p>
                <p>
                  Today, Grace Theological Seminary has graduated over 1,500 pastors, church planters, missionary translators, and educators currently serving across 20 countries in Africa, Europe, Asia, and North America.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-6">
                <div>
                  <span className="font-serif font-black text-3xl text-amber-700 block">1976</span>
                  <span className="text-xs text-slate-500 font-semibold">Year Established</span>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div>
                  <span className="font-serif font-black text-3xl text-amber-700 block">1,500+</span>
                  <span className="text-xs text-slate-500 font-semibold">Ordained Alumni</span>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div>
                  <span className="font-serif font-black text-3xl text-amber-700 block">20+</span>
                  <span className="text-xs text-slate-500 font-semibold">Nations Reached</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=800"
                  alt="Historic Seminary Chapel"
                  className="w-full h-[460px] object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctrinal Statement of Faith */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              Confessional Foundation
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-white tracking-tight mb-4">
              Biblical Statement of Faith
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Every trustee, professor, and teaching fellow at Grace Theological Seminary subscribes annually without mental reservation to the following theological affirmations:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctrinalPillars.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 hover:border-amber-500/40 transition-colors"
              >
                <h3 className="font-serif font-bold text-lg text-amber-300 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditation & Alliances */}
      <section className="py-20 bg-slate-50 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
              Institutional Integrity
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-slate-950 tracking-tight">
              Accreditation & Theological Affiliations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <Award className="w-10 h-10 text-amber-600 mx-auto mb-4" />
              <h4 className="font-serif font-bold text-lg text-slate-900 mb-2">Association for Christian Theological Education in Africa (ACTEA)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full institutional accreditation recognizing gold-standard curriculum, credentialed faculty, and academic library standards across Africa.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <Award className="w-10 h-10 text-amber-600 mx-auto mb-4" />
              <h4 className="font-serif font-bold text-lg text-slate-900 mb-2">Ministry of Education Accreditation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Legally registered and chartered as a private post-secondary theological university college authorized to confer degrees, diplomas, and certificates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <Church className="w-10 h-10 text-amber-600 mx-auto mb-4" />
              <h4 className="font-serif font-bold text-lg text-slate-900 mb-2">World Reformed Fellowship & Evangelical Alliance</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Global communion and credit-transfer partnership with sister seminaries in Edinburgh, Grand Rapids, Seoul, and Sydney.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('/programs')}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase rounded-xl inline-flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Explore Our Degree Offerings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
