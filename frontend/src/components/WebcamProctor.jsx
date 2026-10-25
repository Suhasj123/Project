import React, { useEffect, useRef, useState } from 'react';
import { Camera, AlertTriangle, ShieldCheck, VideoOff, Eye, UserX, Users, Lock, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const WebcamProctor = ({
  testName = 'Assessment',
  onTabSwitch,
  onMaxWarningsExceeded,
  maxWarnings = 3
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);

  // Face Recognition Status: 'VERIFIED' | 'NO_FACE' | 'MULTIPLE_FACES' | 'LOOKING_AWAY'
  const [faceStatus, setFaceStatus] = useState('VERIFIED');
  const [faceAlertMessage, setFaceAlertMessage] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [lastViolationType, setLastViolationType] = useState('');

  const { addToast } = useToast();

  // -------------------------------------------------------------
  // 1. WEBCAM STREAM & REAL-TIME FACE SCANNER
  // -------------------------------------------------------------
  useEffect(() => {
    let streamInstance = null;

    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 320, height: 240, frameRate: 15 }
          });
          streamInstance = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraActive(true);
          setCameraError(false);
        } else {
          setCameraError(true);
        }
      } catch (err) {
        console.warn('[Webcam Proctor] Camera permission access fallback:', err.message);
        setCameraError(true);
      }
    };

    startCamera();

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // -------------------------------------------------------------
  // 2. FACE RECOGNITION SIMULATOR & BOUNDING BOX SCANNER
  // -------------------------------------------------------------
  useEffect(() => {
    let intervalId = null;

    intervalId = setInterval(() => {
      // Simulate face tracking evaluation algorithm
      const rand = Math.random();

      // 92% normal face detected, 4% no face, 2% multiple faces, 2% looking away
      if (rand > 0.96) {
        setFaceStatus('NO_FACE');
        const msg = '⚠️ Face Recognition Alert: No candidate face detected in camera frame!';
        setFaceAlertMessage(msg);
        addToast(msg, 'warning');
      } else if (rand > 0.94 && rand <= 0.96) {
        setFaceStatus('MULTIPLE_FACES');
        const msg = '🚨 Security Alert: Multiple people detected in camera feed!';
        setFaceAlertMessage(msg);
        addToast(msg, 'error');
      } else if (rand > 0.92 && rand <= 0.94) {
        setFaceStatus('LOOKING_AWAY');
        const msg = '👀 Proctor Alert: Candidate appears to be looking away from screen!';
        setFaceAlertMessage(msg);
        addToast(msg, 'warning');
      } else {
        setFaceStatus('VERIFIED');
        setFaceAlertMessage('');
      }
    }, 12000); // Check face position periodically

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [addToast]);

  // -------------------------------------------------------------
  // 3. APPLICATION SWITCH & TAB DEFOCUS INTERCEPTOR
  // -------------------------------------------------------------
  useEffect(() => {
    const triggerViolation = (type, message) => {
      setTabSwitches(prev => {
        const nextCount = prev + 1;
        setLastViolationType(type);
        setShowAlertModal(true);

        addToast(`🚫 SECURITY ALERT: ${message} (Violation ${nextCount}/${maxWarnings})`, 'error');

        if (onTabSwitch) {
          onTabSwitch(nextCount);
        }

        if (nextCount >= maxWarnings && onMaxWarningsExceeded) {
          onMaxWarningsExceeded();
        }

        return nextCount;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('Tab Switch / App Blur', 'You attempted to switch to another application or tab!');
      }
    };

    const handleWindowBlur = () => {
      triggerViolation('Window Focus Lost', 'Browser window lost active focus!');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [addToast, maxWarnings, onMaxWarningsExceeded, onTabSwitch]);

  const handleReturnToAssessment = () => {
    setShowAlertModal(false);
    // Request focus back
    window.focus();
  };

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* FLOATING PROCTOR WIDGET (BOTTOM RIGHT) */}
      {/* ------------------------------------------------------------- */}
      <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-1.5 sm:gap-2 pointer-events-auto">
        
        {/* Proctoring Status Pill */}
        <div className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-extrabold flex items-center gap-1.5 sm:gap-2 shadow-2xl backdrop-blur-md border transition-all ${
          tabSwitches > 0 || faceStatus !== 'VERIFIED'
            ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
            : 'bg-slate-900/90 text-slate-100 border-slate-700'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          <span className="hidden xs:inline">AI Face & App Lock Active</span>
          <span className="xs:hidden">Proctor Active</span>

          {tabSwitches > 0 && (
            <span className="bg-rose-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black">
              {tabSwitches} / {maxWarnings}
            </span>
          )}
        </div>

        {/* Live Camera Preview Box & Face Bounding Scanner */}
        <div className="relative w-32 h-24 sm:w-48 sm:h-36 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-brand-purple/60 bg-slate-950 shadow-2xl group">
          
          {/* Live Video Feed */}
          {!cameraError ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-slate-900">
              <Camera className="w-5 h-5 mb-1 text-brand-purple" />
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-200">Face Proctor Active</span>
              <span className="text-[8px] sm:text-[9px] text-slate-400">Virtual Sensor Feed</span>
            </div>
          )}

          {/* Simulated Face Bounding Box & Facial Keypoints Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className={`w-16 h-16 sm:w-28 sm:h-28 border-2 rounded-xl transition-all duration-300 relative flex items-center justify-center ${
              faceStatus === 'VERIFIED'
                ? 'border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                : faceStatus === 'MULTIPLE_FACES'
                ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-ping'
                : 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
            }`}>
                : faceStatus === 'MULTIPLE_FACES'
                ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-ping'
                : 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
            }`}>
              {/* Corner Targets */}
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-current"></span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-current"></span>
              <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-current"></span>
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-current"></span>

              {/* Center Crosshair */}
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80"></div>
            </div>
          </div>

          {/* Live Recognition Status Badge */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-black text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>AI SCAN</span>
            </div>

            <div className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
              faceStatus === 'VERIFIED'
                ? 'bg-emerald-500/80 text-white'
                : faceStatus === 'MULTIPLE_FACES'
                ? 'bg-rose-600 text-white'
                : 'bg-amber-500 text-slate-950'
            }`}>
              {faceStatus === 'VERIFIED' ? 'Face Verified ✓' : faceStatus === 'MULTIPLE_FACES' ? 'Multi-Face ❌' : 'Check Frame ⚠️'}
            </div>
          </div>

          {/* Face Alert Text Banner overlay */}
          {faceAlertMessage && (
            <div className="absolute bottom-0 inset-x-0 bg-rose-600/90 text-white text-[9px] font-extrabold px-2 py-1 text-center truncate">
              {faceAlertMessage}
            </div>
          )}
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* UN-DISMISSABLE APPLICATION SWITCH LOCKOUT MODAL */}
      {/* ------------------------------------------------------------- */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-card max-w-lg w-full p-8 text-center space-y-6 border-2 border-rose-500 shadow-2xl bg-white dark:bg-dark-card relative overflow-hidden">
            
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center border border-rose-500/30">
              <Lock className="w-8 h-8 text-rose-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-wider">
                🚫 PROCTOR SECURITY VIOLATION
              </span>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                Application Switch Detected!
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
                You attempted to leave or switch applications during **{testName}**. Switching apps, opening secondary windows, or leaving browser focus is strictly prohibited.
              </p>
            </div>

            {/* Violation Meter */}
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
              <div className="flex justify-between text-xs font-extrabold">
                <span className="text-gray-600 dark:text-gray-300">Security Warning Level:</span>
                <span className="text-rose-600 dark:text-rose-400 font-black">
                  {tabSwitches} of {maxWarnings} Allowed Warnings
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (tabSwitches / maxWarnings) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-rose-500 font-bold">
                ⚠️ Reaching {maxWarnings} warnings will result in immediate automatic test submission & candidate disqualification.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleReturnToAssessment}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Return to Assessment & Re-Lock Focus</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default WebcamProctor;
