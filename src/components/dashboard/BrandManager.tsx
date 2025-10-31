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

  // Form states
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
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trial_requests',
        },
        (payload) => {
          const updatedTrialRequest = payload.new as TrialRequest;
          setTrialRequests(prev => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(prev).map(([ideaId, trial]) =>
                trial.id === updatedTrialRequest.id
                  ? [ideaId, updatedTrialRequest]
                  : [ideaId, trial]
              )
            )
          }));
        }
      )
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
              setTrialRequests(prev => ({
                ...prev,
                [idea.id]: trialData as TrialRequest
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
      setTrialRequests(prev => ({
        ...prev,
        [adIdea.id]: data as TrialRequest
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

      // Upload logo if provided
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile);
      }

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
          brand_colors: formData.brand_colors.filter(color => color.trim() !== ''),
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

      // Upload new logo if provided
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile);
      }

      const { data, error } = await supabase
        .from('brands')
        .update({
          name: formData.name,
          description: formData.description || null,
          logo_url: logoUrl || null,
          guidelines: formData.guidelines || null,
          industry: formData.industry || null,
          target_audience: formData.target_audience || null,
          brand_colors: formData.brand_colors.filter(color => color.trim() !== ''),
        })
        .eq('id', editingBrand.id)
        .select()
        .single();

      if (error) throw error;

      setBrands(brands.map(b => b.id === editingBrand.id ? data : b));
      if (selectedBrand?.id === editingBrand.id) {
        setSelectedBrand(data);
      }
      setEditingBrand(null);
      resetForm();
    } catch (error) {
      console.error('Error updating brand:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (!confirm('Are you sure you want to delete this brand? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', brandId);

      if (error) throw error;

      setBrands(brands.filter(b => b.id !== brandId));
      if (selectedBrand?.id === brandId) {
        setSelectedBrand(null);
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const uploadLogo = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${uuidv4()}.${fileExt}`;
    const filePath = `brand-logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('brand-assets')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('brand-assets')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
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
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('brand-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(filePath);

      // Save to database
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

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
        {/* Brand List */}
        <div className="lg:col-span-1">
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
                            <img 
                              src={brand.logo_url} 
                              alt={`${brand.name} logo`}
                              className="w-8 h-8 rounded object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium text-gray-900">{brand.name}</h3>
                          </div>
                        </div>
                        {brand.industry && (
                          <p className="text-sm text-gray-500">{brand.industry}</p>
                        )}
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
        </div>

        {/* Brand Details */}
        <div className="lg:col-span-2">
          {selectedBrand ? (
            <div className="space-y-6">
              {/* Brand Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-6">
                  {selectedBrand.logo_url ? (
                    <img
                      src={selectedBrand.logo_url}
                      alt={`${selectedBrand.name} logo`}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{selectedBrand.name}</h2>
                    {selectedBrand.industry && (
                      <p className="text-gray-500">{selectedBrand.industry}</p>
                    )}
                  </div>
                  {subscription?.tier === 'free' && (
                    !adIdeas.some(idea => idea.trial_request_id) ? (
                      <button
                        onClick={() => handleRequestTrialVideo(selectedBrand.id)}
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-black px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                      >
                        <Star className="w-4 h-4" />
                        Request Free Trial
                      </button>
                    ) : null
                  )}
                </div>
                {selectedBrand.description && (
                  <p className="text-gray-600 mb-4">{selectedBrand.description}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedBrand.target_audience && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                      <p className="text-gray-900">{selectedBrand.target_audience}</p>
                    </div>
                  )}
                  {selectedBrand.brand_colors && selectedBrand.brand_colors.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Brand Colors</label>
                      <div className="flex gap-2">
                        {selectedBrand.brand_colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded border border-gray-300"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {selectedBrand.guidelines && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand Guidelines & Creative Direction</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedBrand.guidelines}</p>
                  </div>
                )}
              </div>

              {/* Brand Assets */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Brand Assets & Files</h3>
                  <label className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload Files
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                      multiple
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Upload images, videos, documents, or any other files that represent your brand or will help in creating ads.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {brandAssets.map((asset) => (
                    <div key={asset.id} className="border border-gray-200 rounded-lg p-3">
                      {asset.file_type.startsWith('image/') ? (
                        <div className="relative">
                          <img
                            src={asset.file_url}
                            alt={asset.file_name}
                            className="w-full h-24 object-cover rounded mb-2"
                          />
                          <div className="absolute top-1 right-1 bg-black/50 rounded p-1">
                            <Image className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      ) : asset.file_type.startsWith('video/') ? (
                        <div className="relative w-full h-24 bg-gray-100 rounded mb-2 flex items-center justify-center">
                          <Video className="w-6 h-6 text-gray-400" />
                          <div className="absolute top-1 right-1 bg-black/50 rounded p-1">
                            <Video className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-24 bg-gray-100 rounded mb-2 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-400" />
                          <div className="absolute top-1 right-1 bg-black/50 rounded p-1">
                            <FileText className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                      <p className="text-sm text-gray-900 truncate">{asset.file_name}</p>
                      <p className="text-xs text-gray-500">{(asset.file_size / 1024).toFixed(1)} KB</p>
                    </div>
                  ))}
                  {brandAssets.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No brand assets uploaded yet</p>
                      <p className="text-xs">Upload images, videos, or documents to get started</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ad Ideas */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Ad Ideas</h3>
                
                {/* Add New Ad Idea Form */}
                <form onSubmit={handleAddAdIdea} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Ad Title"
                      value={newAdIdea.title}
                      onChange={(e) => setNewAdIdea({ ...newAdIdea, title: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                    <select
                      value={newAdIdea.campaign_type}
                      onChange={(e) => setNewAdIdea({ ...newAdIdea, campaign_type: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">Campaign Type</option>
                      <option value="video">Video Ad</option>
                      <option value="static">Static Ad</option>
                      <option value="carousel">Carousel Ad</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Describe your ad idea..."
                    value={newAdIdea.description}
                    onChange={(e) => setNewAdIdea({ ...newAdIdea, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent mb-4"
                    rows={3}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Target Audience (optional)"
                    value={newAdIdea.target_audience}
                    onChange={(e) => setNewAdIdea({ ...newAdIdea, target_audience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent mb-4"
                  />
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    Add Ad Idea
                  </button>
                </form>

                {/* Ad Ideas List */}
                <div className="space-y-3">
                  {adIdeas.map((idea) => {
                    const trial = trialRequests[idea.id];
                    const isTrialPending = trial?.status === 'pending';
                    const isTrialReady = trial?.status === 'ready';
                    const isTrialDelivered = trial?.status === 'delivered';

                    return (
                      <div key={idea.id} className={`border rounded-lg p-4 ${isTrialPending || isTrialReady || isTrialDelivered ? 'border-amber-200 bg-amber-50' : 'border-gray-200'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{idea.title}</h4>
                              {trial && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                            </div>
                            <p className="text-gray-600 mt-1">{idea.description}</p>

                            {trial && (
                              <div className="mt-3 p-2 bg-white rounded border border-amber-100">
                                {isTrialPending && (
                                  <div className="flex items-center gap-2 text-sm text-amber-700">
                                    <Clock className="w-4 h-4" />
                                    <span>Free Trial Video will be ready in 7 Days. For faster generations Purchase a Paid Plan</span>
                                  </div>
                                )}
                                {isTrialReady && (
                                  <div className="flex items-center gap-2 text-sm text-green-700">
                                    <Check className="w-4 h-4" />
                                    <span>Video is ready in Downloads Tab</span>
                                  </div>
                                )}
                                {isTrialDelivered && (
                                  <div className="flex items-center gap-2 text-sm text-green-700">
                                    <Check className="w-4 h-4" />
                                    <span>Video has been delivered</span>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              {idea.campaign_type && !trial && (
                                <span className="bg-gray-100 px-2 py-1 rounded">{idea.campaign_type}</span>
                              )}
                              {idea.target_audience && !trial && (
                                <span>Target: {idea.target_audience}</span>
                              )}
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                idea.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                idea.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                idea.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {idea.status === 'new' ? 'New' :
                                 idea.status === 'in_progress' ? 'In Progress' :
                                 idea.status === 'completed' ? 'Completed' :
                                 idea.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Brand</h3>
              <p className="text-gray-500">Choose a brand from the list to view and manage its details</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Brand Modal */}
      {(showCreateForm || editingBrand) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">
                  {editingBrand ? 'Edit Brand' : 'Create New Brand'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingBrand(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={editingBrand ? handleUpdateBrand : handleCreateBrand} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Logo</label>
                  <div className="flex items-center gap-4">
                    {(logoPreview || formData.logo_url) && (
                      <div className="relative">
                        <img 
                          src={logoPreview || formData.logo_url} 
                          alt="Logo preview"
                          className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview('');
                            setFormData({ ...formData, logo_url: '' });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200">
                      <Upload className="w-4 h-4" />
                      {logoPreview || formData.logo_url ? 'Change Logo' : 'Upload Logo'}
                      <input
                        type="file"
                        onChange={handleLogoChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload your brand logo (PNG, JPG, or SVG recommended)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <input
                      type="text"
                      value={formData.target_audience}
                      onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Guidelines & Creative Direction</label>
                  <textarea
                    value={formData.guidelines}
                    onChange={(e) => setFormData({ ...formData, guidelines: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={4}
                    placeholder="Describe your brand's voice, tone, style guidelines, creative direction, and any specific requirements that should be followed when creating ads..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Include details about brand personality, messaging style, visual preferences, do's and don'ts, target audience insights, and any other creative direction.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Colors</label>
                  {formData.brand_colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...formData.brand_colors];
                          newColors[index] = e.target.value;
                          setFormData({ ...formData, brand_colors: newColors });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="#000000 or color name"
                      />
                      {formData.brand_colors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newColors = formData.brand_colors.filter((_, i) => i !== index);
                            setFormData({ ...formData, brand_colors: newColors });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, brand_colors: [...formData.brand_colors, ''] })}
                    className="text-sm text-black hover:underline"
                  >
                    + Add Color
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : (editingBrand ? 'Update Brand' : 'Create Brand')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingBrand(null);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManager;