import React, { useState, useEffect } from 'react';
import {
  Plus,
  Upload,
  Trash2,
  CreditCard as Edit,
  Save,
  X,
  Package,
  Image,
  FileText,
  Video,
  Star,
  Check,
  Clock
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface Brand {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  guidelines: string | null;
  industry: string | null;
  target_audience: string | null;
  brand_colors: string[] | null;
}

interface BrandAsset {
  id: string;
  brand_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
}

interface AdIdea {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  target_audience: string | null;
  campaign_type: string | null;
  status: string;
  trial_request_id: string | null;
}

interface TrialRequest {
  id: string;
  status: 'pending' | 'ready' | 'delivered';
  requested_at: string;
  ready_at: string | null;
}

interface Subscription {
  tier: 'free' | 'basic' | 'creator' | 'viral';
}

const BrandManager: React.FC = () => {
  const { user } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([]);
  const [adIdeas, setAdIdeas] = useState<AdIdea[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [trialRequests, setTrialRequests] = useState<Record<string, TrialRequest>>({});
  const [realtimeSubscription, setRealtimeSubscription] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
    guidelines: '',
    industry: '',
    target_audience: '',
    brand_colors: ['']
  });

  const [newAdIdea, setNewAdIdea] = useState({
    title: '',
    description: '',
    target_audience: '',
    campaign_type: ''
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBrands();
      fetchSubscription();
    }
  }, [user]);

  useEffect(() => {
    if (selectedBrand) {
      fetchBrandAssets(selectedBrand.id);
      fetchAdIdeas(selectedBrand.id);
      setupRealtimeUpdates();
    }
    return () => {
      if (realtimeSubscription) supabase.removeChannel(realtimeSubscription);
    };
  }, [selectedBrand]);

  const setupRealtimeUpdates = () => {
    if (!selectedBrand) return;
    const channel = supabase
      .channel(`trial_requests_${selectedBrand.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'trial_requests' }, payload => {
        const updatedTrialRequest = payload.new as TrialRequest;
        setTrialRequests(prev => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(prev).map(([ideaId, trial]) =>
              trial.id === updatedTrialRequest.id ? [ideaId, updatedTrialRequest] : [ideaId, trial]
            )
          )
        }));
      })
      .subscribe();
    setRealtimeSubscription(channel);
  };

  const fetchSubscription = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('tier')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      if (data) setSubscription(data as Subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandAssets = async (brandId: string) => {
    try {
      const { data, error } = await supabase
        .from('brand_assets')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setBrandAssets(data || []);
    } catch (error) {
      console.error('Error fetching brand assets:', error);
    }
  };

  const fetchAdIdeas = async (brandId: string) => {
    try {
      const { data, error } = await supabase
        .from('ad_ideas')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAdIdeas(data || []);
      if (data) {
        for (const idea of data) {
          if (idea.trial_request_id) {
            const { data: trialData } = await supabase
              .from('trial_requests')
              .select('*')
              .eq('id', idea.trial_request_id)
              .maybeSingle();
            if (trialData) {
              setTrialRequests(prev => ({ ...prev, [idea.id]: trialData as TrialRequest }));
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching ad ideas:', error);
    }
  };

  const handleRequestTrialVideo = async (brandId: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('trial_requests')
        .insert({
          user_id: user.id,
          brand_id: brandId,
          status: 'pending',
          ready_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();
      if (error) throw error;

      const { data: adIdea, error: adError } = await supabase
        .from('ad_ideas')
        .insert({
          brand_id: brandId,
          title: 'Free Trial Video',
          description: 'Free trial video request',
          status: 'new',
          trial_request_id: data.id
        })
        .select()
        .single();

      if (adError) throw adError;
      setAdIdeas([adIdea, ...adIdeas]);
      setTrialRequests(prev => ({ ...prev, [adIdea.id]: data as TrialRequest }));
    } catch (error) {
      console.error('Error requesting trial video:', error);
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      let logoUrl = formData.logo_url;
      if (logoFile) logoUrl = await uploadLogo(logoFile);

      const { data, error } = await supabase
        .from('brands')
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description || null,
          logo_url: logoUrl || null,
          guidelines: formData.guidelines || null,
          industry: formData.industry || null,
          target_audience: formData.target_audience || null,
          brand_colors: formData.brand_colors.filter(c => c.trim() !== '')
        })
        .select()
        .single();
      if (error) throw error;

      setBrands([data, ...brands]);
      setShowCreateForm(false);
      resetForm();
    } catch (error) {
      console.error('Error creating brand:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;
    setLoading(true);
    try {
      let logoUrl = formData.logo_url;
      if (logoFile) logoUrl = await uploadLogo(logoFile);

      const { data, error } = await supabase
        .from('brands')
        .update({
          name: formData.name,
          description: formData.description || null,
          logo_url: logoUrl || null,
          guidelines: formData.guidelines || null,
          industry: formData.industry || null,
          target_audience: formData.target_audience || null,
          brand_colors: formData.brand_colors.filter(c => c.trim() !== '')
        })
        .eq('id', editingBrand.id)
        .select()
        .single();
      if (error) throw error;

      setBrands(brands.map(b => (b.id === editingBrand.id ? data : b)));
      if (selectedBrand?.id === editingBrand.id) setSelectedBrand(data);
      setEditingBrand(null);
      resetForm();
    } catch (error) {
      console.error('Error updating brand:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    try {
      const { error } = await supabase.from('brands').delete().eq('id', brandId);
      if (error) throw error;
      setBrands(brands.filter(b => b.id !== brandId));
      if (selectedBrand?.id === brandId) setSelectedBrand(null);
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const uploadLogo = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `brand-logos/logo-${uuidv4()}.${ext}`;
    const { error } = await supabase.storage.from('brand-assets').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('brand-assets').getPublicUrl(path);
    return data.publicUrl;
  };

  const resetForm = () =>
    setFormData({
      name: '',
      description: '',
      logo_url: '',
      guidelines: '',
      industry: '',
      target_audience: '',
      brand_colors: ['']
    });

  const startEditing = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      logo_url: brand.logo_url || '',
      guidelines: brand.guidelines || '',
      industry: brand.industry || '',
      target_audience: brand.target_audience || '',
      brand_colors: brand.brand_colors || ['']
    });
    setLogoPreview(brand.logo_url || '');
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );

  return (
    <div className="space-y-6 pt-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Brand Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" /> Create Brand
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Your Brands + Custom Ad Ideas */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Your Brands</h2>
            </div>
            <div className="p-4 space-y-3">
              {brands.map(brand => (
                <div
                  key={brand.id}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    selectedBrand?.id === brand.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedBrand(brand)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {brand.logo_url ? (
                        <img src={brand.logo_url} alt="" className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{brand.name}</h3>
                        {brand.industry && <p className="text-xs text-gray-500">{brand.industry}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          startEditing(brand);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteBrand(brand.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Ad Ideas now under Your Brands */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Ad Ideas</h3>
            <form onSubmit={() => {}} className="text-gray-500 text-sm">
              <p>Select a brand to add or view custom ad ideas.</p>
            </form>
          </div>
        </div>

        {/* Right Column - Brand Details */}
        <div className="lg:col-span-2">
          {selectedBrand ? (
            <div className="space-y-6">
              {/* Brand Info, Assets, etc. (unchanged) */}
              {/* ... keep your same right column content here ... */}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Brand</h3>
              <p className="text-gray-500">Choose a brand to view its details</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {(showCreateForm || editingBrand) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          {/* ... same modal content ... */}
        </div>
      )}
    </div>
  );
};

export default BrandManager;
