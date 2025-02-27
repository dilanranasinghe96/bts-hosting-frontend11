// import { jsPDF } from 'jspdf';
// import React, { useEffect, useMemo, useState } from "react";
// import { Button, Col, Container, Form, Row } from 'react-bootstrap';
// import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
// import {
//    Printer,Filter
//   } from "lucide-react";

// const CutInTag = () => {
//   const [soList, setSoList] = useState([]);
//   const [cutNoList, setCutNoList] = useState([]);
//   const [selectedSO, setSelectedSO] = useState('');
//   const [selectedCutNo, setSelectedCutNo] = useState('');
//   const [data, setData] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     fetch('http://localhost:8081/api/so-list')
//       .then((response) => response.json())
//       .then((data) => setSoList(data))
//       .catch((error) => console.error('Error fetching SO list:', error));
//   }, []);

//   useEffect(() => {
//     if (selectedSO) {
//       fetch(`http://localhost:8081/api/cut-no-list?SO=${selectedSO}`)
//         .then((response) => response.json())
//         .then((data) => setCutNoList(data))
//         .catch((error) => console.error('Error fetching Cut_No list:', error));
//     }
//   }, [selectedSO]);

//   const handleGenerate = () => {
//     if (!selectedSO || !selectedCutNo) {
      
//       setErrorMessage("Please select both SO and Cut No");
//           setTimeout(() => setErrorMessage(""), 3000);
//       return;
//     }

//     fetch(`http://localhost:8081/api/items/cut-in?SO=${selectedSO}&Cut_No=${selectedCutNo}`)
//       .then((response) => response.json())
//       .then((data) => setData(data))
//       .catch((error) => console.error('Error fetching data:', error));
//   };


// const handleDownloadPDF = async () => {
//     const doc = new jsPDF('p', 'mm', [57.15, 57.15]); // Custom tag size (2.25 x 2.25 inches)

//     const tagWidth = 57.15;  // Tag width
//     const tagHeight = 57.15; // Tag height
//     const margin = 2;        // Margin around the tag
//     const qrSize = 25;       // QR Code size
//     const centerX = tagWidth / 2; // Center position for X-axis
//     const textStartY = qrSize + margin; // Text starts below QR

//     const loadImage = (url) => {
//         return new Promise((resolve, reject) => {
//             const img = new Image();
//             img.crossOrigin = 'Anonymous';
//             img.onload = () => {
//                 const canvas = document.createElement('canvas');
//                 canvas.width = img.width;
//                 canvas.height = img.height;
//                 const ctx = canvas.getContext('2d');
//                 ctx.drawImage(img, 0, 0);
//                 resolve(canvas.toDataURL('image/png'));
//             };
//             img.onerror = reject;
//             img.src = url;
//         });
//     };

//     for (let i = 0; i < data.length; i++) {
//         const item = data[i];

//         if (i > 0) doc.addPage(); // New page for each tag

//         try {
//             const qrDataUrl = await loadImage(item.qr_code);

//             // Draw a border around the tag
//             doc.setDrawColor(0); // Black border
//             doc.setLineWidth(0.1);
//             doc.rect(1, 1, tagWidth - 2, tagHeight - 2); // (x, y, width, height)

//             // Center QR Code horizontally
//             doc.addImage(qrDataUrl, 'PNG', centerX - qrSize / 2, margin, qrSize, qrSize);

//             // Set font and alignment for text
//             doc.setFontSize(5);
//             doc.setFont(undefined, 'normal');
//             doc.setTextColor(0, 0, 0);

//             let textY = textStartY;
//             const rowHeight = 4;
//             const col1X = 4;  // Left column start
//             const col2X = tagWidth / 3 ; // Right column start
//             // const colWidth = (tagWidth - 6) / 2; // Column width

