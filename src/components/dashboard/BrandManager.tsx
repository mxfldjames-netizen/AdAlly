import React, { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, CreditCard as Edit, Save, X, Package, Image, FileText, Video, Star, Check, Clock } from 'lucide-react';
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
    brand_colors: [''],
  });

  const [newAdIdea, setNewAdIdea] = useState({
    title: '',
    description: '',
    target_audience: '',
    campaign_type: '',
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
      if (realtimeSubscription) {
        supabase.removeChannel(realtimeSubscription);
      }
    };
  }, [selectedBrand]);

  const setupRealtimeUpdates = () => {
    if (!selectedBrand) return;
    const channel = supabase
      .channel(`trial_requests_${selectedBrand.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'trial_requests' }, (payload) => {
        const updatedTrialRequest = payload.new as TrialRequest;
        setTrialRequests((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(prev).map(([ideaId, trial]) =>
              trial.id === updatedTrialRequest.id ? [ideaId, updatedTrialRequest] : [ideaId, trial]
            )
          ),
        }));
      })
      .subscribe();
    setRealtimeSubscription(channel);
  };

  const fetchSubscription = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('user_subscriptions').select('tier').eq('user_id', user.id).maybeSingle();
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
              setTrialRequests((prev) => ({
                ...prev,
                [idea.id]: trialData as TrialRequest,
              }));
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
          ready_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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
          trial_request_id: data.id,
        })
        .select()
        .single();
      if (adError) throw adError;

      setAdIdeas([adIdea, ...adIdeas]);
      setTrialRequests((prev) => ({
        ...prev,
        [adIdea.id]: data as TrialRequest,
      }));
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
          brand_colors: formData.brand_colors.filter((c) => c.trim() !== ''),
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
          brand_colors: formData.brand_colors.filter((c) => c.trim() !== ''),
        })
        .eq('id', editingBrand.id)
        .select()
        .single();
      if (error) throw error;
      setBrands(brands.map((b) => (b.id === editingBrand.id ? data : b)));
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
      setBrands(brands.filter((b) => b.id !== brandId));
      if (selectedBrand?.id === brandId) setSelectedBrand(null);
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const uploadLogo = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${uuidv4()}.${fileExt}`;
    const filePath = `brand-logos/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('brand-assets').upload(filePath, file);
    if (uploadError) throw uploadError;
    const {
      data: { publicUrl },
    } = supabase.storage.from('brand-assets').getPublicUrl(filePath);
    return publicUrl;
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedBrand) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `brand-assets/${selectedBrand.id}/${fileName}`;
    try {
      const { error: uploadError } = await supabase.storage.from('brand-assets').upload(filePath, file);
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl },
      } = supabase.storage.from('brand-assets').getPublicUrl(filePath);
      const { data, error } = await supabase
        .from('brand_assets')
        .insert({
          brand_id: selectedBrand.id,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
        })
        .select()
        .single();
      if (error) throw error;
      setBrandAssets([data, ...brandAssets]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleAddAdIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand) return;
    try {
      const { data, error } = await supabase
        .from('ad_ideas')
        .insert({
          brand_id: selectedBrand.id,
          title: newAdIdea.title,
          description: newAdIdea.description,
          target_audience: newAdIdea.target_audience || null,
          campaign_type: newAdIdea.campaign_type || null,
          status: 'new',
        })
        .select()
        .single();
      if (error) throw error;
      setAdIdeas([data, ...adIdeas]);
      setNewAdIdea({ title: '', description: '', target_audience: '', campaign_type: '' });
    } catch (error) {
      console.error('Error adding ad idea:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      logo_url: '',
      guidelines: '',
      industry: '',
      target_audience: '',
      brand_colors: [''],
    });
    setLogoFile(null);
    setLogoPreview('');
  };

  const startEditing = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      logo_url: brand.logo_url || '',
      guidelines: brand.guidelines || '',
      industry: brand.industry || '',
      target_audience: brand.target_audience || '',
      brand_colors: brand.brand_colors || [''],
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
          <Plus className="w-4 h-4" />
          Create Brand
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Brands + Custom Ad Ideas */}
        <div className="lg:col-span-1 space-y-6">
          {/* Your Brands */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Your Brands</h2>
            </div>
            <div className="p-4 space-y-3">
              {brands.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No brands created yet</p>
              ) : (
                brands.map((brand) => (
                  <div
                    key={brand.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
                      selectedBrand?.id === brand.id
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedBrand(brand)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          {brand.logo_url ? (
                            <img src={brand.logo_url} alt={`${brand.name} logo`} className="w-8 h-8 rounded object-cover" />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium text-gray-900">{brand.name}</h3>
                          </div>
                        </div>
                        {brand.industry && <p className="text-sm text-gray-500">{brand.industry}</p>}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(brand);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
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
                ))
              )}
            </div>
          </div>

          {/* Custom Ad Ideas (moved here) */}
          {selectedBrand && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Ad Ideas</h3>
              <form onSubmit={handleAddAdIdea} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Ad Title"
                    value={newAdIdea.title}
                    onChange={(e) => setNewAdIdea({ ...newAdIdea, title: e.target.value })}
                    className="border border-gray-300 rounded-lg p-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Campaign Type"
                    value={newAdIdea.campaign_type}
                    onChange={(e) => setNewAdIdea({ ...newAdIdea, campaign_type: e.target.value })}
                    className="border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <textarea
                  placeholder="Ad Description"
                  value={newAdIdea.description}
                  onChange={(e) => setNewAdIdea({ ...newAdIdea, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                  rows={3}
                  required
                />
                <input
                  type="text"
                  placeholder="Target Audience"
                  value={newAdIdea.target_audience}
                  onChange={(e) => setNewAdIdea({ ...newAdIdea, target_audience: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                />
                <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
                  Add Ad Idea
                </button>
              </form>

              {/* Sort trial ad ideas first */}
              {[...adIdeas]
                .sort((a, b) => {
                  const aTrial = !!a.trial_request_id;
                  const bTrial = !!b.trial_request_id;
                  if (aTrial && !bTrial) return -1;
                  if (!aTrial && bTrial) return 1;
                  return 0;
                })
                .map((idea) => {
                  const trial = trialRequests[idea.id];
                  return (
                    <div
                      key={idea.id}
                      className={`p-4 mb-3 border rounded-lg ${
                        idea.trial_request_id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{idea.title}</h4>
                          <p className="text-sm text-gray-600">{idea.description}</p>
                        </div>
                        {idea.trial_request_id && (
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              trial?.status === 'delivered'
                                ? 'bg-green-100 text-green-700'
                                : trial?.status === 'ready'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {trial?.status || 'pending'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Right column: brand details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedBrand ? (
            <div className="space-y-6">
              {/* Brand info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    {selectedBrand.logo_url ? (
                      <img
                        src={selectedBrand.logo_url}
                        alt={`${selectedBrand.name} logo`}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedBrand.name}</h2>
                      {selectedBrand.industry && (
                        <p className="text-sm text-gray-500">{selectedBrand.industry}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRequestTrialVideo(selectedBrand.id)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
                  >
                    <Video className="w-4 h-4" />
                    Request Free Trial Video
                  </button>
                </div>
                <p className="text-gray-700">{selectedBrand.description || 'No description provided'}</p>
                {selectedBrand.target_audience && (
                  <p className="text-gray-600 mt-2">
                    <strong>Target Audience:</strong> {selectedBrand.target_audience}
                  </p>
                )}
                {selectedBrand.brand_colors && selectedBrand.brand_colors.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {selectedBrand.brand_colors.map((color, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border" style={{ backgroundColor: color }}></div>
                    ))}
                  </div>
                )}
              </div>

              {/* Brand assets */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Assets</h3>
                <div className="flex items-center gap-3 mb-4">
                  <label className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload Asset
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {brandAssets.length === 0 ? (
                  <p className="text-gray-500">No assets uploaded yet</p>
                ) : (
                  <ul className="space-y-3">
                    {brandAssets.map((asset) => (
                      <li key={asset.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-3">
                          {asset.file_type.startsWith('image/') ? (
                            <img src={asset.file_url} alt={asset.file_name} className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <FileText className="w-8 h-8 text-gray-400" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{asset.file_name}</p>
                            <p className="text-xs text-gray-500">{(asset.file_size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <a
                          href={asset.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
              Select a brand to view its details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandManager;
