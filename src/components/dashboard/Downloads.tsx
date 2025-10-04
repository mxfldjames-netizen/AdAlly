import React, { useState, useEffect } from 'react';
import { Download, Eye, Trash2, Calendar, FileText, Image, Video, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface DownloadItem {
  id: string;
  ad_idea_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
  ad_idea: {
    title: string;
    brand: {
      name: string;
      logo_url: string | null;
    };
  };
}

const Downloads: React.FC = () => {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<DownloadItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDownloads();
    }
  }, [user]);

  const fetchDownloads = async () => {
    try {
      const { data, error } = await supabase
        .from('downloads')
        .select(`
          *,
          ad_idea:ad_ideas(
            title,
            brand:brands(
              name,
              logo_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDownloads(data || []);
    } catch (error) {
      console.error('Error fetching downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (download: DownloadItem) => {
    try {
      const response = await fetch(download.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = download.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = async (downloadId: string) => {
    if (!confirm('Are you sure you want to delete this download?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('downloads')
        .delete()
        .eq('id', downloadId);

      if (error) throw error;

      setDownloads(downloads.filter(d => d.id !== downloadId));
    } catch (error) {
      console.error('Error deleting download:', error);
    }
  };

  const handlePreview = (download: DownloadItem) => {
    setSelectedFile(download);
    setIsPreviewOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.startsWith('video/')) return Video;
    return FileText;
  };

  const getStatusColor = (fileType: string) => {
    if (fileType.startsWith('image/')) return 'bg-green-100 text-green-800';
    if (fileType.startsWith('video/')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Downloads</h1>
        <div className="text-sm text-gray-500">
          {downloads.length} file{downloads.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {downloads.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Downloads Yet</h3>
          <p className="text-gray-500 mb-4">
            Your completed ad files will appear here once they're ready for download.
          </p>
          <p className="text-sm text-gray-400">
            Create ad ideas in your brands and wait for them to be completed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloads.map((download) => {
            const FileIcon = getFileIcon(download.file_type);
            return (
              <div key={download.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* File Preview */}
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                  {download.file_type.startsWith('image/') ? (
                    <img
                      src={download.file_url}
                      alt={download.file_name}
                      className="w-full h-full object-cover"
                    />
                  ) : download.file_type.startsWith('video/') ? (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      <Video className="w-12 h-12 text-white" />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                  ) : (
                    <FileIcon className="w-12 h-12 text-gray-400" />
                  )}
                  
                  {/* File Type Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(download.file_type)}`}>
                    {download.file_type.split('/')[0]}
                  </div>
                </div>

                {/* File Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {download.ad_idea.brand.logo_url ? (
                      <img
                        src={download.ad_idea.brand.logo_url}
                        alt={download.ad_idea.brand.name}
                        className="w-6 h-6 rounded object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                        <Package className="w-3 h-3 text-gray-400" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {download.ad_idea.brand.name}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {download.ad_idea.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-2 truncate">
                    {download.file_name}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(download.created_at).toLocaleDateString()}
                    </div>
                    <span>{formatFileSize(download.file_size)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePreview(download)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleDownload(download)}
                      className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(download.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors duration-200"
            >
              <Eye className="w-5 h-5" />
            </button>

            {/* Preview Content */}
            <div className="aspect-video bg-black flex items-center justify-center">
              {selectedFile.file_type.startsWith('image/') ? (
                <img
                  src={selectedFile.file_url}
                  alt={selectedFile.file_name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : selectedFile.file_type.startsWith('video/') ? (
                <video
                  src={selectedFile.file_url}
                  controls
                  className="max-w-full max-h-full"
                  autoPlay
                />
              ) : (
                <div className="text-center text-white">
                  <FileText className="w-16 h-16 mx-auto mb-4" />
                  <p>Preview not available for this file type</p>
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {selectedFile.ad_idea.title}
                  </h3>
                  <p className="text-gray-600">{selectedFile.file_name}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>{selectedFile.ad_idea.brand.name}</span>
                    <span>{formatFileSize(selectedFile.file_size)}</span>
                    <span>{new Date(selectedFile.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(selectedFile)}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Downloads;