//             // Define the table data
//             const tableData = [
//                 ['ID', item.bno],
//                 ['SO', item.SO],
//                 ['Cut No', item.Cut_No],
//                 ['Color', item.Colour],
//                 ['Size', item.Size],
//                 ['Qty', item.Qty],
//                 ['Style No', item.Style],
//                 ['Style', item.Style_Name],
//             ];

//             // Draw table borders and add text
//             tableData.forEach(([label, value], index) => {
//                 const rowY = textY + index * rowHeight;

//                 // Draw row border
//                 doc.rect(2, rowY - 3, tagWidth - 6, rowHeight);

//                 // Draw column separators
//                 doc.line(col2X - 1, rowY - 3, col2X - 1, rowY + rowHeight - 3);

//                 // Add text to table
//                 doc.text(label, col1X, rowY);
//                 doc.text(value.toString(), col2X, rowY);
//             });

//         } catch (error) {
//             console.error(`Error processing tag ${i}:`, error);
//         }
//     }

//     // Open PDF in new tab for preview
//     const pdfUrl = doc.output("bloburl");
//     window.open(pdfUrl, "_blank");
// };


//   const columns = useMemo(
//     () => [
//       { Header: 'ID', accessor: 'Id' },
//       { Header: 'SO', accessor: 'SO' },
//       { Header: 'Cut No', accessor: 'Cut_No' },
//       { Header: 'Colour', accessor: 'Colour' },
//       { Header: 'Size', accessor: 'Size' },
//       { Header: 'BQty', accessor: 'Qty' },
//       { Header: 'Style No', accessor: 'Style' },
//       { Header: 'Style', accessor: 'Style_Name' },
//     ],
//     []
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     page,
//     prepareRow,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     state: { pageIndex, pageSize },
//   } = useTable(
//     {
//       columns,
//       data: data,
//       initialState: { pageIndex: 0, pageSize: 10 },
//     },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );

//   return (
//     <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', padding: '20px 0' }}>
//       <Container>
//         <div className="d-flex justify-content-center align-items-center mb-4">
//           <h2 className="text-white ">Generate Tags</h2>
          
//         </div>
//         {errorMessage && (
//           <div className="alert alert-danger mb-3" style={{ maxWidth: '300px' }}>
//             {errorMessage}
//           </div>
//         )}

//         <div className="d-print-none">
//           <Row className="mb-4 align-items-center">
//             <Col md={12}>
//               <Form className="d-flex gap-3 align-items-center">
//                 <Form.Group>
//                   <Form.Label className="text-white me-2">Select SO:</Form.Label>
//                   <Form.Select value={selectedSO} onChange={(e) => setSelectedSO(e.target.value)}>
//                     <option value="">Select SO</option>
//                     {soList.map((so) => (
//                       <option key={so.SO} value={so.SO}>{so.SO}</option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>

//                 <Form.Group>
//                   <Form.Label className="text-white me-2">Select Cut No:</Form.Label>
//                   <Form.Select value={selectedCutNo} onChange={(e) => setSelectedCutNo(e.target.value)}>
//                     <option value="">Select Cut No</option>
//                     {cutNoList.map((cut) => (
//                       <option key={cut.Cut_No} value={cut.Cut_No}>{cut.Cut_No}</option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>

               
//               </Form>
//             </Col>
            
            
//           </Row>

//           <Button variant="primary" onClick={handleGenerate}>
//             <Filter size={20} className='me-2'/>
//                   Filter
//          </Button>

//              {data.length > 0 && (
//             <Button 
//               variant="success" 
//               onClick={handleDownloadPDF}
//               className="d-print-none m-2"
//             >
//                  <Printer size={20} className='me-2'/>
//               Print Tags
//             </Button>
//           )}
//         </div>

