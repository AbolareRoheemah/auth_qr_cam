"use client"
import React, { useState, useEffect, useRef } from 'react';
import { createTOTPSession, validateCode } from '@/utils/totp';
import { TabNavigation } from './components/TabNavigation';
import { TotpAuthenticator } from './components/TotpAuthenticator';
import { CameraSection } from './components/CameraSection';
import { PhotoGallery } from './components/PhotoGallery';
import { getDeviceInfo } from '../utils/deviceInfo';

export default function DemoApp() {
  const [activeTab, setActiveTab] = useState('totp');
  const [totpCode, setTotpCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<null | boolean>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [capturedPhotos, setCapturedPhotos] = useState<any[]>([]);
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [showDeviceInfo, setShowDeviceInfo] = useState(false);

  const handleValidateCode = async () => {
    if (!secret || totpCode.length !== 6) return;
    setIsValidating(true);
    setTimeout(async () => {
      const isValid = validateCode(secret);
      setValidationResult(isValid);
      if (isValid) {
        try {
          const info = await getDeviceInfo();
          setDeviceInfo(info);
          setShowDeviceInfo(true);
        } catch (error) {
          console.error('Error collecting device info:', error);
        }
      }
      setIsValidating(false);
    }, 500);
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

  const generateTOTP = async () => {
    setIsGenerating(true);
    try {
      const { secret: newSecret, qrCodeUrl: newQrUrl } = await createTOTPSession(
        'Auth Security App',
        'demo-user@example.com'
      );
      setSecret(newSecret);
      setQrCodeUrl(newQrUrl);
      setValidationResult(null);
      setTotpCode('');
    } catch (error) {
      console.error('Error generating TOTP:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateTOTP();
  }, []);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
    if (videoRef.current && !cameraStream) {
      videoRef.current.srcObject = null;
    }
  }, [cameraStream]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setCameraStream(stream);
      setIsCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied or not available');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      setCameraStream(null);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      const newPhoto = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        data: imageData
      };
      setCapturedPhotos(prev => [...prev, newPhoto]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Auth Demo App
          </h1>
          <p className="text-gray-600 mt-1">TOTP Authentication & Photo Capture</p>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        {activeTab === 'totp' && (
          <TotpAuthenticator
            secret={secret}
            qrCodeUrl={qrCodeUrl}
            isGenerating={isGenerating}
            totpCode={totpCode}
            setTotpCode={setTotpCode}
            handleValidateCode={handleValidateCode}
            isValidating={isValidating}
            validationResult={validationResult}
            generateTOTP={generateTOTP}
            deviceInfo={deviceInfo}
            showDeviceInfo={showDeviceInfo}
            setShowDeviceInfo={setShowDeviceInfo}
          />
        )}
        {activeTab === 'camera' && (
          <div className="animate-in fade-in-50 duration-300 grid lg:grid-cols-2 gap-8">
            <CameraSection
              isCameraActive={isCameraActive}
              startCamera={startCamera}
              stopCamera={stopCamera}
              capturePhoto={capturePhoto}
              videoRef={videoRef}
            />
            <PhotoGallery
              capturedPhotos={capturedPhotos}
              downloadJSON={downloadJSON}
            />
          </div>
        )}
      </div>
    </div>
  );
}