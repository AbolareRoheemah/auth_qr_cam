import React, { RefObject } from 'react';
import { Camera } from 'lucide-react';

interface CameraSectionProps {
  isCameraActive: boolean;
  startCamera: () => void;
  stopCamera: () => void;
  capturePhoto: () => void;
  videoRef: RefObject<HTMLVideoElement | null>;
}

export function CameraSection({
  isCameraActive,
  startCamera,
  stopCamera,
  capturePhoto,
  videoRef,
}: CameraSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Camera className="text-purple-600" size={24} />
        Camera Preview
      </h2>
      <div className="bg-gray-100 rounded-xl aspect-video mb-6 flex items-center justify-center overflow-hidden">
        {isCameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <div className="text-center text-gray-500">
            <Camera size={48} className="mx-auto mb-3 text-gray-400" />
            <p>Camera feed will appear here</p>
            <p className="text-sm mt-1">Click &quot;Start Camera&quot; to begin</p>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button 
          onClick={isCameraActive ? stopCamera : startCamera}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200"
        >
          {isCameraActive ? 'Stop Camera' : 'Start Camera'}
        </button>
        <button
          onClick={capturePhoto}
          disabled={!isCameraActive}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200"
        >
          Capture Photo
        </button>
      </div>
    </div>
  );
} 