//         {/* Table and other content */}
//         <Container className="mt-4">
//           {/* Your table and other UI elements here */}
//           <div className="bg-white rounded shadow-lg p-4">        
//         <div className="table-responsive">
//   <table
//     {...getTableProps()}
//     className="table table-bordered table-striped table-hover"
//     style={{ tableLayout: "auto", width: "100%" }}
//   >
//     <thead className="table-dark text-center" >
//       {headerGroups.map((headerGroup) => (
//         <tr {...headerGroup.getHeaderGroupProps()}>
//           {headerGroup.headers.map((column) => (
//             <th
//               {...column.getHeaderProps(column.getSortByToggleProps())}
//               style={{
//                 cursor: "pointer",
//                 userSelect: "none",
//                 whiteSpace: "nowrap",
//                 minWidth: "max-content",
//               }}
//             >
//               {column.render("Header")}
//               <span>
//                 {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
//               </span>
//             </th>
//           ))}
//         </tr>
//       ))}
//     </thead>
//     <tbody {...getTableBodyProps()} className='text-center'>
//       {page.map((row) => {
//         prepareRow(row);
//         return (
//           <tr {...row.getRowProps()}>
//             {row.cells.map((cell) => (
//               <td
//                 {...cell.getCellProps()}
//                 style={{
//                   whiteSpace: "nowrap",
//                   minWidth: "max-content",
//                 }}
//               >
//                 {cell.column.id === "Date" ? (
//                   (() => {
//                     const originalDate = new Date(cell.value);
//                     originalDate.setDate(originalDate.getDate() + 1);
//                     return originalDate.toISOString().split("T")[0];
//                   })()
//                 ) : (
//                   cell.render("Cell")
//                 )}
//               </td>
//             ))}
//           </tr>
//         );
//       })}
//     </tbody>
//   </table>
// </div>

//         <div className="d-flex justify-content-between align-items-center mt-3">
//           <div>
//             <span>
//               Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
//             </span>
//             <select
//               value={pageSize}
//               onChange={e => setPageSize(Number(e.target.value))}
//               className="form-select d-inline-block w-auto ms-2"
//             >
//               {[10, 20, 30, 40, 50].map(size => (
//                 <option key={size} value={size}>Show {size}</option>
//               ))}
//             </select>
//           </div>

//           <div className="btn-group">
//             <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage} variant="outline-primary">{'<<'}</Button>
//             <Button onClick={() => previousPage()} disabled={!canPreviousPage} variant="outline-primary">Previous</Button>
//             <Button onClick={() => nextPage()} disabled={!canNextPage} variant="outline-primary">Next</Button>
//             <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} variant="outline-primary">{'>>'}</Button>
//           </div>
//         </div>
//       </div>
//         </Container>
//       </Container>
//     </div>
//   );
// };

// export default CutInTag;




