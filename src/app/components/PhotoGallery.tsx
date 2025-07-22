import React from 'react';
import { Camera, Download } from 'lucide-react';

interface Photo {
  id: number;
  timestamp: string;
  data: string;
}

interface PhotoGalleryProps {
  capturedPhotos: Photo[];
  downloadJSON: () => void;
}

export function PhotoGallery({ capturedPhotos, downloadJSON }: PhotoGalleryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Gallery</h2>
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          {capturedPhotos.length} photos
        </span>
      </div>
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {capturedPhotos.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Camera size={32} className="mx-auto mb-2 text-gray-400" />
            <p>No photos captured yet</p>
          </div>
        ) : (
          capturedPhotos.map((photo) => (
            <div key={photo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <img 
                src={photo.data} 
                alt={`Captured photo ${photo.id}`}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Photo {photo.id}
                </p>
                <p className="text-xs text-gray-500">{photo.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <button
        onClick={downloadJSON}
        disabled={capturedPhotos.length === 0}
        className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <Download size={18} />
        Download JSON
      </button>
    </div>
  );
} 