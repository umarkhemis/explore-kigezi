

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { getAdminHosts, approveHost, rejectHost } from '../../services/adminService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const TABS = ['Pending Verification', 'All Hosts'];

export default function AdminHostsPage() {
  const { isAdmin } = useAuth();
  const navigate    = useNavigate();
  const [tab,        setTab]        = useState('Pending Verification');
  const [hosts,      setHosts]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [rejectModal, setRejectModal] = useState({ open: false, hostId: null, hostName: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [viewModal,  setViewModal]  = useState({ open: false, host: null });

  useEffect(() => {
    if (!isAdmin) { navigate('/login'); return; }
  }, [isAdmin, navigate]);

  useEffect(() => { loadHosts(); }, [tab]);

  const loadHosts = async () => {
    setLoading(true);
    const params = tab === 'Pending Verification' ? { status: 'pending' } : {};
    const data = await getAdminHosts(params);
    setHosts(Array.isArray(data) ? data : data?.results || []);
    setLoading(false);
  };

  const handleApprove = async (id, name) => {
    try {
      await approveHost(id);
      toast.success(`✅ ${name} has been approved as a host!`);
      loadHosts();
    } catch { toast.error('Approval failed.'); }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) { toast.error('Please provide a reason.'); return; }
    try {
      await rejectHost(rejectModal.hostId, rejectReason);
      toast.success(`${rejectModal.hostName}'s application has been rejected.`);
      setRejectModal({ open: false, hostId: null, hostName: '' });
      setRejectReason('');
      loadHosts();
    } catch { toast.error('Rejection failed.'); }
  };

  const filtered = hosts.filter(h =>
    !search || h.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    h.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-kigezi-bg">
      <Navbar />
      <div className="pt-16 md:pt-18">
        <div className="bg-primary py-10">
          <div className="page-wrapper">
            <h1 className="font-serif text-3xl font-bold text-white mb-1">Host Management</h1>
            <p className="text-white/75">Review and verify cultural host applications</p>
          </div>
        </div>

        <div className="page-wrapper py-8">
          {/* Tabs + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-card w-fit">
              {TABS.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all
                    ${tab === t ? 'bg-primary text-white shadow-sm' : 'text-kigezi-muted hover:text-kigezi-text'}`}>
                  {t}
                </button>
              ))}
            </div>
            <input type="text" placeholder="Search by name or email…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-field w-full sm:w-72" />
          </div>

          {loading ? <LoadingSpinner center /> : filtered.length === 0 ? (
            <EmptyState icon="👥" title="No hosts found"
              message={tab === 'Pending Verification' ? 'No pending applications right now.' : 'No hosts registered yet.'} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(host => (
                <div key={host.id} className="card p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    {host.profile_photo
                      ? <img src={host.profile_photo} alt={host.full_name}
                          className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                      : <div className="w-14 h-14 rounded-full bg-primary/20 text-primary font-bold text-xl flex items-center justify-center flex-shrink-0">
                          {(host.full_name?.[0] || 'H').toUpperCase()}
                        </div>
                    }
                    <div className="min-w-0">
                      <div className="font-bold text-kigezi-text">{host.full_name}</div>
                      <div className="text-kigezi-muted text-sm truncate">{host.email}</div>
                      <div className="text-kigezi-muted text-xs">{host.phone}</div>
                    </div>
                    <Badge variant={host.is_verified ? 'verified' : 'pending'}
                      label={host.is_verified ? 'Verified' : 'Pending'} className="flex-shrink-0" />
                  </div>

                  {/* Bio */}
                  {host.bio && (
                    <p className="text-kigezi-muted text-sm line-clamp-2 mb-3">{host.bio}</p>
                  )}

                  {/* Meta */}
                  <div className="text-xs text-kigezi-muted mb-4 space-y-1">
                    {host.created_at && (
                      <div>📅 Applied: {format(new Date(host.created_at), 'MMM d, yyyy')}</div>
                    )}
                    {host.languages_spoken?.length > 0 && (
                      <div>🗣 {Array.isArray(host.languages_spoken) ? host.languages_spoken.join(', ') : host.languages_spoken}</div>
                    )}
                    {host.id_document && (
                      <div>
                        <a href={host.id_document} target="_blank" rel="noreferrer"
                          className="text-primary hover:underline">📄 View ID Document</a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-kigezi-border">
                    <button onClick={() => setViewModal({ open: true, host })}
                      className="text-sm px-3 py-1.5 rounded-lg border-2 border-kigezi-border text-kigezi-muted hover:border-primary hover:text-primary transition-all">
                      👁 View
                    </button>
                    {!host.is_verified && (
                      <>
                        <button onClick={() => handleApprove(host.id, host.full_name)}
                          className="text-sm px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors">
                          ✅ Approve
                        </button>
                        <button onClick={() => setRejectModal({ open: true, hostId: host.id, hostName: host.full_name })}
                          className="text-sm px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors">
                          ✕ Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Modal open={rejectModal.open} onClose={() => setRejectModal({ open: false, hostId: null, hostName: '' })}
        title={`Reject ${rejectModal.hostName}'s Application`}>
        <div className="space-y-4">
          <p className="text-kigezi-muted text-sm">
            Please provide a reason for rejection. This will be sent to the applicant.
          </p>
          <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
            placeholder="e.g. ID document is unclear, please resubmit with a clearer photo…"
            className="input-field resize-none" rows={4} />
          <div className="flex gap-3">
            <button onClick={() => setRejectModal({ open: false, hostId: null, hostName: '' })}
              className="btn-outline flex-1">Cancel</button>
            <button onClick={handleReject}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors">
              Send Rejection
            </button>
          </div>
        </div>
      </Modal>

      {/* View Host Modal */}
      <Modal open={viewModal.open} onClose={() => setViewModal({ open: false, host: null })}
        title="Host Profile" size="lg">
        {viewModal.host && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {viewModal.host.profile_photo
                ? <img src={viewModal.host.profile_photo} alt={viewModal.host.full_name}
                    className="w-20 h-20 rounded-full object-cover" />
                : <div className="w-20 h-20 rounded-full bg-primary/20 text-primary text-2xl font-bold flex items-center justify-center">
                    {(viewModal.host.full_name?.[0] || 'H').toUpperCase()}
                  </div>
              }
              <div>
                <h3 className="font-bold text-xl text-kigezi-text">{viewModal.host.full_name}</h3>
                <p className="text-kigezi-muted">{viewModal.host.email}</p>
                <p className="text-kigezi-muted">{viewModal.host.phone}</p>
              </div>
            </div>
            {viewModal.host.bio && (
              <div className="bg-kigezi-bg rounded-xl p-4">
                <div className="font-semibold text-sm mb-2">Bio</div>
                <p className="text-kigezi-muted text-sm">{viewModal.host.bio}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {viewModal.host.years_of_experience && (
                <div className="bg-kigezi-bg rounded-xl p-3">
                  <div className="text-kigezi-muted text-xs">Experience</div>
                  <div className="font-semibold">{viewModal.host.years_of_experience} years</div>
                </div>
              )}
              {viewModal.host.languages_spoken && (
                <div className="bg-kigezi-bg rounded-xl p-3">
                  <div className="text-kigezi-muted text-xs">Languages</div>
                  <div className="font-semibold">
                    {Array.isArray(viewModal.host.languages_spoken)
                      ? viewModal.host.languages_spoken.join(', ')
                      : viewModal.host.languages_spoken}
                  </div>
                </div>
              )}
            </div>
            {viewModal.host.id_document && (
              <a href={viewModal.host.id_document} target="_blank" rel="noreferrer"
                className="btn-outline w-full text-center block">
                📄 View ID Document
              </a>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}