import { useState, useEffect } from 'react';
import { requestService, type Request } from '@/services/api';
import { useAuthStore, useNotificationStore } from '@/store';
import { Inbox, Send, Check, X, Clock, UserCircle, MessageCircle, ArrowDownLeft, ArrowUpRight, Loader2 } from 'lucide-react';

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await requestService.listRequests();
      setRequests(data.requests || []);
    } catch (error) {
      addNotification('Failed to load requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id: string, action: 'accept' | 'reject') => {
    try {
      await requestService.respondRequest(id, action);
      addNotification(action === 'accept' ? 'Request accepted! 🎉' : 'Request declined', 'success');
      loadRequests();
    } catch (error) {
      addNotification(`Failed to ${action} request`, 'error');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await requestService.cancelRequest(id);
      addNotification('Request cancelled', 'success');
      loadRequests();
    } catch (error) {
      addNotification('Failed to cancel request', 'error');
    }
  };

  const incomingRequests = requests.filter((r) => r.recipientId === user?.id && r.status === 'pending');
  const outgoingRequests = requests.filter((r) => r.senderId === user?.id);

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      accepted: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
      cancelled: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    };
    const icons: Record<string, typeof Clock> = {
      pending: Clock,
      accepted: Check,
      rejected: X,
      cancelled: X,
    };
    const Icon = icons[status] || Clock;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Requests</h1>
          <p className="text-sm text-muted-foreground">Manage your connection requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'incoming'
              ? 'gradient-bg text-white shadow-lg'
              : 'glass-card text-muted-foreground hover:text-foreground'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          Incoming
          {incomingRequests.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
              {incomingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'outgoing'
              ? 'gradient-bg text-white shadow-lg'
              : 'glass-card text-muted-foreground hover:text-foreground'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          Outgoing
          {outgoingRequests.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
              {outgoingRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Incoming Tab */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          {incomingRequests.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">No Incoming Requests</h3>
              <p className="text-sm text-muted-foreground">When someone shows interest in you, it'll appear here.</p>
            </div>
          ) : (
            incomingRequests.map((request) => (
              <div key={request.id} className="glass-card rounded-2xl p-5 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center flex-shrink-0">
                    <UserCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-lg">{request.senderProfile?.name || 'Unknown'}</h3>
                      {statusBadge(request.status)}
                    </div>
                    {request.message && (
                      <p className="text-sm text-foreground/70 mt-2">"{request.message}"</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Received {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleRespond(request.id, 'accept')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => handleRespond(request.id, 'reject')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Outgoing Tab */}
      {activeTab === 'outgoing' && (
        <div className="space-y-4">
          {outgoingRequests.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
                <Send className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">No Outgoing Requests</h3>
              <p className="text-sm text-muted-foreground">Browse matches and send interest to connect!</p>
            </div>
          ) : (
            outgoingRequests.map((request) => (
              <div key={request.id} className="glass-card rounded-2xl p-5 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                    <UserCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-lg">{request.recipientProfile?.name || 'Unknown'}</h3>
                      {statusBadge(request.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Sent {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(request.id)}
                        className="flex items-center gap-1.5 px-4 py-2 mt-4 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
