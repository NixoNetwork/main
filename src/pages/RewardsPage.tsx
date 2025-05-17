import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Shield, QrCode, AlertCircle, X } from 'lucide-react';
import { getRewardPoints, addRewardPoints } from '../utils/api';

const RewardsPage = () => {
  const [points, setPoints] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [qrScanner, setQrScanner] = useState<Html5Qrcode | null>(null);
  const [scannerMessage, setScannerMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | ''>('');
  const [isProcessingScan, setIsProcessingScan] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const pointsRef = useRef(points);
  const processedQRCodes = useRef<Set<string>>(new Set());
  const isProcessingRef = useRef(false);
  
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    const fetchRewardPoints = async () => {
      try {
        const response = await getRewardPoints();
        if (response.success) {
          setPoints(response.rewardPoints);
        }
      } catch (error) {
        console.error('Error fetching reward points:', error);
        const storedPoints = localStorage.getItem('rewardPoints');
        if (storedPoints) {
          setPoints(parseInt(storedPoints));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRewardPoints();
    
    return () => {
      if (qrScanner) {
        qrScanner.stop().catch(err => console.error("Error stopping scanner on unmount:", err));
      }
    };
  }, []);

  const startScanner = () => {
    setScanning(true);
    setScannerMessage('Scanner started. Point your camera at a QR code.');
    setMessageType('info');
    setIsProcessingScan(false);
    isProcessingRef.current = false;

    try {
      const scanner = new Html5Qrcode("qr-reader");
      setQrScanner(scanner);
      
      const container = document.getElementById("qr-reader");
      const containerWidth = container?.clientWidth || 300;
      const containerHeight = container?.clientHeight || 300;
      
      const smallerDimension = Math.min(containerWidth, containerHeight);
      const qrboxSize = Math.floor(smallerDimension * 0.7);
      
      scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: qrboxSize, height: qrboxSize }
        },
        async (decodedText) => {
          if (isProcessingRef.current) return;
          
          if (processedQRCodes.current.has(decodedText)) {
            setScannerMessage(`Already scanned this QR code!`);
            setMessageType('info');
            return;
          }
          
          isProcessingRef.current = true;
          setIsProcessingScan(true);
          
          processedQRCodes.current.add(decodedText);
          
          setScannerMessage(`Success! Scanned: ${decodedText}`);
          setMessageType('success');
          
          try {
            const response = await addRewardPoints(10, 'QR Code Scan', {
              qrCodeContent: decodedText,
              scannedAt: new Date().toISOString()
            });
            
            if (response.success) {
              setPoints(response.rewardPoints);
              localStorage.setItem('rewardPoints', response.rewardPoints.toString());
            } else {
              throw new Error('Failed to add reward points');
            }
          } catch (error) {
            console.error('Error adding reward points:', error);
            const newPoints = pointsRef.current + 10;
            setPoints(newPoints);
            localStorage.setItem('rewardPoints', newPoints.toString());
          }
          
          stopScanner();
          
          if (decodedText.startsWith('http://') || decodedText.startsWith('https://')) {
            setTimeout(() => {
              window.location.href = decodedText;
            }, 1500);
          }
        },
        (error) => {
        }
      ).catch((err) => {
        setScannerMessage(`Error starting scanner: ${err.toString()}`);
        setMessageType('error');
        setScanning(false);
        isProcessingRef.current = false;
      });
    } catch (error) {
      setScannerMessage(`Failed to initialize scanner: ${error instanceof Error ? error.message : String(error)}`);
      setMessageType('error');
      setScanning(false);
      isProcessingRef.current = false;
    }
  };

  const stopScanner = () => {
    if (qrScanner) {
      qrScanner.stop().then(() => {
        qrScanner.clear();
        setQrScanner(null);
        setScanning(false);
        setIsProcessingScan(false);
      }).catch((err) => {
        setScannerMessage(`Error stopping scanner: ${err.toString()}`);
        setMessageType('error');
        setScanning(false);
        setQrScanner(null);
        setIsProcessingScan(false);
      });
    }
  };

  const dismissMessage = () => {
    setScannerMessage('');
    setMessageType('');
  };

  return (
    <div className="container px-4 mx-auto max-w-4xl py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center">
        <Shield className="mr-2 text-nixo-green" size={32} /> Reward System
      </h1>
      
      <div className="bg-gradient-to-r from-nixo-green/20 to-space-black border border-nixo-green/30 rounded-lg p-6 mb-8 shadow-lg shadow-nixo-green/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">🎉 Your Rewards</h2>
            <p className="text-3xl font-bold text-nixo-green mt-2">{points} Points</p>
          </div>
          <div className="bg-nixo-green/20 p-4 rounded-full">
            <QrCode className="h-12 w-12 text-nixo-green" />
          </div>
        </div>
      </div>
      
      <div className="bg-space-black/70 border border-nixo-green/30 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-2">Scan QR Code</h2>
        <p className="text-gray-400 mb-4">Scan a QR code on a Nixo product to earn 10 reward points.</p>
        
        {messageType && (
          <div className={`mb-4 p-3 rounded-md flex items-center justify-between
            ${messageType === 'success' ? 'bg-green-900/40 text-green-300 border border-green-700' : 
              messageType === 'error' ? 'bg-red-900/40 text-red-300 border border-red-700' : 
                'bg-blue-900/40 text-blue-300 border border-blue-700'}`}>
            <div className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              <span>{scannerMessage}</span>
            </div>
            <button onClick={dismissMessage} className="text-gray-300 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        <div className="relative mb-4" style={{ height: scanning ? '500px' : '0px', transition: 'height 0.3s ease' }}>
          <div 
            id="qr-reader" 
            style={{ 
              width: '100%', 
              height: '100%',
              display: scanning ? 'block' : 'none',
              position: 'relative',
              backgroundColor: '#000'
            }} 
            className="border border-nixo-green/30 rounded-lg overflow-hidden"
          />
        </div>
        
        <style>
          {`
            #qr-reader video {
              width: 100% !important;
              height: 100% !important;
              object-fit: cover !important;
            }
            #qr-reader__dashboard_section_csr button {
              border-radius: 0.5rem;
              padding: 0.5rem 1rem;
              background-color: #3CCD3A;
              color: black;
            }
            #qr-reader__dashboard_section_csr {
              text-align: center;
            }
            #qr-reader__scan_region {
              background: rgba(0,0,0,0.5);
            }
          `}
        </style>
        
        <div className="flex flex-col space-y-3">
          {!scanning ? (
            <button 
              onClick={startScanner}
              className="w-full bg-nixo-green hover:bg-nixo-green/80 text-black font-semibold py-3 px-4 rounded-lg transition duration-200">
              Start Scanner
            </button>
          ) : (
            <button 
              onClick={stopScanner}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
              Stop Scanner
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;