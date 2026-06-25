import React, { useState, useRef } from 'react';
import { useStorage } from '../context/StorageContext';
import { Upload, X, File, Plus, MessageSquare, Tag, CloudLightning, Loader2 } from 'lucide-react';

const UploadZone = ({ wingName, folderId, onComplete }) => {
  const { uploadFiles, activeUploads } = useStorage();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [reportFile, setReportFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef(null);
  const reportInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setErrorMessage('');
    
    const result = await uploadFiles(selectedFiles, wingName, folderId, description, tags, reportFile);
    
    setIsUploading(false);
    if (result.success) {
      setSelectedFiles([]);
      setDescription('');
      setTags('');
      setReportFile(null);
      if (onComplete) onComplete();
    } else {
      setErrorMessage(result.message);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = 2;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col gap-6">
      {errorMessage && (
        <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
          {errorMessage}
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition duration-300 ${
          dragActive
            ? 'border-violet-500 bg-violet-500/5'
            : 'border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.02]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="p-4 rounded-full bg-white/5 border border-white/5 text-neutral-400">
          <Upload className="w-6 h-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-neutral-200">Drag & drop files here, or click to browse</p>
          <p className="text-xs text-neutral-500 mt-1">Supports posters, images, videos, docs, pdfs, zips</p>
        </div>
      </div>

      {/* Selected Files & Forms */}
      {selectedFiles.length > 0 && (
        <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            <span className="text-xs font-bold text-neutral-500 tracking-wider uppercase">Files to Upload ({selectedFiles.length})</span>
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <File className="w-4 h-4 text-violet-400 flex-shrink-0" />
                  <span className="text-xs text-neutral-300 font-medium truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                  <span className="text-[10px] text-neutral-500 font-semibold">{formatSize(file.size)}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="p-1 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the files"
                className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-neutral-200 focus:outline-none focus:border-violet-500/60 placeholder-neutral-600 transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="poster, activity, 2026"
                className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-neutral-200 focus:outline-none focus:border-violet-500/60 placeholder-neutral-600 transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
            <label className="text-xs font-bold text-neutral-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <File className="w-3.5 h-3.5 text-violet-400" />
                Associated Report (Optional)
              </span>
              <span className="text-[10px] text-neutral-500 font-semibold font-mono">PDF, DOC, DOCX, TXT</span>
            </label>
            
            {reportFile ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-violet-500/5 border border-violet-500/20">
                <div className="flex items-center gap-2.5 min-w-0">
                  <File className="w-4 h-4 text-violet-400 flex-shrink-0" />
                  <span className="text-xs text-neutral-300 font-medium truncate max-w-[200px] sm:max-w-xs">{reportFile.name}</span>
                  <span className="text-[10px] text-neutral-500 font-semibold">{formatSize(reportFile.size)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setReportFile(null)}
                  className="p-1 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => reportInputRef.current.click()}
                className="border border-dashed border-white/10 hover:border-violet-500/30 hover:bg-violet-500/[0.02] rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition select-none"
              >
                <Plus className="w-4 h-4 text-neutral-500" />
                <span className="text-xs text-neutral-400 font-medium">Attach a report document</span>
                <input
                  ref={reportInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setReportFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs shadow-lg shadow-violet-500/25 transition disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading Files...
              </>
            ) : (
              <>
                <CloudLightning className="w-4 h-4" />
                Start Uploading
              </>
            )}
          </button>
        </form>
      )}

      {/* Progress Bars */}
      {activeUploads.length > 0 && (
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
          <span className="text-xs font-bold text-violet-400 flex items-center gap-1.5 animate-pulse">
            <CloudLightning className="w-3.5 h-3.5" />
            Uploading Network Assets
          </span>
          <div className="flex flex-col gap-2.5">
            {activeUploads.map(up => (
              <div key={up.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-neutral-300 truncate max-w-[200px]">{up.name}</span>
                  <span className="text-neutral-400">{up.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all duration-300"
                    style={{ width: `${up.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
