import React, { useState, useEffect } from 'react';
import { useStorage } from '../context/StorageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Folder, 
  FileText, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ArrowLeft, 
  Search, 
  Grid, 
  List, 
  ExternalLink,
  Loader2,
  FolderPlus,
  CloudUpload,
  X
} from 'lucide-react';
import UploadZone from './UploadZone';
import PreviewModal from './PreviewModal';

const FileManager = ({ wingProp = null }) => {
  const { user } = useAuth();
  const { 
    wings, 
    folders, 
    files, 
    currentFolder, 
    currentPath, 
    loading, 
    fetchDirectory, 
    createFolder, 
    deleteFolder, 
    deleteFiles 
  } = useStorage();

  // Selected Wing & Folder navigation states
  const [selectedWing, setSelectedWing] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Selection check states
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  
  // Modals & inputs states
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  
  // Search parameters inside this workspace
  const [localSearch, setLocalSearch] = useState('');

  // Determine user authorization
  const canModify = user && (user.role === 'super_admin' || (user.role === 'wing_admin' && user.wing === selectedWing));

  // Initialize selected wing based on user role or wingProp
  useEffect(() => {
    if (wingProp) {
      setSelectedWing(wingProp);
    } else if (user) {
      if (user.role === 'wing_admin' && user.wing) {
        setSelectedWing(user.wing);
      } else if (wings.length > 0) {
        setSelectedWing(wings[0].name);
      }
    }
  }, [user, wings, wingProp]);

  // Refetch when wing or folder changes
  useEffect(() => {
    if (selectedWing) {
      fetchDirectory(selectedWing, currentFolder?._id || null);
      setSelectedFileIds([]);
    }
  }, [selectedWing, currentFolder]);

  const handleFolderClick = (folder) => {
    fetchDirectory(selectedWing, folder._id);
  };

  const handleBreadcrumbClick = (folderId = null) => {
    fetchDirectory(selectedWing, folderId);
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim() || !selectedWing) return;
    const parentId = currentFolder?._id || null;
    
    const result = await createFolder(newFolderName.trim(), selectedWing, parentId);
    if (result.success) {
      setNewFolderName('');
      setShowNewFolderInput(false);
    } else {
      alert(result.message);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm('Are you sure you want to delete this folder and all its contents?')) return;
    const result = await deleteFolder(folderId, selectedWing);
    if (!result.success) alert(result.message);
  };

  const handleFileSelectToggle = (fileId) => {
    setSelectedFileIds(prev => 
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedFileIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedFileIds.length} files?`)) return;
    
    const result = await deleteFiles(selectedFileIds, selectedWing, currentFolder?._id || null);
    if (result.success) {
      setSelectedFileIds([]);
    } else {
      alert(result.message);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Filter folders and files based on local search
  const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(localSearch.toLowerCase()));
  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(localSearch.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      {/* Header bar controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Wing Selector (Super Admin or Viewer only) */}
        {!wingProp && user && (user.role === 'super_admin' || user.role === 'viewer') ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Browsing Wing:</span>
            <select
              value={selectedWing}
              onChange={(e) => {
                setSelectedWing(e.target.value);
                // Reset folder navigation to root
                fetchDirectory(e.target.value, null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-neutral-200 focus:outline-none transition font-semibold"
            >
              {wings.map(wing => (
                <option key={wing._id} value={wing.name}>
                  {wing.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <h2 className="text-sm font-bold text-neutral-200 tracking-wide uppercase">{selectedWing} Workspace</h2>
        )}

        {/* View mode toggle, Search, & Multi actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Local search bar */}
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search current directory..."
              className="pl-9 pr-4 py-1.5 rounded-xl bg-neutral-950 border border-white/5 text-xs text-neutral-200 focus:outline-none focus:border-violet-500/60 placeholder-neutral-600 transition w-full md:w-56"
            />
          </div>

          {/* Grid/List toggles */}
          <div className="flex rounded-lg bg-neutral-950 p-1 border border-white/5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white/5 text-violet-400' : 'text-neutral-500 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white/5 text-violet-400' : 'text-neutral-500 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Bulk delete action */}
          {selectedFileIds.length > 0 && canModify && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white shadow-lg shadow-rose-900/10 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete ({selectedFileIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Directory Path Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-neutral-400 font-semibold px-2 flex-wrap">
        <button
          onClick={() => handleBreadcrumbClick(null)}
          className="hover:text-white transition"
        >
          Root
        </button>
        {currentPath.map((folder, idx) => (
          <React.Fragment key={folder._id}>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <button
              onClick={() => handleBreadcrumbClick(folder._id)}
              className={`hover:text-white transition ${idx === currentPath.length - 1 ? 'text-violet-400' : ''}`}
            >
              {folder.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Action Triggers for Admin */}
      {canModify && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-xs font-semibold text-white shadow-lg transition"
          >
            <CloudUpload className="w-4 h-4" />
            Upload File
          </button>
          <button
            onClick={() => setShowNewFolderInput(!showNewFolderInput)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition"
          >
            <FolderPlus className="w-4 h-4" />
            New Folder
          </button>
        </div>
      )}

      {/* New Folder Inline Form */}
      {showNewFolderInput && (
        <form onSubmit={handleCreateFolder} className="flex gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 max-w-sm">
          <input
            type="text"
            required
            autoFocus
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="flex-1 px-3 py-2 rounded-xl bg-neutral-950 border border-white/5 text-xs text-neutral-200 focus:outline-none focus:border-violet-500/60"
          />
          <button
            type="submit"
            className="px-3.5 rounded-xl bg-violet-600 text-white font-semibold text-xs"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setShowNewFolderInput(false)}
            className="px-3 rounded-xl bg-white/5 text-neutral-400 hover:text-white text-xs border border-white/5"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Display Directories Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-400">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          <span className="text-xs font-semibold uppercase tracking-wider">Syncing Storage Assets...</span>
        </div>
      ) : (
        <>
          {/* Main Grid View */}
          {viewMode === 'grid' ? (
            <div className="flex flex-col gap-6">
              {/* Folders Section */}
              {filteredFolders.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-neutral-500 tracking-wider uppercase">Folders ({filteredFolders.length})</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredFolders.map(folder => (
                      <div
                        key={folder._id}
                        onClick={() => handleFolderClick(folder)}
                        className="group relative p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 flex items-center gap-3 cursor-pointer transition duration-300 select-none"
                      >
                        <Folder className="w-8 h-8 text-violet-400/80 group-hover:scale-105 transition" />
                        <span className="text-xs font-semibold text-neutral-300 group-hover:text-white truncate pr-4">
                          {folder.name}
                        </span>
                        
                        {canModify && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFolder(folder._id);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Files Section */}
              {filteredFiles.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-neutral-500 tracking-wider uppercase">Files ({filteredFiles.length})</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredFiles.map(file => {
                      const isSelected = selectedFileIds.includes(file._id);
                      return (
                        <div
                          key={file._id}
                          onClick={() => setPreviewFile(file)}
                          className={`group relative p-4 rounded-2xl border transition duration-300 flex flex-col gap-3 cursor-pointer ${
                            isSelected 
                              ? 'bg-violet-600/10 border-violet-500/30' 
                              : 'bg-white/[0.01] border-white/5 hover:border-white/15 hover:bg-white/[0.02]'
                          }`}
                        >
                          {/* Selection Checkbox */}
                          {canModify && (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => handleFileSelectToggle(file._id)}
                              className="absolute top-3 left-3 accent-violet-600 w-3.5 h-3.5 opacity-0 group-hover:opacity-100 checked:opacity-100 transition duration-300"
                            />
                          )}

                          {/* Thumbnail / Icon Container */}
                          <div className="w-full aspect-[4/3] rounded-xl bg-neutral-950 flex items-center justify-center overflow-hidden border border-white/5 relative">
                            {file.mimeType.startsWith('image/') ? (
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                              />
                            ) : (
                              <FileText className="w-10 h-10 text-neutral-500" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <ExternalLink className="w-5 h-5 text-white" />
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-neutral-200 group-hover:text-violet-300 transition truncate" title={file.name}>
                              {file.name}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-medium">{formatSize(file.size)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredFolders.length === 0 && filteredFiles.length === 0 && (
                <div className="text-center py-20 border border-dashed border-white/5 rounded-2xl text-xs text-neutral-500 font-semibold uppercase tracking-wider">
                  No files or folders in directory
                </div>
              )}
            </div>
          ) : (
            /* List View */
            <div className="overflow-x-auto glass-panel rounded-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-neutral-400 font-bold uppercase tracking-wider">
                    {canModify && <th className="p-4 w-10"></th>}
                    <th className="p-4">Name</th>
                    <th className="p-4">Size</th>
                    <th className="p-4">Uploaded By</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Folders in List */}
                  {filteredFolders.map(folder => (
                    <tr
                      key={folder._id}
                      onClick={() => handleFolderClick(folder)}
                      className="border-b border-white/5 hover:bg-white/[0.01] cursor-pointer group transition"
                    >
                      {canModify && <td className="p-4"></td>}
                      <td className="p-4 font-semibold text-neutral-200 flex items-center gap-2">
                        <Folder className="w-4 h-4 text-violet-400" />
                        {folder.name}
                      </td>
                      <td className="p-4 text-neutral-500">--</td>
                      <td className="p-4 text-neutral-400">{folder.createdBy || 'System'}</td>
                      <td className="p-4 text-right">
                        {canModify && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFolder(folder._id);
                            }}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Files in List */}
                  {filteredFiles.map(file => {
                    const isSelected = selectedFileIds.includes(file._id);
                    return (
                      <tr
                        key={file._id}
                        onClick={() => setPreviewFile(file)}
                        className={`border-b border-white/5 hover:bg-white/[0.01] cursor-pointer group transition ${isSelected ? 'bg-violet-500/5' : ''}`}
                      >
                        {canModify && (
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleFileSelectToggle(file._id)}
                              className="accent-violet-600 w-3.5 h-3.5"
                            />
                          </td>
                        )}
                        <td className="p-4 font-semibold text-neutral-200 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-neutral-400" />
                          {file.name}
                        </td>
                        <td className="p-4 text-neutral-400">{formatSize(file.size)}</td>
                        <td className="p-4 text-neutral-400">{file.uploadedBy}</td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setPreviewFile(file)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition inline-block mr-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredFolders.length === 0 && filteredFiles.length === 0 && (
                <div className="text-center py-16 text-xs text-neutral-500 font-semibold uppercase tracking-wider">
                  No files or folders in directory
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Upload Modal Overlay */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          <div className="relative w-full max-w-xl glass-panel rounded-2xl p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <h3 className="text-sm font-semibold text-neutral-200">Upload Media Assets</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <UploadZone
              wingName={selectedWing}
              folderId={currentFolder?._id || null}
              onComplete={() => {
                setShowUploadModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* File Preview lightbox */}
      <PreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
};

export default FileManager;
