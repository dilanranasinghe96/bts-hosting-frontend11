import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import jsQR from "jsqr";
import React, { useCallback, useRef, useState } from "react";
import { Camera, X, QrCode, RefreshCw } from "lucide-react";

const QRCodeScanner = ({ onScanComplete, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const startScanner = async () => {
    setLoading(true);
    setError(null);
    try {
      const constraints = {
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true); // important for iOS
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            resolve();
          };
        });
        
        await videoRef.current.play();
        setIsScanning(true);
        scanQRCode();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Camera access denied. Please enable camera permissions and ensure no other app is using the camera.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseScanner = () => {
    stopCamera();
    onClose();
  };

  const scanQRCode = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        const scannedBNumber = code.data;
        console.log("Scanned BNumber:", scannedBNumber);
        onScanComplete(scannedBNumber);
        stopCamera(); // Stop camera immediately after scanning
        return;
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(scanQRCode);
  }, [onScanComplete, stopCamera]);

  // Start camera automatically when component mounts
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]); // Empty dependency array means this runs once on mount

  // Add a retry button functionality
  const handleRetry = () => {
    stopCamera();
    startScanner();
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
         style={{ 
           zIndex: 1050,
           backgroundColor: 'rgba(0, 0, 0, 0.85)'
         }}>
      <div className="container px-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-0 shadow-lg">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                <div className="d-flex align-items-center">
                  <QrCode size={24} className="me-2" />
                  <h5 className="mb-0">QR Code Scanner</h5>
                </div>
                <button 
                  className="btn btn-link text-white p-0" 
                  onClick={handleCloseScanner}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="card-body p-4">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                    <X size={20} className="me-2" />
                    <div>
                      {error}
                      <button 
                        className="btn btn-link text-danger p-0 ms-2" 
                        onClick={handleRetry}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}

                <div className="position-relative mb-4" style={{ minHeight: "300px" }}>
                  {loading && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-light d-flex flex-column justify-content-center align-items-center rounded">
                      <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-muted mb-0">Initializing camera...</p>
                    </div>
                  )}
                  
                  <video
                    ref={videoRef}
                    className="w-100 h-100 rounded"
                    style={{ 
                      objectFit: "cover",
                      display: isScanning ? "block" : "none",
                      minHeight: "300px"
                    }}
                    playsInline
                  />

                  
                </div>

                <canvas ref={canvasRef} style={{ display: "none" }} />

                <div className="d-grid gap-2">
                  {!isScanning ? (
                    <button 
                      onClick={startScanner} 
                      className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={20} className="spinner-border spinner-border-sm" />
                          Initializing Camera...
                        </>
                      ) : (
                        <>
                          <Camera size={20} />
                          Start Scanner
                        </>
                      )}
                    </button>
                  ) : (
                    <button 
                      onClick={stopCamera} 
                      className="btn btn-danger btn-lg d-flex align-items-center justify-content-center gap-2"
                    >
                      <X size={20} />
                      Stop Scanner
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes scan {
            0% {
              top: 0;
            }
            50% {
              top: 100%;
            }
            100% {
              top: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default QRCodeScanner;
