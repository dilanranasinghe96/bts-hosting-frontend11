// import jsQR from "jsqr";
// import { Camera, RefreshCw, X } from "lucide-react";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { Alert } from "react-bootstrap";

// const ScannerWithForm = ({ onClose }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const animationFrameRef = useRef(null);
  
//   // Scanner states
//   const [isScanning, setIsScanning] = useState(false);
//   const [loading, setLoading] = useState(false);
  
//   // Form states
//   const [showForm, setShowForm] = useState(false);
//   const [item, setItem] = useState(null);
//   const [bNumber, setBNumber] = useState(null);
//   const [damagePcs, setDamagePcs] = useState(0);
//   const [cutPanelShortage, setCutPanelShortage] = useState(0);
//   const [goodPcs, setGoodPcs] = useState(0);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [showSuccessAlert, setShowSuccessAlert] = useState(false);

//   const BASE_URL = process.env.REACT_APP_BASE_URL;
//   const user = JSON.parse(localStorage.getItem("user"));
//   const userPlant = user?.plant;

//   const stopCamera = useCallback(() => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject;
//       const tracks = stream.getTracks();
//       tracks.forEach(track => track.stop());
//       videoRef.current.srcObject = null;
//     }
//     if (animationFrameRef.current) {
//       cancelAnimationFrame(animationFrameRef.current);
//       animationFrameRef.current = null;
//     }
//     setIsScanning(false);
//   }, []);

//   const startScanner = async () => {
//     setLoading(true);
//     setErrorMessage(null);
//     try {
//       const constraints = {
//         video: { 
//           facingMode: "environment",
//           width: { ideal: 1280 },
//           height: { ideal: 720 }
//         }
//       };
      
//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.setAttribute("playsinline", true);
        
//         await new Promise((resolve) => {
//           videoRef.current.onloadedmetadata = () => {
//             resolve();
//           };
//         });
        
//         await videoRef.current.play();
//         setIsScanning(true);
//         scanQRCode();
//       }
//     } catch (err) {
//       console.error("Error accessing camera:", err);
//       setErrorMessage("Camera access denied. Please enable camera permissions and ensure no other app is using the camera.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const scanQRCode = useCallback(() => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
    
//     if (!video || !canvas) return;

//     const context = canvas.getContext("2d");
    
//     if (video.readyState === video.HAVE_ENOUGH_DATA) {
//       canvas.height = video.videoHeight;
//       canvas.width = video.videoWidth;
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);

//       const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//       const code = jsQR(imageData.data, imageData.width, imageData.height);

//       if (code) {
//         const scannedBNumber = code.data;
//         console.log("Scanned BNumber:", scannedBNumber);
//         setBNumber(scannedBNumber);
//         stopCamera();
//         setShowForm(true);
//         fetchItemDetails(scannedBNumber);
//         return;
//       }
//     }
    
//     animationFrameRef.current = requestAnimationFrame(scanQRCode);
//     // eslint-disable-next-line
//   }, [stopCamera]);

//   const fetchItemDetails = (bNumber) => {
//     fetch(`${BASE_URL}/api/items/cut-out/${bNumber}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch item details");
//         }
//         return response.json();
//       })
//       .then((fetchedItem) => {
//         if (fetchedItem.Plant !== userPlant) {
//           setErrorMessage("You are not authorized to add this item. Plant mismatch.");
//           setTimeout(() => {
//             setErrorMessage("");
//             resetAndStartScanner();
//           }, 3000);
//         } else {
//           setItem(fetchedItem);
//           setGoodPcs(fetchedItem.Qty || 0);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching item details:", error);
//         setErrorMessage("Error fetching item details.");
//         setTimeout(() => {
//           setErrorMessage("");
//           resetAndStartScanner();
//         }, 3000);
//       });
//   };

//   useEffect(() => {
//     if (item) {
//       const goodPcs = item.Qty - damagePcs - cutPanelShortage;
//       setGoodPcs(goodPcs);
//     }
    
//   }, [item, damagePcs, cutPanelShortage]);

//   const handleSave = () => {
//     if (!item) {
//       setErrorMessage("Item data is not available.");
//       setTimeout(() => setErrorMessage(""), 3000);
//       return;
//     }

//     const newItem = {
//       bno: item.bno,
//       SO: item.SO,
//       Style: item.Style,
//       Style_Name: item.Style_Name,
//       Cut_No: item.Cut_No,
//       Colour: item.Colour,
//       Size: item.Size,
//       BQty: item.Qty,
//       Plant: item.Plant,
//       Line: item.Line,
//       Damage_Pcs: damagePcs,
//       Cut_Panel_Shortage: cutPanelShortage,
//       Good_Pcs: item.Qty - damagePcs - cutPanelShortage,
//       User: user.username,
//     };

