import React, { useState } from 'react';
import { Camera, Shield, Download, Check, X, RefreshCw } from 'lucide-react';

export default function DemoApp() {
  const [activeTab, setActiveTab] = useState('totp');
  const [totpCode, setTotpCode] = useState('123456');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<boolean | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);

  const handleValidateCode = () => {
    setIsValidating(true);
    setTimeout(() => {
      // For demonstration, let's assume the valid code is '123456'
      setValidationResult(totpCode === '123456');
      setIsValidating(false);
    }, 1000);
  };

  const handleCapturePhoto = () => {
    const newPhoto = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' // Placeholder
    };
    setCapturedPhotos(prev => [...prev, newPhoto]);
  };

  const downloadJSON = () => {
    const data = JSON.stringify(capturedPhotos, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'captured-photos.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Security Demo App
          </h1>
          <p className="text-gray-600 mt-1">TOTP Authentication & Photo Capture</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          {[
            { id: 'totp', label: 'Authenticator', icon: Shield },
            { id: 'camera', label: 'Camera', icon: Camera }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        {activeTab === 'totp' && (
          <div className="animate-in fade-in-50 duration-300">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* QR Code Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Shield className="text-indigo-600" size={24} />
                  Scan QR Code
                </h2>
                <div className="bg-gray-50 rounded-xl p-8 mb-6 flex items-center justify-center">
                  <div className="w-48 h-48 bg-white rounded-lg shadow-sm flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center text-gray-500">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-3 animate-pulse"></div>
                      <p className="text-sm">QR Code will appear here</p>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                  <RefreshCw size={18} />
                  Generate New QR
                </button>
              </div>

              {/* Validation Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Enter Code</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      6-digit code from your authenticator app
                    </label>
                    <input
                      type="text"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="w-full px-4 py-3 text-center text-2xl font-mono bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      maxLength={6}
                    />
                  </div>
                  
                  <button
                    onClick={handleValidateCode}
                    disabled={totpCode.length !== 6 || isValidating}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isValidating ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Validate Code
                      </>
                    )}
                  </button>

                  {/* Validation Result */}
                  {validationResult !== null && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in-50 duration-300 ${
                      validationResult ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {validationResult ? <Check size={20} /> : <X size={20} />}
                      <span className="font-medium">
                        {validationResult ? 'Code is valid!' : 'Invalid code. Try again.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'camera' && (
          <div className="animate-in fade-in-50 duration-300">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Camera Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Camera className="text-purple-600" size={24} />
                  Camera Preview
                </h2>
                <div className="bg-gray-100 rounded-xl aspect-video mb-6 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Camera size={48} className="mx-auto mb-3 text-gray-400" />
                    <p>Camera feed will appear here</p>
                    <p className="text-sm mt-1">Click "Start Camera" to begin</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200">
                    Start Camera
                  </button>
                  <button
                    onClick={handleCapturePhoto}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200"
                  >
                    Capture Photo
                  </button>
                </div>
              </div>

              {/* Gallery Section */}
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
                        <div className="w-12 h-12 bg-purple-200 rounded-lg flex-shrink-0"></div>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}