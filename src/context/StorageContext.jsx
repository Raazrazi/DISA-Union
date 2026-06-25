import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const StorageContext = createContext();

export const useStorage = () => useContext(StorageContext);

export const StorageProvider = ({ children }) => {
  const { API_URL, token } = useAuth();
  
  const [wings, setWings] = useState([]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null); // Current folder object
  const [currentPath, setCurrentPath] = useState([]); // Breadcrumb path, e.g. [{_id: 'x', name: 'Posters'}]
  const [loading, setLoading] = useState(false);
  const [activeUploads, setActiveUploads] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Fetch wings list
  const fetchWings = async () => {
    try {
      const res = await axios.get(`${API_URL}/wings`);
      setWings(res.data);
    } catch (err) {
      console.error('Error fetching wings', err);
    }
  };

  useEffect(() => {
    fetchWings();
  }, [token]);

  // Load directories and files inside a folder for a wing
  const fetchDirectory = async (wingName, folderId = null) => {
    setLoading(true);
    try {
      // 1. Fetch folders of this wing
      const foldersRes = await axios.get(`${API_URL}/folders/wing/${encodeURIComponent(wingName)}`);
      const allFolders = foldersRes.data;

      // Filter subfolders of the current folder
      const subfolders = allFolders.filter(f => f.parentFolder === folderId);
      setFolders(subfolders);

      // 2. Fetch files inside this folder
      const folderParam = folderId ? `?folder=${folderId}` : '';
      const filesRes = await axios.get(`${API_URL}/files/wing/${encodeURIComponent(wingName)}${folderParam}`);
      setFiles(filesRes.data);

      // 3. Build current path (breadcrumbs)
      if (folderId) {
        const path = [];
        let curr = allFolders.find(f => f._id === folderId);
        while (curr) {
          path.unshift(curr);
          curr = allFolders.find(f => f._id === curr.parentFolder);
        }
        setCurrentPath(path);
      } else {
        setCurrentPath([]);
      }
    } catch (err) {
      console.error('Error fetching directory contents', err);
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (name, wingName, parentFolderId = null) => {
    try {
      const res = await axios.post(`${API_URL}/folders`, {
        name,
        wing: wingName,
        parentFolder: parentFolderId
      });
      setFolders(prev => [...prev, res.data]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error creating folder'
      };
    }
  };

  const deleteFolder = async (folderId, wingName) => {
    try {
      await axios.delete(`${API_URL}/folders/${folderId}`);
      // Refresh directory content
      await fetchDirectory(wingName, currentFolder?._id || null);
      await fetchWings(); // refresh storage allocation stats
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error deleting folder'
      };
    }
  };

  const uploadFiles = async (filesList, wingName, folderId = null, description = '', tags = '', reportFile = null) => {
    const formData = new FormData();
    formData.append('wing', wingName);
    formData.append('folder', folderId || '');
    formData.append('description', description);
    formData.append('tags', tags);
    if (reportFile) {
      formData.append('report', reportFile);
    }

    const tempUploads = [];
    for (let i = 0; i < filesList.length; i++) {
      formData.append('files', filesList[i]);
      tempUploads.push({
        id: `up-${Date.now()}-${i}`,
        name: filesList[i].name,
        size: filesList[i].size,
        progress: 0
      });
    }

    setActiveUploads(prev => [...prev, ...tempUploads]);

    try {
      const res = await axios.post(`${API_URL}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setActiveUploads(prev =>
            prev.map(up =>
              tempUploads.some(t => t.name === up.name) ? { ...up, progress: percentage } : up
            )
          );
        }
      });

      // Clear uploads from queue after a short delay
      setTimeout(() => {
        setActiveUploads(prev => prev.filter(up => !tempUploads.some(t => t.id === up.id)));
      }, 1000);

      // Refresh files list
      await fetchDirectory(wingName, folderId);
      await fetchWings(); // refresh storage allocation stats
      return { success: true, data: res.data };
    } catch (err) {
      // Clear uploads queue
      setActiveUploads(prev => prev.filter(up => !tempUploads.some(t => t.id === up.id)));
      return {
        success: false,
        message: err.response?.data?.message || 'Error uploading files'
      };
    }
  };

  const deleteFiles = async (fileIds, wingName, folderId = null) => {
    try {
      await axios.post(`${API_URL}/files/delete`, { ids: fileIds });
      // Refresh files list
      await fetchDirectory(wingName, folderId);
      await fetchWings(); // refresh storage allocation stats
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error deleting files'
      };
    }
  };

  const searchFiles = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params.q) queryParams.append('q', params.q);
      if (params.wing) queryParams.append('wing', params.wing);
      if (params.tags) queryParams.append('tags', params.tags);
      if (params.type) queryParams.append('type', params.type);
      if (params.year) queryParams.append('year', params.year);

      const res = await axios.get(`${API_URL}/files/search?${queryParams.toString()}`);
      setSearchResults(res.data);
      return res.data;
    } catch (err) {
      console.error('Error searching files', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <StorageContext.Provider value={{
      wings,
      folders,
      files,
      currentFolder,
      currentPath,
      loading,
      activeUploads,
      searchResults,
      setCurrentFolder,
      fetchWings,
      fetchDirectory,
      createFolder,
      deleteFolder,
      uploadFiles,
      deleteFiles,
      searchFiles
    }}>
      {children}
    </StorageContext.Provider>
  );
};
