import React from 'react';
import { Button } from 'react-bootstrap';
import { QRCodeCanvas } from 'qrcode.react';
const PrintableTags = ({ data }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Print Button */}
      <Button 
        onClick={handlePrint}
        className="position-absolute top-0 end-0 m-4 d-print-none"
        variant="primary"
      >
        Print Tags
      </Button>

      {/* Printable Area */}
      <div className="d-none d-print-block m-0">
        <div className="container-fluid">
          <div className="row row-cols-2 g-3">
            {data.map((item, index) => (
              <div key={index} className="col">
                <div className="card p-3 text-center">
                <QRCodeCanvas 
                    value={`${window.location.origin}/item/${item.Id}`}
                    size={90}
                    className="mx-auto mb-2"
                  />
                  <div className="small">
                    <p className="fw-bold mb-1">{item.Style_Name}</p>
                    <p className="mb-1">SO: {item.SO}</p>
                    <p className="mb-1">Cut No: {item.Cut_No}</p>
                    <p className="mb-1">Color: {item.Colour}</p>
                    <p className="mb-1">Size: {item.Size}</p>
                    <p className="mb-1">Qty: {item.Qty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .d-print-none {
              display: none !important;
            }
            .d-print-block {
              display: block !important;
            }
            @page {
              size: A4;
              margin: 10mm;
            }
            .card {
              break-inside: avoid;
              border: 1px solid #dee2e6;
            }
            .row {
              display: flex;
              flex-wrap: wrap;
            }
            .col {
              flex: 0 0 50%;
              max-width: 50%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PrintableTags;