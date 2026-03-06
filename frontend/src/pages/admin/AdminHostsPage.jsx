import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { getAdminHosts, approveHost, rejectHost } from '../../services/adminService';

const TABS = ['Pending Verification', 'All Hosts'];

const MOCK_PENDING = [
  { id: 1, first_name: 'Amina', last_name: 'Byarugaba', email: 'amina@example.com', phone: '+256 772 123 456', bio: 'Expert in traditional Kiga dance and drumming with 10+ years of performance.', verification_status: 'pending', created_at: '2025-12-01', profile_photo: null, id_document: null },
  { id: 2, first_name: 'David', last_name: 'Turyahabwe', email: 'david@example.com', phone: '+256 751 987 654', bio: 'Batwa cultural heritage guide and craftsman.', verification_status: 'pending', created_at: '2025-12-03', profile_photo: null, id_document: null },
];
const MOCK_ALL = [
  ...MOCK_PENDING,
  { id: 3, first_name: 'Grace', last_name: 'Kamugisha', email: 'grace@example.com', phone: '+256 700 555 111', bio: 'Traditional Bakiga cooking instructor.', verification_status: 'verified', created_at: '2025-11-15', profile_photo: null, id_document: null },
];

export default function AdminHostsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [viewModal, setViewModal] = useState(null);
  const [processing, setProcessing] = useState(null);

  const load = () => {
    setLoading(true);
    const params = activeTab === 0 ? { status: 'pending' } : {};
    getAdminHosts(params)
      .then((data) => setHosts(Array.isArray(data) ? data : data.results || []))
      .catch(() => setHosts(activeTab === 0 ? MOCK_PENDING : MOCK_ALL))
      .finally(() => setLoading(false));
  };

  useEffect(load, [activeTab]);

  const handleApprove = async (id) => {
    setProcessing(id);
    try {
      await approveHost(id);
      setHosts((prev) => prev.filter((h) => h.id !== id));
      toast.success('Host approved successfully!');
    } catch {
      toast.error('Failed to approve host.');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) { toast.error('Please provide a rejection reason.'); return; }
    setProcessing(rejectModal.id);
    try {
      await rejectHost(rejectModal.id, rejectReason);
      setHosts((prev) => prev.filter((h) => h.id !== rejectModal.id));
      setRejectModal(null);
      setRejectReason('');
      toast.success('Host rejected.');
    } catch {
      toast.error('Failed to reject host.');
    } finally {
      setProcessing(null);
    }
  };

  const filtered = hosts.filter(
    (h) =>
      !search ||
      `${h.first_name} ${h.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      h.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-kigezi-bg">
      <Navbar />
      <div className="pt-16">
        <div className="bg-primary py-10">
          <div className="page-wrapper">
            <h1 className="font-serif text-3xl font-bold text-white mb-1">Host Management</h1>
            <p className="text-white/70">Verify and manage cultural experience hosts</p>
          </div>
        </div>

        <div className="page-wrapper py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="card p-4">
                <h3 className="font-semibold text-kigezi-text mb-3 text-sm uppercase tracking-wide">Admin Panel</h3>
                <nav className="space-y-1">
                  {[
                    { to: '/admin/hosts', label: '👥 Hosts' },
                    { to: '/admin/bookings', label: '📅 Bookings' },
                  ].map((link) => (
                    <a key={link.to} href={link.to} className="block text-sm py-2 px-3 rounded-lg text-kigezi-text hover:bg-kigezi-bg hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main */}
            <main className="lg:col-span-3 space-y-5">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex gap-2">
                  {TABS.map((tab, i) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(i)}
                      className={`px-4 py-2 rounded-full font-semibold text-sm transition-all whitespace-nowrap
                        ${activeTab === i ? 'bg-primary text-white' : 'bg-white text-kigezi-muted border border-kigezi-border hover:text-primary'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="🔍 Search by name or email…"
                  className="input-field sm:w-64"
                />
              </div>

              {loading ? (
                <LoadingSpinner center />
              ) : filtered.length === 0 ? (
                <EmptyState icon="👥" title="No hosts found" message="There are no hosts matching your criteria." />
              ) : (
                <div className="space-y-4">
                  {filtered.map((host) => (
                    <div key={host.id} className="card p-5">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                          {host.profile_photo ? (
                            <img src={host.profile_photo} alt="profile" className="w-full h-full object-cover" />
                          ) : '👤'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                            <h3 className="font-serif font-bold text-kigezi-text">
                              {host.first_name} {host.last_name}
                            </h3>
                            <Badge label={host.verification_status} variant={host.verification_status} />
                          </div>
                          <p className="text-sm text-kigezi-muted mb-1">📧 {host.email} · 📱 {host.phone}</p>
                          <p className="text-sm text-kigezi-text line-clamp-2 mb-2">{host.bio}</p>
                          <p className="text-xs text-kigezi-muted">Registered: {host.created_at?.split('T')[0] || host.created_at}</p>
                          {host.id_document && (
                            <a href={host.id_document} target="_blank" rel="noreferrer" className="text-xs text-primary underline mt-1 inline-block">
                              View ID Document
                            </a>
                          )}
                        </div>
                      </div>
                      {host.verification_status === 'pending' && (
                        <div className="mt-4 pt-4 border-t border-kigezi-border flex gap-2 flex-wrap">
                          <button
                            onClick={() => setViewModal(host)}
                            className="btn-outline text-sm py-1.5 px-4"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => handleApprove(host.id)}
                            disabled={processing === host.id}
                            className="btn-primary text-sm py-1.5 px-4 disabled:opacity-50"
                          >
                            {processing === host.id ? '…' : '✓ Approve'}
                          </button>
                          <button
                            onClick={() => { setRejectModal(host); setRejectReason(''); }}
                            disabled={processing === host.id}
                            className="border border-red-300 text-red-600 font-semibold text-sm py-1.5 px-4 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}
                      {host.verification_status !== 'pending' && (
                        <div className="mt-3">
                          <button onClick={() => setViewModal(host)} className="btn-outline text-sm py-1.5 px-4">
                            View Profile
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <Modal isOpen={!!rejectModal} onClose={() => setRejectModal(null)} title={`Reject ${rejectModal?.first_name}?`}>
        <div className="space-y-4">
          <p className="text-sm text-kigezi-muted">Please provide a reason for rejection. This will be sent to the host.</p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            placeholder="Reason for rejection…"
            className="input-field resize-none"
          />
          <div className="flex gap-3">
            <button onClick={() => setRejectModal(null)} className="btn-outline flex-1">Cancel</button>
            <button
              onClick={handleReject}
              disabled={processing === rejectModal?.id}
              className="border border-red-300 text-red-600 font-semibold py-2.5 px-5 rounded-lg hover:bg-red-50 flex-1 disabled:opacity-50"
            >
              {processing === rejectModal?.id ? 'Rejecting…' : 'Reject Host'}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Profile Modal */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Host Profile">
        {viewModal && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                {viewModal.profile_photo ? <img src={viewModal.profile_photo} alt="profile" className="w-full h-full object-cover rounded-full" /> : '👤'}
              </div>
              <div>
                <p className="font-bold text-kigezi-text">{viewModal.first_name} {viewModal.last_name}</p>
                <Badge label={viewModal.verification_status} variant={viewModal.verification_status} />
              </div>
            </div>
            {[
              ['Email', viewModal.email],
              ['Phone', viewModal.phone],
              ['Registered', viewModal.created_at?.split('T')[0] || viewModal.created_at],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-kigezi-muted">{k}</span>
                <span className="font-medium text-kigezi-text">{v || '—'}</span>
              </div>
            ))}
            <div>
              <p className="text-kigezi-muted mb-1">Bio</p>
              <p className="text-kigezi-text">{viewModal.bio}</p>
            </div>
            {viewModal.id_document && (
              <a href={viewModal.id_document} target="_blank" rel="noreferrer" className="text-primary underline">
                View ID Document
              </a>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