//     fetch(`${BASE_URL}/api/items/addItem`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newItem),
//     })
//       .then(async (response) => {
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || "Failed to add item.");
//         }
//         return response.json();
//       })
//       .then(() => {
//         setShowSuccessAlert(true);
//         setTimeout(() => {
//           setShowSuccessAlert(false);
//           resetAndStartScanner();
//         }, 1500);
//       })
//       .catch((error) => {
//         setErrorMessage(error.message);
//         setTimeout(() => setErrorMessage(""), 3000);
//       });
//   };

//   const resetAndStartScanner = () => {
//     setShowForm(false);
//     setBNumber(null);
//     setItem(null);
//     setDamagePcs(0);
//     setCutPanelShortage(0);
//     setGoodPcs(0);
//     startScanner();
//   };

//   const handleClose = useCallback(() => {
//     stopCamera();
//     onClose();
//   }, [onClose,stopCamera]);
  



//   // Click outside handler
//   const modalRef = React.useRef();
//   React.useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (modalRef.current && !modalRef.current.contains(e.target)) {
//         handleClose();
//       }
//     };

//     window.addEventListener("mousedown", handleClickOutside);
//     return () => window.removeEventListener("mousedown", handleClickOutside);
//   }, [handleClose]);

//   // Start scanner on mount
//   React.useEffect(() => {
//     if (!showForm) {
//       startScanner();
//     }
//     return () => {
//       stopCamera();
//     };
//     // eslint-disable-next-line
//   }, [stopCamera, showForm]);

//   return (
//     <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center" style={{ zIndex: 1050,backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
//       <div ref={modalRef} className="bg-white p-4 rounded shadow-lg" style={{ width: "90%", maxWidth: "800px", maxHeight: "90vh", overflow: "auto" }}>
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h2 className="mb-0">{showForm ? "Add Item" : "QR Code Scanner"}</h2>
//           <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
//         </div>

//         {errorMessage && (
//           <div className="alert alert-danger mb-3">
//             {errorMessage}
//           </div>
//         )}

//         {!showForm ? (
//           // Scanner UI
//           <>
//             <div className="position-relative mb-4" style={{ minHeight: "300px" }}>
//               {loading && (
//                 <div className="position-absolute top-0 start-0 w-100 h-100 bg-light d-flex flex-column justify-content-center align-items-center rounded">
//                   <div className="spinner-border text-primary mb-3" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                   </div>
//                   <p className="text-muted mb-0">Initializing camera...</p>
//                 </div>
//               )}
              
//               <video
//                 ref={videoRef}
//                 className="w-100 h-100 rounded"
//                 style={{ 
//                   objectFit: "cover",
//                   display: isScanning ? "block" : "none",
//                   minHeight: "300px"
//                 }}
//                 playsInline
//               />
//             </div>

//             <canvas ref={canvasRef} style={{ display: "none" }} />

//             <div className="d-grid gap-2">
//               {!isScanning ? (
//                 <button 
//                   onClick={startScanner} 
//                   className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <RefreshCw size={20} className="spinner-border spinner-border-sm" />
//                       Initializing Camera...
//                     </>
//                   ) : (
//                     <>
//                       <Camera size={20} />
//                       Start Scanner
//                     </>
//                   )}
//                 </button>
//               ) : (
//                 <button 
//                   onClick={stopCamera} 
//                   className="btn btn-danger btn-lg d-flex align-items-center justify-content-center gap-2"
//                 >
//                   <X size={20} />
//                   Stop Scanner
//                 </button>
//               )}
//             </div>
//           </>
//         ) : (
//           // Form UI
//           <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
//             {item && (
//               <>
//                 <div className="col-md-6">
//                   <label className="form-label">BNumber*</label>
//                   <input type="text" className="form-control" value={item.bno} readOnly />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label">SO Number*</label>
//                   <input type="text" className="form-control" value={item.SO} readOnly />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label">Style*</label>
//                   <input type="text" className="form-control" value={item.Style} readOnly />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label">Style Name*</label>
//                   <input type="text" className="form-control" value={item.Style_Name} readOnly />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">Cut No*</label>
//                   <input type="text" className="form-control" value={item.Cut_No} readOnly />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">Colour*</label>
//                   <input type="text" className="form-control" value={item.Colour} readOnly />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">Size*</label>
//                   <input type="text" className="form-control" value={item.Size} readOnly />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">Plant*</label>
//                   <input type="text" className="form-control" value={item.Plant} readOnly />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">Bundle Quantity*</label>
//                   <input type="number" className="form-control" value={item.Qty} readOnly />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">Damage Pieces</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     value={damagePcs}
//                     onChange={(e) => setDamagePcs(parseInt(e.target.value) || 0)}
//                     min="0"
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">Cut Panel Shortage</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     value={cutPanelShortage}
//                     onChange={(e) => setCutPanelShortage(parseInt(e.target.value) || 0)}
//                     min="0"
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">Good Pieces</label>
//                   <input type="number" className="form-control" value={goodPcs} readOnly />
//                 </div>
//                 <div className="d-flex justify-content-end gap-2 mt-4">
//                   <button className="btn btn-success px-4" onClick={handleSave}>
//                     Save
//                   </button>
//                   <button className="btn btn-secondary px-4" onClick={handleClose}>
//                     Close
//                   </button>
//                 </div>
//               </>
//             )}
//           </form>
//         )}
//       </div>

