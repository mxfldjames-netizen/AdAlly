import React, { useState, useEffect } from 'react';
import { Upload, Loader, AlertCircle, Check, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface TrialRequestWithBrand {
  id: string;
  user_id: string;
  brand_id: string;
  status: 'pending' | 'ready' | 'delivered';
  requested_at: string;
  brand: {
    name: string;
  };
  ad_idea: {
    id: string;
    title: string;
  };
}

const AdminPanel: React.FC = () => {
  const [trialRequests, setTrialRequests] = useState<TrialRequestWithBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('user_subscriptions')
        .select('tier')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setIsAdmin(profile?.tier === 'admin' || user.email?.includes('admin'));
      fetchTrialRequests();
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrialRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('trial_requests')
        .select(`
          *,
          brand:brands(name),
          ad_idea:ad_ideas(id, title)
        `)
        .eq('status', 'pending')
        .order('requested_at', { ascending: true });

      if (error) throw error;
      setTrialRequests(data || []);
    } catch (error) {
      console.error('Error fetching trial requests:', error);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, trialRequestId: string, adIdeaId: string) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setUploading(trialRequestId);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `trial-${uuidv4()}.${fileExt}`;
      const filePath = `trial-videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('brand-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(filePath);

      const { data: download, error: downloadError } = await supabase
        .from('downloads')
        .insert({
          ad_idea_id: adIdeaId,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
        })
        .select()
        .single();

      if (downloadError) throw downloadError;

      const { error: updateError } = await supabase
        .from('trial_requests')
        .update({ status: 'ready' })
        .eq('id', trialRequestId);

      if (updateError) throw updateError;

      setTrialRequests(trialRequests.filter(tr => tr.id !== trialRequestId));
      setUploading(null);
    } catch (error) {
      console.error('Error uploading trial video:', error);
      setUploading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-900 mb-1">Access Denied</h3>
          <p className="text-red-700">You do not have permission to access the admin panel. Contact support for access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h1 className="text-2xl font-bold text-black mb-2">Admin Panel - Trial Video Management</h1>
        <p className="text-gray-600">Upload trial videos for pending requests</p>
      </div>

      {trialRequests.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-900 mb-2">All Caught Up!</h3>
          <p className="text-green-700">No pending trial requests at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {trialRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{request.brand.name}</h3>
                  <p className="text-gray-600 mt-1">{request.ad_idea.title}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    Requested: {new Date(request.requested_at).toLocaleDateString()}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <Clock className="w-4 h-4" />
                  Pending
                </span>
              </div>

              <label className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-lg p-6 hover:border-blue-400 transition-colors duration-200 cursor-pointer">
                <Upload className="w-5 h-5 text-blue-600" />
                <div className="text-center">
                  <p className="font-medium text-gray-900">
                    {uploading === request.id ? 'Uploading...' : 'Upload Video File'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">MP4, WebM, or other video formats</p>
                </div>
                <input
                  type="file"
                  onChange={(e) => handleVideoUpload(e, request.id, request.ad_idea.id)}
                  disabled={uploading === request.id}
                  className="hidden"
                  accept="video/*"
                />
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
