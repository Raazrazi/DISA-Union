import React, { useState, useEffect } from 'react';
import { useStorage } from '../context/StorageContext';
import { Search, SlidersHorizontal, Grid, ExternalLink, Calendar, FileText, Database, Layers } from 'lucide-react';
import PreviewModal from '../components/PreviewModal';

const Archive = () => {
  const { wings, searchFiles, searchResults, loading } = useStorage();

  // Search parameters
  const [q, setQ] = useState('');
  const [wing, setWing] = useState('');
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [tags, setTags] = useState('');

  const [previewFile, setPreviewFile] = useState(null);

  // Trigger search on mount and when filter values change
  const triggerSearch = () => {
    searchFiles({ q, wing, type, year, tags });
  };

  useEffect(() => {
    triggerSearch();
  }, [wing, type, year]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    triggerSearch();
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto w-[92%] pt-28 pb-16 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          Historical Archive
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
          Search and discover posters, records, videos, and media compiled across all wings.
        </p>
      </div>

      {/* Advanced Filter Panel */}
      <div className="glass-panel rounded-2xl p-6">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
          {/* Main search input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search files by filename, description..."
              className="w-full pl-12 pr-28 py-3 rounded-xl bg-neutral-950 border border-white/5 text-sm text-neutral-200 focus:outline-none focus:border-violet-500/60 placeholder-neutral-600 transition"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-lg transition"
            >
              Search
            </button>
          </div>

          {/* Sub Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Wing filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Union Wing</label>
              <select
                value={wing}
                onChange={(e) => setWing(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/5 text-xs text-neutral-300 focus:outline-none"
              >
                <option value="">All Wings</option>
                {wings.map(w => (
                  <option key={w._id} value={w.name}>{w.name}</option>
                ))}
              </select>
            </div>

            {/* Media Type filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Resource Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/5 text-xs text-neutral-300 focus:outline-none"
              >
                <option value="">Any Format</option>
                <option value="image">Images / Posters</option>
                <option value="video">Videos</option>
                <option value="pdf">PDF Documents</option>
                <option value="document">General Docs</option>
                <option value="archive">ZIP / Archives</option>
              </select>
            </div>

            {/* Year timeline filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Archive Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/5 text-xs text-neutral-300 focus:outline-none"
              >
                <option value="">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            {/* Tags search filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Filter by Tag</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. sports, posters"
                className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/5 text-xs text-neutral-200 focus:outline-none placeholder-neutral-700"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Search Results Display */}
      {loading ? (
        <div className="text-center py-20 flex flex-col items-center gap-3 text-neutral-500 font-bold uppercase tracking-wider text-xs">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
          <span>Searching Archive Database...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold text-neutral-500 tracking-wider uppercase">Results ({searchResults.length})</span>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {searchResults.map(file => (
                <div
                  key={file._id}
                  onClick={() => setPreviewFile(file)}
                  className="group relative p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/15 transition duration-300 flex flex-col gap-3 cursor-pointer select-none"
                >
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
                    <div className="flex justify-between items-center text-[10px] text-neutral-500 font-bold mt-1">
                      <span className="truncate max-w-[90px]">{file.wing}</span>
                      <span>{formatSize(file.size)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-white/5 rounded-2xl text-xs text-neutral-500 font-semibold uppercase tracking-wider">
              No matching records found.
            </div>
          )}
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

export default Archive;
