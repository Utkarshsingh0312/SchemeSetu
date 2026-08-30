import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useEligibility } from '../context/EligibilityContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { User, Save, ArrowLeft } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { profile, setProfile } = useEligibility();
  const { addToast } = useToast();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(profile);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    profileAPI.getProfile()
      .then(res => {
        setFormData(res.data);
        setProfile(res.data);
      })
      .catch(() => {});
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await profileAPI.updateProfile(formData);
      setProfile(res.data);
      addToast(t('profileSavedSuccess'), "success");
      navigate('/results');
    } catch (err) {
      addToast(t('errorOccurred'), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 max-w-3xl mx-auto px-4 sm:px-7 space-y-6">
      <DisclaimerBanner />

      <div className="bg-card border border-navy/20 rounded-lg p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex justify-between items-center border-b border-navy/15 pb-4">
          <div>
            <div className="eyebrow mb-1">Citizen Profile</div>
            <h1 className="font-serif font-bold text-2xl text-navy">{t('profileTitle')}</h1>
          </div>
          <User className="w-8 h-8 text-teal" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 font-sans text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono font-bold text-navy mb-1">{t('labelAge')}</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="w-full bg-paper border border-navy/20 rounded p-2.5"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-navy mb-1">{t('labelGender')}</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-paper border border-navy/20 rounded p-2.5"
              >
                <option value="Male">{t('optMale')}</option>
                <option value="Female">{t('optFemale')}</option>
                <option value="Other">{t('optTransgender')}</option>
              </select>
            </div>
            <div>
              <label className="block font-mono font-bold text-navy mb-1">{t('labelState')}</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-paper border border-navy/20 rounded p-2.5"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-navy mb-1">{t('labelIncome')}</label>
              <input
                type="number"
                value={formData.annual_income}
                onChange={(e) => setFormData({ ...formData, annual_income: parseFloat(e.target.value) || 0 })}
                className="w-full bg-paper border border-navy/20 rounded p-2.5"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-navy mb-1">{t('labelOccupation')}</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full bg-paper border border-navy/20 rounded p-2.5"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-navy mb-1">{t('labelCategory')}</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-paper border border-navy/20 rounded p-2.5"
              >
                <option value="General">{t('optGeneral')}</option>
                <option value="OBC">{t('optOBC')}</option>
                <option value="SC">{t('optSC')}</option>
                <option value="ST">{t('optST')}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-navy/15">
            <button type="submit" disabled={loading} className="btn-primary py-2.5 px-5 text-xs font-semibold flex items-center gap-2">
              <Save className="w-3.5 h-3.5" />
              <span>{t('saveProfile')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
