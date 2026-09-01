import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { Shield, Plus, Edit3, Trash2, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

export const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    full_description: '',
    state: 'All India',
    scheme_type: 'Central',
    category: 'General',
    benefit: '',
    benefit_amount: '',
    min_age: 18,
    max_age: 65,
    max_income: 500000,
    documents: 'Aadhaar Card, Bank Account Details',
    application_steps: 'Register online, Submit details',
    deadline: 'Open scheme',
    official_source_url: '',
    official_application_url: '',
    source_name: 'Government Portal',
    verification_status: 'VERIFIED',
    active: true
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    fetchSchemes();
  }, [user, isAdmin]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllSchemes();
      setSchemes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingScheme(null);
    setFormData({
      name: '',
      short_description: '',
      full_description: '',
      state: 'All India',
      scheme_type: 'Central',
      category: 'General',
      benefit: '',
      benefit_amount: '',
      min_age: 18,
      max_age: 65,
      max_income: 500000,
      documents: 'Aadhaar Card, Bank Account Details',
      application_steps: 'Register online, Submit details',
      deadline: 'Open scheme',
      official_source_url: 'https://myscheme.gov.in',
      official_application_url: 'https://myscheme.gov.in',
      source_name: 'Ministry of Welfare',
      verification_status: 'VERIFIED',
      active: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (sch) => {
    setEditingScheme(sch);
    setFormData({
      name: sch.name,
      short_description: sch.short_description,
      full_description: sch.full_description,
      state: sch.state,
      scheme_type: sch.scheme_type,
      category: sch.category,
      benefit: sch.benefit,
      benefit_amount: sch.benefit_amount || '',
      min_age: sch.min_age || 0,
      max_age: sch.max_age || 120,
      max_income: sch.max_income || 1000000,
      documents: Array.isArray(sch.documents) ? sch.documents.join(', ') : sch.documents,
      application_steps: Array.isArray(sch.application_steps) ? sch.application_steps.join(', ') : sch.application_steps,
      deadline: sch.deadline || 'No active deadline',
      official_source_url: sch.official_source_url,
      official_application_url: sch.official_application_url,
      source_name: sch.source_name,
      verification_status: sch.verification_status,
      active: sch.active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      documents: formData.documents.split(',').map(s => s.trim()).filter(Boolean),
      application_steps: formData.application_steps.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingScheme) {
        await adminAPI.updateScheme(editingScheme.id, payload);
      } else {
        await adminAPI.createScheme(payload);
      }
      setShowModal(false);
      fetchSchemes();
    } catch (err) {
      alert("Error saving scheme. Ensure all fields are filled.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate this scheme?")) return;
    try {
      await adminAPI.deleteScheme(id);
      fetchSchemes();
    } catch (err) {
      alert("Error deactivating scheme.");
    }
  };

  return (
    <div className="min-h-screen py-10 max-w-6xl mx-auto px-4 sm:px-7">
      <DisclaimerBanner />

      {/* Header */}
      <div className="my-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-navy text-paper p-6 sm:p-8 rounded-lg">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-gold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-gold" />
            <span>Admin Management Portal</span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-paper">Scheme Database Administration</h1>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/chat')} className="btn-secondary py-2.5 px-4 text-xs flex items-center gap-1.5 bg-white text-navy font-bold">
            <MessageSquare className="w-4 h-4 text-marigold" />
            <span>Support Chat Panel</span>
          </button>
          <button onClick={handleOpenCreate} className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add New Scheme</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-navy/20 rounded-lg overflow-hidden shadow-xl">
        {loading ? (
          <div className="text-center py-10 font-mono text-xs text-ink-soft">Loading scheme records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="bg-paper border-b border-navy/20 font-mono text-[11px] text-navy uppercase">
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Scheme Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">State</th>
                  <th className="p-3.5">Verification</th>
                  <th className="p-3.5">Deadline</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {schemes.map((s) => (
                  <tr key={s.id} className="hover:bg-paper/50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-navy">{s.id}</td>
                    <td className="p-3.5 font-semibold text-navy max-w-xs truncate">{s.name}</td>
                    <td className="p-3.5 font-mono text-[10.5px]">
                      <span className="bg-teal/15 text-teal-deep px-2 py-0.5 rounded font-bold">{s.category}</span>
                    </td>
                    <td className="p-3.5 font-mono text-xs">{s.state}</td>
                    <td className="p-3.5">
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        s.verification_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.verification_status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-xs text-ink-soft">{s.deadline}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button onClick={() => handleOpenEdit(s)} className="p-1.5 text-navy hover:text-gold-deep">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 text-ink-soft hover:text-rust">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-navy/30 max-w-2xl w-full rounded-lg p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <h2 className="font-serif font-bold text-2xl text-navy">
              {editingScheme ? `Edit Scheme #${editingScheme.id}` : 'Create New Welfare Scheme'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block font-mono font-bold text-navy mb-1">Scheme Name*</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-paper border border-navy/20 rounded p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono font-bold text-navy mb-1">Category*</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-paper border border-navy/20 rounded p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-navy mb-1">State Scope*</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-paper border border-navy/20 rounded p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold text-navy mb-1">Short Description*</label>
                <input
                  type="text"
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full bg-paper border border-navy/20 rounded p-2.5"
                />
              </div>

              <div>
                <label className="block font-mono font-bold text-navy mb-1">Full Description*</label>
                <textarea
                  rows="3"
                  required
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  className="w-full bg-paper border border-navy/20 rounded p-2.5"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono font-bold text-navy mb-1">Benefit Summary*</label>
                  <input
                    type="text"
                    required
                    value={formData.benefit}
                    onChange={(e) => setFormData({ ...formData, benefit: e.target.value })}
                    className="w-full bg-paper border border-navy/20 rounded p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-navy mb-1">Deadline text</label>
                  <input
                    type="text"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-paper border border-navy/20 rounded p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono font-bold text-navy mb-1">Official Source URL*</label>
                  <input
                    type="url"
                    required
                    value={formData.official_source_url}
                    onChange={(e) => setFormData({ ...formData, official_source_url: e.target.value })}
                    className="w-full bg-paper border border-navy/20 rounded p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-navy mb-1">Official Application URL*</label>
                  <input
                    type="url"
                    required
                    value={formData.official_application_url}
                    onChange={(e) => setFormData({ ...formData, official_application_url: e.target.value })}
                    className="w-full bg-paper border border-navy/20 rounded p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono font-bold text-navy mb-1">Source Department Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.source_name}
                    onChange={(e) => setFormData({ ...formData, source_name: e.target.value })}
                    className="w-full bg-paper border border-navy/20 rounded p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-navy mb-1">Verification Status*</label>
                  <select
                    value={formData.verification_status}
                    onChange={(e) => setFormData({ ...formData, verification_status: e.target.value })}
                    className="w-full bg-paper border border-navy/20 rounded p-2.5"
                  >
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="NEEDS_REVIEW">NEEDS_REVIEW</option>
                    <option value="DEMO">DEMO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold text-navy mb-1">Documents (comma separated)</label>
                <input
                  type="text"
                  value={formData.documents}
                  onChange={(e) => setFormData({ ...formData, documents: e.target.value })}
                  className="w-full bg-paper border border-navy/20 rounded p-2.5"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-navy/15">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost py-2 px-4">
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2 px-5">
                  Save Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