import { jsPDF } from 'jspdf';
import {
  Filter,
  Printer
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';

const CutInTag = () => {
  const [soList, setSoList] = useState([]);
  const [cutNoList, setCutNoList] = useState([]);
  const [selectedSO, setSelectedSO] = useState('');
  const [selectedCutNo, setSelectedCutNo] = useState('');
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const BASE_URL = process.env.REACT_APP_BASE_URL;



  useEffect(() => {
    fetch(`${BASE_URL}/api/so-list`)
      .then((response) => response.json())
      .then((data) => setSoList(data))
      .catch((error) => console.error('Error fetching SO list:', error));
  }, [BASE_URL]);

  useEffect(() => {
    if (selectedSO) {
      fetch(`${BASE_URL}/api/cut-no-list?SO=${selectedSO}`)
        .then((response) => response.json())
        .then((data) => setCutNoList(data))
        .catch((error) => console.error('Error fetching Cut_No list:', error));
    }
  }, [selectedSO,BASE_URL]);

  const handleGenerate = async () => {
    if (!selectedSO || !selectedCutNo) {
        setErrorMessage("Please select both SO and Cut No");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
    }

    const printStatusResponse = await fetch(`${BASE_URL}/api/check-print-status?SO=${selectedSO}&Cut_No=${selectedCutNo}`);
    const printStatusData = await printStatusResponse.json();

    fetch(`${BASE_URL}/api/items/cut-in?SO=${selectedSO}&Cut_No=${selectedCutNo}`)
        .then((response) => response.json())
        .then((data) => {
            if (printStatusData.status === "printed") {
                // alert("This tag has already been printed.");
                // setPrintedMessage("This tag has already been printed.");
                // setTimeout(() => setPrintedMessage(""), 3000);
                setErrorMessage("This tag has already been printed.");
                setTimeout(() => setErrorMessage(""), 3000);
            }
            setData(data);
        })
        .catch((error) => console.error('Error fetching data:', error));
};


const handleDownloadPDF = async () => {
  const doc = new jsPDF('p', 'mm', [57.15, 57.15]); // Custom tag size (2.25 x 2.25 inches)

  const tagWidth = 57.15;  // Tag width
  const tagHeight = 57.15; // Tag height
  const margin = 2;        // Margin around the tag
  const qrSize = 20;       // QR Code size
  const centerX = tagWidth / 2; // Center position for X-axis
  const textStartY = qrSize + margin ; // Text starts below QR

  const loadImage = (url) => {
      return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = reject;
          img.src = url;
      });
  };

  for (let i = 0; i < data.length; i++) {
      const item = data[i];

      if (i > 0) doc.addPage(); // New page for each tag

      try {
          const qrDataUrl = await loadImage(item.qr_code);

          // Draw outer border around the tag
          doc.setDrawColor(0); // Black border
          doc.setLineWidth(0.1);
          doc.rect(1, 1, tagWidth - 2, tagHeight - 2); // (x, y, width, height)

          // // Inner box for QR Code
          // const qrBoxHeight = qrSize + 5;
          // doc.rect(5, margin, tagWidth - 10, qrBoxHeight);
          // Draw only the top, left, and right borders of the QR box (no bottom line)
        doc.line(5, margin, tagWidth - 5, margin); // Top border
        doc.line(5, margin, 5, margin + qrSize + 5); // Left border
        doc.line(tagWidth - 5, margin, tagWidth - 5, margin + qrSize + 5); // Right border


          // Center QR Code inside the inner box
          doc.addImage(qrDataUrl, 'PNG', centerX - qrSize / 2, margin +1, qrSize, qrSize);

          // Set font and alignment for text
          doc.setFontSize(5);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(0, 0, 0);

          let textY = textStartY + 3;
          const rowHeight = 4;
          const col1X = 7;  // Left column start
          const col2X = tagWidth / 3; // Right column start

          // Define the table data
          const tableData = [
              ['ID:', item.bno],
              ['SO:', item.SO],
              ['Cut No:', item.Cut_No],
              ['Color:', item.Colour],
              ['Size:', item.Size],
              ['Qty:', item.Qty],
              ['Style No:', item.Style],
              ['Style:', item.Style_Name],
          ];

          // Draw table borders and add text
          tableData.forEach(([label, value], index) => {
              const rowY = textY + index * rowHeight;

              // Draw row border
              doc.rect(5, rowY - 3, tagWidth - 10, rowHeight);

              // Draw column separator
              doc.line(col2X - 2, rowY - 3, col2X - 2, rowY + rowHeight - 3);

              // Add text to table
              doc.setFont(undefined, 'bold');
              doc.text(label, col1X, rowY);
              doc.setFont(undefined, 'normal');
              doc.text(value.toString(), col2X, rowY);
          });

      } catch (error) {
          console.error(`Error processing tag ${i}:`, error);
      }
  }

  // Open PDF in new tab for preview
  const pdfUrl = doc.output("bloburl");
  window.open(pdfUrl, "_blank");

   // Store printed status in database
   fetch(`${BASE_URL}/api/store-print-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ SO: selectedSO, Cut_No: selectedCutNo }),
})
.then((response) => response.json())
.then((data) => console.log(data))
.catch((error) => console.error('Error storing print status:', error));
};  


  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'Id' },
      { Header: 'SO', accessor: 'SO' },
      { Header: 'Cut No', accessor: 'Cut_No' },
      { Header: 'Colour', accessor: 'Colour' },
      { Header: 'Size', accessor: 'Size' },
      { Header: 'BQty', accessor: 'Qty' },
      { Header: 'Style No', accessor: 'Style' },
      { Header: 'Style', accessor: 'Style_Name' },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', padding: '20px 0' }}>
      <Container>
        <div className="d-flex justify-content-center align-items-center mb-4">
          <h2 className="text-white ">Generate Tags</h2>
          
        </div>
        {errorMessage && (
          <div className="alert alert-danger mb-3" style={{ maxWidth: '300px' }}>
            {errorMessage}
          </div>
        )}

        <div className="d-print-none">
          <Row className="mb-4 align-items-center">
            <Col md={12}>
              <Form className="d-flex gap-3 align-items-center">
                <Form.Group>
                  <Form.Label className="text-white me-2">Select SO:</Form.Label>
                  <Form.Select value={selectedSO} onChange={(e) => setSelectedSO(e.target.value)}>
                    <option value="">Select SO</option>
                    {soList.map((so) => (
                      <option key={so.SO} value={so.SO}>{so.SO}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="text-white me-2">Select Cut No:</Form.Label>
                  <Form.Select value={selectedCutNo} onChange={(e) => setSelectedCutNo(e.target.value)}>
                    <option value="">Select Cut No</option>
                    {cutNoList.map((cut) => (
                      <option key={cut.Cut_No} value={cut.Cut_No}>{cut.Cut_No}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

               
              </Form>
            </Col>
            
            
          </Row>

          <Button variant="primary" onClick={handleGenerate}>
            <Filter size={20} className='me-2'/>
                  Filter
         </Button>

             {data.length > 0 && (
            <Button 
              variant="success" 
              onClick={handleDownloadPDF}
              className="d-print-none m-2"
            >
                 <Printer size={20} className='me-2'/>
              Print Tags
            </Button>
          )}


        </div>

        {/* Table and other content */}
        <Container className="mt-4">
          {/* Your table and other UI elements here */}
          <div className="bg-white rounded shadow-lg p-4">        
        <div className="table-responsive">
  <table
    {...getTableProps()}
    className="table table-bordered table-striped table-hover"
    style={{ tableLayout: "auto", width: "100%" }}
  >
    <thead className="table-dark text-center" >
      {headerGroups.map((headerGroup) => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <th
              {...column.getHeaderProps(column.getSortByToggleProps())}
              style={{
                cursor: "pointer",
                userSelect: "none",
                whiteSpace: "nowrap",
                minWidth: "max-content",
              }}
            >
              {column.render("Header")}
              <span>
                {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
              </span>
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody {...getTableBodyProps()} className='text-center'>
      {page.map((row) => {
        prepareRow(row);
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map((cell) => (
              <td
                {...cell.getCellProps()}
                style={{
                  whiteSpace: "nowrap",
                  minWidth: "max-content",
                }}
              >
                {cell.column.id === "Date" ? (
                  (() => {
                    const originalDate = new Date(cell.value);
                    originalDate.setDate(originalDate.getDate() + 1);
                    return originalDate.toISOString().split("T")[0];
                  })()
                ) : (
                  cell.render("Cell")
                )}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <span>
              Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
            </span>
            <select
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              className="form-select d-inline-block w-auto ms-2"
            >
              {[10, 20, 30, 40, 50].map(size => (
                <option key={size} value={size}>Show {size}</option>
              ))}
            </select>
          </div>

          <div className="btn-group">
            <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage} variant="outline-primary">{'<<'}</Button>
            <Button onClick={() => previousPage()} disabled={!canPreviousPage} variant="outline-primary">Previous</Button>
            <Button onClick={() => nextPage()} disabled={!canNextPage} variant="outline-primary">Next</Button>
            <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} variant="outline-primary">{'>>'}</Button>
          </div>
        </div>
      </div>
        </Container>
      </Container>
    </div>
  );
};

export default CutInTag;