//       {/* Confirmation Modal */}
     

//       {/* Success Alert */}
//       <Alert 
//         show={showSuccessAlert} 
//         variant="success" 
//         className="position-absolute top-50 start-50 translate-middle"
//       >
//         Item successfully added.
//       </Alert>

//       {/* Scanner animation style */}
//       <style>
//         {`
//           @keyframes scan {
//             0% {
//               top: 0;
//             }
//             50% {
//               top: 100%;
//             }
//             100% {
//               top: 0;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default ScannerWithForm;


import jsQR from "jsqr";
import { Camera, RefreshCw, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-bootstrap";

const ScannerWithForm = ({ onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Scanner states
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [item, setItem] = useState(null);
  const [bNumber, setBNumber] = useState(null);
  const [damagePcs, setDamagePcs] = useState(0);
  const [cutPanelShortage, setCutPanelShortage] = useState(0);
  const [goodPcs, setGoodPcs] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const userPlant = user?.plant;

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
    setErrorMessage(null);
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
        videoRef.current.setAttribute("playsinline", true);
        
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
      setErrorMessage("Camera access denied. Please enable camera permissions and ensure no other app is using the camera.");
    } finally {
      setLoading(false);
    }
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
        setBNumber(scannedBNumber);
        stopCamera();
        setShowForm(true);
        fetchItemDetails(scannedBNumber);
        return;
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(scanQRCode);
    // eslint-disable-next-line
  }, [stopCamera]);

  const fetchItemDetails = (bNumber) => {
    fetch(`${BASE_URL}/api/items/cut-out/${bNumber}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch item details");
        }
        return response.json();
      })
      .then((fetchedItem) => {
        if (fetchedItem.Plant !== userPlant) {
          setErrorMessage("You are not authorized to add this item. Plant mismatch.");
          setTimeout(() => {
            setErrorMessage("");
            resetAndStartScanner();
          }, 3000);
        } else {
          setItem(fetchedItem);
          setGoodPcs(fetchedItem.Qty || 0);
        }
      })
      .catch((error) => {
        console.error("Error fetching item details:", error);
        setErrorMessage("Error fetching item details.");
        setTimeout(() => {
          setErrorMessage("");
          resetAndStartScanner();
        }, 3000);
      });
  };

  useEffect(() => {
    if (item) {
      const goodPcs = item.Qty - damagePcs - cutPanelShortage;
      setGoodPcs(goodPcs);
    }
    
  }, [item, damagePcs, cutPanelShortage]);

  const handleSave = () => {
    if (!item) {
      setErrorMessage("Item data is not available.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const newItem = {
      bno: item.bno,
      SO: item.SO,
      Style: item.Style,
      Style_Name: item.Style_Name,
      Cut_No: item.Cut_No,
      Colour: item.Colour,
      Size: item.Size,
      BQty: item.Qty,
      Plant: item.Plant,
      Line: item.Line,
      Damage_Pcs: damagePcs,
      Cut_Panel_Shortage: cutPanelShortage,
      Good_Pcs: item.Qty - damagePcs - cutPanelShortage,
      User: user.username,
    };

    fetch(`${BASE_URL}/api/items/addItem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to add item.");
        }
        return response.json();
      })
      .then(() => {
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
          resetAndStartScanner();
        }, 1500);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setTimeout(() => setErrorMessage(""), 3000);
      });
  };

  const resetAndStartScanner = () => {
    setShowForm(false);
    setBNumber(null);
    setItem(null);
    setDamagePcs(0);
    setCutPanelShortage(0);
    setGoodPcs(0);
    startScanner();
  };

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [onClose, stopCamera]);
  
  // Click outside handler
  const modalRef = React.useRef();
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [handleClose]);

  // Start scanner on mount
  React.useEffect(() => {
    if (!showForm) {
      startScanner();
    }
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line
  }, [stopCamera, showForm]);

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center" style={{ zIndex: 1050, backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
      <div ref={modalRef} className="bg-white p-3 p-md-4 rounded shadow-lg" style={{ width: "95%", maxWidth: "700px", maxHeight: "90vh", overflow: "auto" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">{showForm ? "Add Item" : "QR Code Scanner"}</h4>
          <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
        </div>

        {errorMessage && (
          <div className="alert alert-danger mb-3 py-2">
            {errorMessage}
          </div>
        )}

        {!showForm ? (
          // Scanner UI
          <>
            <div className="position-relative mb-3" style={{ 
              height: "0", 
              paddingBottom: "75%", // 4:3 aspect ratio
              maxHeight: "400px",
              background: "#f8f9fa",
              overflow: "hidden",
              borderRadius: "8px"
            }}>
              {loading && (
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-light d-flex flex-column justify-content-center align-items-center rounded">
                  <div className="spinner-border text-primary mb-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mb-0 small">Initializing camera...</p>
                </div>
              )}
              
              <video
                ref={videoRef}
                className="position-absolute top-0 start-0 w-100 h-100 rounded"
                style={{ 
                  objectFit: "cover",
                  display: isScanning ? "block" : "none",
                }}
                playsInline
              />
              
              {/* Scanner animation */}
              {isScanning && !loading && (
                <div className="position-absolute w-100" style={{ 
                  height: "2px", 
                  background: "rgba(255, 0, 0, 0.7)",
                  boxShadow: "0 0 8px rgba(255, 0, 0, 0.8)",
                  animation: "scan 2s infinite linear",
                  zIndex: 2
                }}></div>
              )}
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />

            <div className="d-grid gap-2">
              {!isScanning ? (
                <button 
                  onClick={startScanner} 
                  className="btn btn-primary btn-md d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={18} className="spinner-border spinner-border-sm" />
                      Initializing Camera...
                    </>
                  ) : (
                    <>
                      <Camera size={18} />
                      Start Scanner
                    </>
                  )}
                </button>
              ) : (
                <button 
                  onClick={stopCamera} 
                  className="btn btn-danger btn-md d-flex align-items-center justify-content-center gap-2"
                >
                  <X size={18} />
                  Stop Scanner
                </button>
              )}
            </div>
          </>
        ) : (
          // Form UI
          <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
            {item && (
              <>
                <div className="col-md-6">
                  <label className="form-label small">BNumber*</label>
                  <input type="text" className="form-control form-control-sm" value={item.bno} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">SO Number*</label>
                  <input type="text" className="form-control form-control-sm" value={item.SO} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Style*</label>
                  <input type="text" className="form-control form-control-sm" value={item.Style} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Style Name*</label>
                  <input type="text" className="form-control form-control-sm" value={item.Style_Name} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Cut No*</label>
                  <input type="text" className="form-control form-control-sm" value={item.Cut_No} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Colour*</label>
                  <input type="text" className="form-control form-control-sm" value={item.Colour} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Size*</label>
                  <input type="text" className="form-control form-control-sm" value={item.Size} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Plant*</label>
                  <input type="text" className="form-control form-control-sm" value={item.Plant} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Bundle Quantity*</label>
                  <input type="number" className="form-control form-control-sm" value={item.Qty} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Damage Pieces</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={damagePcs}
                    onChange={(e) => setDamagePcs(parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Cut Panel Shortage</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={cutPanelShortage}
                    onChange={(e) => setCutPanelShortage(parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Good Pieces</label>
                  <input type="number" className="form-control form-control-sm" value={goodPcs} readOnly />
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button className="btn btn-success px-3 btn-sm" onClick={handleSave}>
                    Save
                  </button>
                  <button className="btn btn-secondary px-3 btn-sm" onClick={handleClose}>
                    Close
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>

      {/* Success Alert */}
      <Alert 
        show={showSuccessAlert} 
        variant="success" 
        className="position-absolute top-50 start-50 translate-middle p-2 px-4"
      >
        Item successfully added.
      </Alert>

      {/* Scanner animation style */}
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

export default ScannerWithForm;