import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { schemesAPI, passbookAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { ArrowLeft, ExternalLink, Bookmark, CheckSquare, Square, ShieldCheck, AlertTriangle, X } from 'lucide-react';

export const SchemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPortalModal, setShowPortalModal] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState({});

  useEffect(() => {
    schemesAPI.getSchemeById(id)
      .then((res) => {
        setScheme(res.data);
      })
      .catch((err) => {
        setError('Scheme not found.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const toggleDoc = (docName) => {
    setCheckedDocs(prev => ({
      ...prev,
      [docName]: !prev[docName]
    }));
  };

  const handleSavePassbook = async () => {
    if (!user) {
      alert("Please login or create a profile to save schemes to your passbook.");
      return;
    }
    try {
      await passbookAPI.saveScheme(scheme.id);
      alert(`"${scheme.name}" saved to your Passbook!`);
    } catch (err) {
      alert("Saved to passbook.");
    }
  };

  const handleStartApplication = async () => {
    if (!user) {
      alert("Please login to track applications in your Passbook.");
      return;
    }
    try {
      const docsArray = Object.keys(checkedDocs).filter(k => checkedDocs[k]);
      await applicationsAPI.createOrGetApplication(scheme.id);
      navigate('/applications');
    } catch (err) {
      navigate('/applications');
    }
  };

  if (loading) {
    return <div className="min-h-screen py-20 text-center font-mono text-xs text-ink-soft">Loading scheme details...</div>;
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen py-20 text-center space-y-4">
        <h2 className="font-serif font-bold text-2xl text-navy">Scheme Not Found</h2>
        <Link to="/results" className="btn-primary text-xs py-2 px-4 inline-flex">Back to Results</Link>
      </div>
    );
  }

  const checkedCount = Object.values(checkedDocs).filter(Boolean).length;
  const totalDocs = scheme.documents?.length || 0;

  return (
    <div className="min-h-screen py-10 max-w-5xl mx-auto px-4 sm:px-7">
      <DisclaimerBanner />

      <div className="my-6">
        <Link to="/results" className="font-mono text-xs text-ink-soft hover:text-navy inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Matches</span>
        </Link>
      </div>

      <div className="bg-card border border-navy/20 rounded-lg p-6 sm:p-10 shadow-xl space-y-8">
        {/* Header */}
        <div className="border-b border-navy/15 pb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3 font-mono text-xs">
            <span className="bg-teal/15 text-teal-deep border border-teal/30 px-3 py-0.5 rounded-full font-bold uppercase">
              {scheme.category}
            </span>
            <span className="bg-paper border border-navy/15 px-2.5 py-0.5 rounded text-navy">
              {scheme.scheme_type} Scheme
            </span>
            <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
              scheme.verification_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {scheme.verification_status}
            </span>
          </div>

          <h1 className="font-serif font-bold text-3xl text-navy mb-4 leading-tight">{scheme.name}</h1>
          <p className="text-sm font-sans text-ink-soft leading-relaxed max-w-3xl">{scheme.full_description}</p>
        </div>

        {/* Benefit Highlight Box */}
        <div className="bg-paper border border-navy/20 p-6 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="font-mono text-xs font-bold text-gold-deep uppercase">Official Benefit</div>
            <div className="font-serif font-semibold text-xl text-navy mt-1">{scheme.benefit}</div>
          </div>
          {scheme.deadline && (
            <div className="font-mono text-xs text-rust bg-rust/10 border border-rust/30 px-3 py-1.5 rounded">
              ⏰ Deadline: <b>{scheme.deadline}</b>
            </div>
          )}
        </div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Document Checklist */}
          <div className="bg-paper border border-navy/15 p-6 rounded">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif font-semibold text-lg text-navy">Document Checklist</h3>
              <span className="font-mono text-xs text-teal font-bold">{checkedCount} / {totalDocs} ready</span>
            </div>
            <ul className="space-y-3 font-sans text-xs">
              {scheme.documents?.map((doc, idx) => (
                <li 
                  key={idx} 
                  onClick={() => toggleDoc(doc)}
                  className="flex items-start gap-3 p-2.5 bg-card rounded border border-navy/10 cursor-pointer hover:border-gold-deep transition-colors"
                >
                  {checkedDocs[doc] ? (
                    <CheckSquare className="w-4 h-4 text-teal flex-none mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-navy/40 flex-none mt-0.5" />
                  )}
                  <span className={checkedDocs[doc] ? 'line-through text-ink-soft' : 'text-navy font-medium'}>
                    {doc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Application Steps */}
          <div className="bg-paper border border-navy/15 p-6 rounded">
            <h3 className="font-serif font-semibold text-lg text-navy mb-4">Application Steps</h3>
            <ol className="space-y-4 font-sans text-xs">
              {scheme.application_steps?.map((stepStr, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-navy text-paper font-mono font-bold text-[10px] flex items-center justify-center flex-none mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-navy leading-relaxed">{stepStr}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Verification Meta */}
        <div className="text-xs font-mono text-ink-soft border-t border-navy/15 pt-4 flex flex-wrap justify-between gap-2">
          <span>Source: <b>{scheme.source_name}</b></span>
          <span>Last Verified: <b>{scheme.last_verified_at}</b></span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-navy/15 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            <button onClick={handleSavePassbook} className="btn-ghost text-xs py-2.5 px-4 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-gold-deep" />
              <span>Save to Passbook</span>
            </button>

            <button onClick={handleStartApplication} className="btn-ghost text-xs py-2.5 px-4 text-teal-deep border-teal/40">
              Track Application Status →
            </button>
          </div>

          <button 
            onClick={() => setShowPortalModal(true)} 
            className="btn-primary big text-sm font-semibold flex items-center gap-2"
          >
            <span>Apply on Official Portal</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* External Redirection Warning Modal */}
      {showPortalModal && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-navy/30 max-w-lg w-full rounded-lg p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 font-serif font-bold text-lg text-rust">
                <AlertTriangle className="w-5 h-5 text-rust" />
                <span>Leaving SchemeSetu</span>
              </div>
              <button onClick={() => setShowPortalModal(false)} className="text-ink-soft hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-sans text-ink leading-relaxed">
              You are leaving SchemeSetu and proceeding to the official government application portal:
              <br />
              <b className="font-mono text-teal-deep block mt-2 break-all">{scheme.official_application_url}</b>
            </p>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded text-[11.5px] font-mono text-amber-900">
              Note: SchemeSetu does not process applications or store sensitive identity documents directly. Always complete your application on official government domains (.gov.in / .nic.in).
            </div>

            <div className="flex justify-end gap-3 pt-2 font-mono text-xs">
              <button onClick={() => setShowPortalModal(false)} className="btn-ghost py-2 px-4">
                Cancel
              </button>
              <a 
                href={scheme.official_application_url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setShowPortalModal(false)}
                className="btn-primary py-2 px-4 inline-flex items-center gap-1.5"
              >
                <span>Proceed to Portal →</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeDetail;
