import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { CheckCircle2, Clock, FileText, AlertCircle, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';

export const ApplicationsTracker = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const statuses = [
    "Not Started",
    "Documents Pending",
    "Ready to Apply",
    "Applied",
    "Under Review",
    "Approved",
    "Rejected"
  ];

  const getStatusLabel = (st) => {
    if (lang === 'hi') {
      const map = {
        "Not Started": t('statusNotStarted'),
        "Documents Pending": t('statusDocsPending'),
        "Ready to Apply": t('statusReadyToApply'),
        "Applied": t('statusApplied'),
        "Under Review": t('statusUnderReview'),
        "Approved": t('statusApproved'),
        "Rejected": t('statusRejected')
      };
      return map[st] || st;
    }
    return st;
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchApps();
  }, [user]);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await applicationsAPI.getApplications();
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await applicationsAPI.updateApplication(appId, { status: newStatus });
      setApplications(prev => prev.map(a => a.id === appId ? res.data : a));
      addToast(lang === 'hi' ? `✓ स्थिति अद्यतन की गई: '${getStatusLabel(newStatus)}'` : `✓ Application status updated to '${newStatus}'`, "success");
    } catch (err) {
      addToast(t('errorOccurred'), "error");
    }
  };

  return (
    <div className="min-h-screen py-10 max-w-6xl mx-auto px-4 sm:px-7 space-y-6">
      <DisclaimerBanner />

      <div className="my-2">
        <Link to="/passbook" className="font-mono text-xs text-ink-soft hover:text-navy inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? '← पासबुक पर वापस जाएं' : 'Back to Passbook'}</span>
        </Link>
      </div>

      <div className="bg-card border border-navy/20 rounded-lg p-6 sm:p-8">
        <div className="eyebrow mb-1">Passbook Application Workflow</div>
        <h1 className="font-serif font-bold text-3xl text-navy mb-2">{t('activeTabApplications')}</h1>
        <p className="text-xs font-mono text-ink-soft">
          {lang === 'hi' ? 'दस्तावेज़ की तैयारी से लेकर अंतिम सरकारी स्वीकृति तक अपने आवेदन कार्यप्रवाह को ट्रैक करें।' : 'Track your application workflow from document preparation to final government approval.'}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 font-mono text-xs text-ink-soft">{t('loading')}</div>
      ) : applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((app) => {
            const { scheme, status, id, updated_at } = app;
            const currentIdx = statuses.indexOf(status);

            return (
              <div key={id} className="bg-card border border-navy/20 p-6 sm:p-8 rounded-lg space-y-6 shadow-sm">
                
                {/* Application Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-navy/15 pb-4">
                  <div>
                    <span className="font-mono text-[10.5px] bg-teal/15 text-teal-deep px-2.5 py-0.5 rounded font-bold uppercase">
                      {scheme.category}
                    </span>
                    <h3 className="font-serif font-bold text-xl text-navy mt-1">{scheme.name}</h3>
                    <div className="text-xs font-serif font-semibold text-gold-deep mt-0.5">{t('benefit')}: {scheme.benefit}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-navy font-bold">{t('applicationStatus')}:</span>
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(id, e.target.value)}
                      className={`border rounded px-3 py-1.5 text-xs font-mono font-bold focus:outline-none ${
                        status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : status === 'Rejected'
                          ? 'bg-rust/20 text-rust border-rust/40'
                          : 'bg-paper text-navy border-navy/20'
                      }`}
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>{getStatusLabel(st)}</option>
                      ))}
                    </select>

                    <a 
                      href={scheme.official_application_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1"
                    >
                      <span>{t('applyNow')}</span>
                      <ExternalLink className="w-3 h-3 text-gold" />
                    </a>
                  </div>
                </div>

                {/* Workflow Visual Timeline Stepper */}
                <div className="overflow-x-auto pb-4">
                  <div className="flex items-center justify-between min-w-[640px] font-mono text-[11px] relative">
                    
                    {/* Background Progress Line */}
                    <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-navy/15 z-0"></div>

                    {statuses.slice(0, 6).map((st, idx) => {
                      const isPassed = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={st} className="flex-1 flex flex-col items-center relative text-center z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                            isCurrent
                              ? 'bg-rust text-white ring-4 ring-rust/20 scale-110 shadow-md'
                              : isPassed
                              ? 'bg-teal text-white'
                              : 'bg-paper text-navy/40 border border-navy/20'
                          }`}>
                            {isPassed && !isCurrent ? '✓' : idx + 1}
                          </div>
                          <span className={`text-[10.5px] ${isCurrent ? 'font-bold text-navy' : isPassed ? 'text-teal-deep font-semibold' : 'text-navy/40'}`}>
                            {getStatusLabel(st)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-[11px] font-mono text-ink-soft text-right">
                  {lang === 'hi' ? 'अंतिम अद्यतन:' : 'Last updated:'} {new Date(updated_at).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border border-navy/15 p-12 text-center rounded-lg space-y-4">
          <Clock className="w-10 h-10 text-navy/30 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-navy">{t('noApplications')}</h3>
          <p className="text-xs text-ink-soft max-w-sm mx-auto font-sans">
            {t('noApplications')}
          </p>
          <Link to="/results" className="btn-primary text-xs py-2 px-4 inline-flex">
            {t('browseAndSave')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTracker;
