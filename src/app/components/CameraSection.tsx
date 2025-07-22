import React, { RefObject, useRef, useState } from 'react';
import { Camera, CheckCircle } from 'lucide-react';

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
  const [flash, setFlash] = useState(false);
  const [showCaptured, setShowCaptured] = useState(false);
  const flashTimeout = useRef<NodeJS.Timeout | null>(null);
  const capturedTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleCapturePhoto = () => {
    setFlash(true);
    setShowCaptured(true);
    capturePhoto();
    // Flash effect for 200ms
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    flashTimeout.current = setTimeout(() => setFlash(false), 200);
    // Show "Captured!" for 1s
    if (capturedTimeout.current) clearTimeout(capturedTimeout.current);
    capturedTimeout.current = setTimeout(() => setShowCaptured(false), 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Camera className="text-purple-600" size={24} />
        Camera Preview
      </h2>
      <div className="relative bg-gray-100 rounded-xl aspect-video mb-6 flex items-center justify-center overflow-hidden">
        {isCameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-xl"
            />
            {/* Flash overlay */}
            {flash && (
              <div className="absolute inset-0 bg-white bg-opacity-80 animate-fade-out pointer-events-none rounded-xl" style={{ animationDuration: '200ms' }} />
            )}
            {/* Captured feedback */}
            {showCaptured && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center">
                  <CheckCircle className="text-green-500 mb-2" size={48} />
                  <span className="text-lg font-semibold text-green-700 bg-white/80 px-4 py-2 rounded-xl shadow">
                    Captured!
                  </span>
                </div>
              </div>
            )}
          </>
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
          onClick={handleCapturePhoto}
          disabled={!isCameraActive}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200"
        >
          Capture Photo
        </button>
      </div>
      {/* Fade-out animation for flash */}
      <style jsx>{`
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-fade-out {
          animation: fade-out 0.2s forwards;
        }
      `}</style>
    </div>
  );
} 