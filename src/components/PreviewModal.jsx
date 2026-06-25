import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Play, Eye } from 'lucide-react';

const PreviewModal = ({ file, isOpen, onClose }) => {
  if (!isOpen || !file) return null;

  const isImage = file.mimeType.startsWith('image/');
  const isVideo = file.mimeType.startsWith('video/');
  const isPdf = file.mimeType.includes('pdf');

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative w-full max-w-5xl glass-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col z-10 max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5">
                <FileText className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white max-w-[250px] sm:max-w-[400px] truncate" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-xs text-neutral-400">{formatSize(file.size)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-xs font-semibold text-white transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-neutral-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Preview Area */}
          <div className="flex-1 overflow-auto bg-neutral-950/60 p-6 flex flex-col items-center justify-start min-h-[300px]">
            <div className="w-full flex items-center justify-center min-h-[200px]">
              {isImage ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-2xl border border-white/5"
                />
              ) : isVideo ? (
                <video
                  src={file.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[50vh] rounded-lg shadow-2xl border border-white/5 focus:outline-none"
                />
              ) : isPdf ? (
                <iframe
                  src={file.url}
                  title={file.name}
                  className="w-full h-[50vh] rounded-lg border border-white/5 bg-white"
                />
              ) : (
                <div className="text-center py-8 px-6 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                    <FileText className="w-8 h-8 text-neutral-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-200">No Interactive Preview Available</h4>
                    <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                      This file format ({file.mimeType}) is not supported for inline display. Please use the download link.
                    </p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-semibold text-white transition-all mt-2"
                  >
                    Download to View
                  </button>
                </div>
              )}
            </div>

            {/* Description & Report section */}
            {(file.description || file.reportUrl) && (
              <div className="w-full max-w-2xl mt-4 flex flex-col gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
                {file.description && (
                  <div>
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      Description
                    </h4>
                    <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/40 p-3 rounded-xl border border-white/[0.03]">
                      {file.description}
                    </p>
                  </div>
                )}
                {file.reportUrl && (
                  <div>
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
                      Associated Report
                    </h4>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-violet-600/5 border border-violet-500/20">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/10 text-violet-400">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-neutral-200 truncate max-w-[250px] sm:max-w-xs" title={file.reportName}>
                            {file.reportName || 'Report Document'}
                          </p>
                          <p className="text-[10px] text-neutral-500 font-semibold font-mono">
                            {file.reportSize ? `${(file.reportSize / 1024).toFixed(1)} KB` : 'Attached PDF/Doc'}
                          </p>
                        </div>
                      </div>
                      <a
                        href={file.reportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-xs font-semibold text-white shadow-lg shadow-violet-500/10 transition-all duration-300"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Report
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Details Bar */}
          <div className="p-4 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400">
            <div>
              <span className="font-semibold text-neutral-300">Wing:</span> {file.wing} | <span className="font-semibold text-neutral-300">Uploader:</span> {file.uploadedBy}
            </div>
            {file.tags && file.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {file.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PreviewModal;
