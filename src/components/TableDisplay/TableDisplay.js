// import 'bootstrap/dist/css/bootstrap.min.css';
// import React, { useEffect, useMemo, useState } from "react";
// import { Button, Container } from 'react-bootstrap';
// import {
//   useGlobalFilter,
//   usePagination,
//   useSortBy,
//   useTable
// } from 'react-table';

// const TableDisplay = () => {
//   const [items, setItems] = useState([]);

//   const BASE_URL = process.env.REACT_APP_BASE_URL;

  

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const userPlant = user?.plant;
//     const userRole = user?.role;
    
//     userRole === "company admin" ? fetch(`${BASE_URL}/api/items/fg`).then((response) => {
//       if (!response.ok) {
//         throw new Error("Failed to fetch data");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       setItems(data);
//     })
//     .catch((error) => {
//       console.error("Error fetching data:", error);
//     }) :

//     fetch(`${BASE_URL}/api/items/fg?plant=${encodeURIComponent(userPlant)}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setItems(data);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   }, [BASE_URL]);
  

//   const columns = useMemo(
//     () => [
//       { Header: 'BNo', accessor: 'bno' },
//       { Header: 'SO', accessor: 'SO' },
//       { Header: 'Style', accessor: 'Style' },
//       { Header: 'Style Name', accessor: 'Style_Name' },
//       { Header: 'Cut No', accessor: 'Cut_No' },
//       { Header: 'Colour', accessor: 'Colour' },
//       { Header: 'Size', accessor: 'Size' },
//       { Header: 'BQty', accessor: 'BQty' },
//       { Header: 'Plant', accessor: 'Plant' },
//       { Header: 'Line', accessor: 'Line' },
//       { Header: 'Damage Pcs', accessor: 'Damage_Pcs' },
//       { Header: 'Cut Panel Shortage', accessor: 'Cut_Panel_Shortage' },
//       { Header: 'Good Pcs', accessor: 'Good_Pcs' },
//       { Header: 'User', accessor: 'User' },
//       { 
//         Header: 'Date',
//         accessor: 'Date',
//         Cell: ({ value }) => {
//           const originalDate = new Date(value);
//           originalDate.setDate(originalDate.getDate() + 1); // Adjust date
//           return originalDate.toISOString().split("T")[0];
//         }
//       },
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
//       data: items,
//       initialState: { pageIndex: 0, pageSize: 10 },
//     },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );

//   return (
//     <Container fluid>
//       <div className="bg-white rounded shadow-lg p-4">
//         <h2 className="text-center text-primary mb-4">Finish Goods List</h2>
        
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

// <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-3">
//   <div className="d-flex align-items-center">
//     <span className="me-2">
//       Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
//     </span>
//     <select
//       value={pageSize}
//       onChange={e => setPageSize(Number(e.target.value))}
//       className="form-select d-inline-block w-auto"
//     >
//       {[10, 20, 30, 40, 50].map(size => (
//         <option key={size} value={size}>Show {size}</option>
//       ))}
//     </select>
//   </div>
//   <div className="btn-group">
//     <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage} variant="outline-primary" className="px-2 px-sm-3">{'<<'}</Button>
//     <Button onClick={() => previousPage()} disabled={!canPreviousPage} variant="outline-primary" className="px-2 px-sm-3">Previous</Button>
//     <Button onClick={() => nextPage()} disabled={!canNextPage} variant="outline-primary" className="px-2 px-sm-3">Next</Button>
//     <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} variant="outline-primary" className="px-2 px-sm-3">{'>>'}</Button>
//   </div>
// </div>
//       </div>
//     </Container>
//   );
// };

// export default TableDisplay;

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useMemo, useState } from "react";
import { Button, Container } from 'react-bootstrap';
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';

const TableDisplay = () => {
  const [items, setItems] = useState([]);
  const [ setLastRefreshed] = useState(new Date());
  
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // Function to fetch data based on user role
  const fetchData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userPlant = user?.plant;
    const userRole = user?.role;
    
    if (userRole === "company admin") {
      fetch(`${BASE_URL}/api/items/fg`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          return response.json();
        })
        .then((data) => {
          setItems(data);
          setLastRefreshed(new Date());
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      fetch(`${BASE_URL}/api/items/fg?plant=${encodeURIComponent(userPlant)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          return response.json();
        })
        .then((data) => {
          setItems(data);
          setLastRefreshed(new Date());
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh interval (every 30 seconds)
    const refreshInterval = setInterval(() => {
      fetchData();
    }, 15000); // 30 seconds
    
    // Clean up the interval when component unmounts
    return () => clearInterval(refreshInterval);
  }, [BASE_URL]);

  // Manual refresh function


  const columns = useMemo(
    () => [
      { Header: 'BNo', accessor: 'bno' },
      { Header: 'SO', accessor: 'SO' },
      { Header: 'Style', accessor: 'Style' },
      { Header: 'Style Name', accessor: 'Style_Name' },
      { Header: 'Cut No', accessor: 'Cut_No' },
      { Header: 'Colour', accessor: 'Colour' },
      { Header: 'Size', accessor: 'Size' },
      { Header: 'BQty', accessor: 'BQty' },
      { Header: 'Plant', accessor: 'Plant' },
      { Header: 'Line', accessor: 'Line' },
      { Header: 'Damage Pcs', accessor: 'Damage_Pcs' },
      { Header: 'Cut Panel Shortage', accessor: 'Cut_Panel_Shortage' },
      { Header: 'Good Pcs', accessor: 'Good_Pcs' },
      { Header: 'User', accessor: 'User' },
      { 
        Header: 'Date',
        accessor: 'Date',
        Cell: ({ value }) => {
          const originalDate = value;
          return originalDate;
        }
      },
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
      data: items,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <Container fluid>
      <div className="bg-white rounded shadow-lg p-4">
      <h3 className="text-primary mb-4 text-center">Finish Goods List</h3>
        
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

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-3">
          <div className="d-flex align-items-center">
            <span className="me-2">
              Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
            </span>
            <select
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              className="form-select d-inline-block w-auto"
            >
              {[10, 20, 30, 50, 100].map(size => (
                <option key={size} value={size}>Show {size}</option>
              ))}
            </select>
          </div>
          <div className="btn-group">
            <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage} variant="outline-primary" className="px-2 px-sm-3">{'<<'}</Button>
            <Button onClick={() => previousPage()} disabled={!canPreviousPage} variant="outline-primary" className="px-2 px-sm-3">Previous</Button>
            <Button onClick={() => nextPage()} disabled={!canNextPage} variant="outline-primary" className="px-2 px-sm-3">Next</Button>
            <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} variant="outline-primary" className="px-2 px-sm-3">{'>>'}</Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TableDisplay;