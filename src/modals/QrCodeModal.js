import React, { useRef } from 'react';
import QRCode from 'qrcode.react';
import Modal from 'react-modal';
import '../styles/QrCodeModal.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function QrCodeModal ({ isOpen, onRequestClose, qrCodeId }) {
    const qrCodeRef = useRef(null);

    const handleDownloadQRCode = () => {
      if (qrCodeRef.current) {
        const canvas = qrCodeRef.current.querySelector('canvas');
        if (canvas) {
          const qrCodeUrl = canvas.toDataURL('image/png');
          const image = new Image();
          image.src = qrCodeUrl;
  
          image.onload = () => {
            const newCanvas = document.createElement('canvas');
            const newCtx = newCanvas.getContext('2d');
  
            // Add padding and space for the text
            const padding = 20;
            const text = 'Generated from AttendEase';
            const textHeight = 30;
            const textMarginBottom = 10;
  
            newCanvas.width = image.width + padding * 2;
            newCanvas.height = image.height + padding * 2 + textHeight + textMarginBottom;
  
            // Draw background
            newCtx.fillStyle = '#FFFFFF'; // White background
            newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
  
            // Draw text background
            newCtx.fillStyle = '#FF6347'; // Tomato background
            newCtx.fillRect(0, padding, newCanvas.width, textHeight);
  
            // Draw text
            newCtx.font = 'bold 18px Arial';
            newCtx.fillStyle = '#FFFFFF'; // White color
            newCtx.textAlign = 'center';
            newCtx.textBaseline = 'middle';
            newCtx.fillText(text, newCanvas.width / 2, padding + textHeight / 2);
  
            // Draw QR code
            newCtx.drawImage(image, padding, padding + textHeight + textMarginBottom);
  
            // Create the QR code URL
            const newQrCodeUrl = newCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = newQrCodeUrl;
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };
        } else {
          console.error('QR code canvas not found');
        }
      } else {
        console.error('QR code ref is not set');
      }
    };

    return (
      <Modal
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          className="modal-content"
          overlayClassName="overlay"
          contentLabel="QR Code"
      >
          <div className="qr-container">
              <div className="qr-code-section">
                  <i className="fas fa-times cancel-icon" onClick={onRequestClose} />
                  <p>Students can now scan the QR code</p>
                  <div ref={qrCodeRef}>
                    <QRCode value={qrCodeId} size={200} className="qr-code" />
                  </div>
                  <button className="download-button" onClick={handleDownloadQRCode}>Download</button>
              </div>
          </div>
      </Modal>
  );
}

export default QrCodeModal;
