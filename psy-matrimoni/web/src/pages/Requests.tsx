import { useEffect, useState } from 'react';
import { requestService } from '@/services/api';
import { useNotificationStore } from '@/store';
import { Link } from 'react-router-dom';

export default function Requests() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const notification = useNotificationStore((s) => s.addNotification);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await requestService.listRequests();
      setRequests(res.requests || []);
    } catch (err) {
      console.error(err);
      notification({ id: 'req-list-fail', title: 'Request list failed', body: 'Could not load requests', read: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const cancel = async (id: number) => {
    try {
      await requestService.cancelRequest(id);
      setRequests((s) => s.filter((r) => r.id !== id));
      notification({ id: `cancel-${id}`, title: 'Cancelled', body: 'Request cancelled', read: false });
    } catch (err) {
      notification({ id: `cancel-err-${id}`, title: 'Failed', body: 'Could not cancel request', read: false });
    }
  };

  const respond = async (id: number, action: 'accept' | 'reject') => {
    try {
      const res = await requestService.respondRequest(id, action);
      setRequests((s) => s.map((r) => (r.id === id ? res.request : r)));
      notification({ id: `resp-${id}`, title: `Request ${action}ed`, body: `You ${action}ed a request`, read: false });
    } catch (err) {
      notification({ id: `resp-err-${id}`, title: 'Failed', body: `Could not ${action} request`, read: false });
    }
  };

  const incoming = requests.filter((r) => String(r.to) === (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : 'demo'));
  const outgoing = requests.filter((r) => String(r.from) === (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : 'demo'));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6">Requests</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">Incoming</h3>
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : incoming.length === 0 ? (
              <div className="text-gray-400">No incoming requests</div>
            ) : (
              <ul className="space-y-4">
                {incoming.map((r) => (
                  <li key={r.id} className="flex items-start justify-between gap-3">
                    <div>
                      <Link to={`/profile/${r.to}`} className="font-semibold hover:underline">{r.toName || `Profile ${r.to}`}</Link>
                      <div className="text-sm text-gray-400">From: {r.from}</div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => respond(r.id, 'accept')} className="px-3 py-2 rounded-lg bg-green-500/90 text-white text-sm">Accept</button>
                      <button onClick={() => respond(r.id, 'reject')} className="px-3 py-2 rounded-lg bg-red-500/90 text-white text-sm">Reject</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">Outgoing</h3>
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : outgoing.length === 0 ? (
              <div className="text-gray-400">No outgoing requests</div>
            ) : (
              <ul className="space-y-4">
                {outgoing.map((r) => (
                  <li key={r.id} className="flex items-start justify-between gap-3">
                    <div>
                      <Link to={`/profile/${r.to}`} className="font-semibold hover:underline">{r.toName || `Profile ${r.to}`}</Link>
                      <div className="text-sm text-gray-400">To: {r.to}</div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => cancel(r.id)} className="px-3 py-2 rounded-lg bg-yellow-600/90 text-white text-sm">Cancel</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
