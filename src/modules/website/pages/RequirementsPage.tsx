import React from 'react';
import { Award, CheckCircle2, ArrowRight, BookOpen, GraduationCap, Globe } from 'lucide-react';

interface RequirementsPageProps {
  onNavigate: (route: string) => void;
}

export const RequirementsPage: React.FC<RequirementsPageProps> = ({ onNavigate }) => {
  const requirements = [
    {
      level: 'Certificate Level Programs',
      programs: 'Certificate in Christian Theology, Certificate in Children Ministry',
      criteria: [
        'High school completion certificate (KCSE Grade D+ or equivalent international high school credential)',
        'Demonstrated active involvement in a local Christian congregation for at least 1 year',
        'Confession of personal faith in Jesus Christ and baptism by immersion/declaration',
        'Official recommendation letter signed by the Senior Pastor or Church Elder'
      ]
    },
    {
      level: 'Diploma Level Programs',
      programs: 'Diploma in Pastoral Ministry, Diploma in Biblical Studies, Diploma in Missions',
      criteria: [
        'KCSE Mean Grade of C- (Minus) or equivalent secondary school leaving certificate',
        'OR an accredited one-year Certificate in Theology with a minimum cumulative GPA of 2.50',
        'Minimum age 20 years or active lay ministerial engagement',
        'Pastoral recommendation letter and 2 character references'
      ]
    },
    {
      level: 'Bachelor Level Degree Programs',
      programs: 'Bachelor of Theology (B.Th.), Bachelor of Arts in Biblical Studies',
      criteria: [
        'KCSE Mean Grade of C+ (Plus) or its recognized international equivalent (GCE A-Levels with 2 principal passes)',
        'OR an accredited Diploma in Theology with Distinction or Credit from an ACTEA-recognized institution',
        'Mature Age Entry: Minimum age 25 with KCSE C Plain and at least 5 years documented pastoral service',
        'Personal faith statement and satisfactory entrance interview with the Academic Dean'
      ]
    },
    {
      level: 'Postgraduate & Master Programs',
      programs: 'Master of Divinity (M.Div.), Master of Arts in Theological Studies',
      criteria: [
        'An accredited Bachelor’s degree in any field with a minimum cumulative GPA of 2.70 on a 4.0 scale (or Second Class Honours Upper Division)',
        'Proficiency in Biblical Greek or Hebrew (or completion of summer preliminary intensive language courses)',
        'Documented sense of divine calling toward ordained ministry, missions, or teaching',
        'Submission of a 1,500-word theological essay and 3 letters of reference (Academic, Pastoral, and Character)'
      ]
    },
    {
      level: 'Doctor of Ministry (D.Min.)',
      programs: 'Doctor of Ministry in Expository Preaching, D.Min. in Church Revitalization',
      criteria: [
        'Accredited Master of Divinity (M.Div.) degree or equivalent master-level theological degree with at least 72 semester credit hours',
        'Minimum cumulative GPA of 3.00 (B average) in graduate theological coursework',
        'Minimum of 3 years of full-time, post-seminary vocational pastoral or ministry leadership experience',
        'Formal letter of endorsement from the candidate’s local church board or denominational presbytery',
        'Comprehensive 10-page ministry portfolio and doctoral proposal abstract'
      ]
    }
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Admissions Criteria
            </div>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Academic & Spiritual Admission Requirements
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              We seek candidates who demonstrate both academic readiness for rigorous theological study and authentic spiritual fruit in Christian life and service.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-10">
        {requirements.map((req, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-md hover:border-amber-500/40 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full mb-1 inline-block">
                  Level {idx + 1}
                </span>
                <h2 className="font-serif font-bold text-2xl text-slate-950">
                  {req.level}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {req.programs}
                </p>
              </div>

              <button
                onClick={() => onNavigate('/apply')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 self-start sm:self-center transition-colors"
              >
                <span>Apply for this Level</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            <div className="space-y-3">
              {req.criteria.map((c, i) => (
                <div key={i} className="flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* International Students */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-white">International Student Admissions</h3>
              <p className="text-xs text-amber-400 font-medium">Applicants from outside Kenya</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            We welcome students from across Africa and around the world. International applicants must have their foreign academic certificates authenticated by the Kenya National Qualifications Authority (KNQA) or equivalent body, demonstrate English proficiency (TOEFL or equivalent), and obtain a Kenyan Student Visa with institutional assistance.
          </p>

          <button
            onClick={() => onNavigate('/contact')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Contact International Admissions Office</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
};
