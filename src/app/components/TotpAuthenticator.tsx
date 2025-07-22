import React from 'react';
import { Shield, RefreshCw, Check, X, Download } from 'lucide-react';

interface TotpAuthenticatorProps {
  secret: string;
  qrCodeUrl: string;
  isGenerating: boolean;
  totpCode: string;
  setTotpCode: (code: string) => void;
  handleValidateCode: () => void;
  isValidating: boolean;
  validationResult: boolean | null;
  generateTOTP: () => void;
  deviceInfo?: any;
  showDeviceInfo?: boolean;
  setShowDeviceInfo: (stat: boolean) => void;
}

export function TotpAuthenticator({
  secret,
  qrCodeUrl,
  isGenerating,
  totpCode,
  setTotpCode,
  handleValidateCode,
  isValidating,
  validationResult,
  generateTOTP,
  deviceInfo,
  showDeviceInfo,
  setShowDeviceInfo
}: TotpAuthenticatorProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* QR Code Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Shield className="text-indigo-600" size={24} />
          Scan QR Code
        </h2>
        <div className="bg-gray-50 rounded-xl p-8 mb-6 flex items-center justify-center">
          <div className="w-48 h-48 bg-white rounded-lg shadow-sm flex items-center justify-center border-2 border-dashed border-gray-300">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="TOTP QR Code" 
                className="w-44 h-44 rounded-lg"
              />
            ) : (
              <div className="text-center text-gray-500">
                <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-3 animate-pulse"></div>
                <p className="text-sm">Generating QR Code...</p>
              </div>
            )}
          </div>
        </div>
        <button 
          onClick={generateTOTP}
          disabled={isGenerating}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw size={18} />
              Generate New QR
            </>
          )}
        </button>
      </div>

      {/* Validation Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Enter Code</h2>
        <div className="space-y-6">
          {secret && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Secret Key:</strong>
              </p>
              <code className="text-xs font-mono bg-blue-100 px-2 py-1 rounded break-all">
                {secret}
              </code>
              <p className="text-xs text-blue-600 mt-2">
                This is shown for demo purposes only.
              </p>
            </div>
          )}
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
          {/* Device Info Display */}
          {showDeviceInfo && deviceInfo && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 animate-in fade-in-50 duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-green-800">Device Information</h3>
              <button 
                onClick={() => setShowDeviceInfo(false)}
                className="text-green-600 hover:text-green-800"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2 text-xs text-green-700">
              <div><strong>Platform:</strong> {deviceInfo.platform}</div>
              <div><strong>Screen:</strong> {deviceInfo.screen.width}x{deviceInfo.screen.height}</div>
              <div><strong>Timezone:</strong> {deviceInfo.timezone}</div>
              {deviceInfo.memory && <div><strong>Memory:</strong> {deviceInfo.memory}GB</div>}
              {deviceInfo.cores && <div><strong>CPU Cores:</strong> {deviceInfo.cores}</div>}
            </div>
            <button 
              onClick={() => {
                const data = JSON.stringify(deviceInfo, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'device-info.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center gap-1"
            >
              <Download size={14} />
              Download Device Info JSON
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
} 