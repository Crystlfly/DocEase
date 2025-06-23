'use client'; // Only needed if you're using Next.js 13+ with App Router

import React, { useEffect, useState } from 'react';
import {
  ModuleRegistry,
  ClientSideRowModelModule
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register only community-supported modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule
]);

export default function LogGrid() {
  const [rowData, setRowData] = useState([]);

  const [colDefs] = useState([
    { field: 'timestamp', headerName: 'Timestamp' },
    { field: 'message', headerName: 'Message' },
    
  ]);

  const defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/Logs/allLogs');
        const data = await res.json();
        setRowData(data);
      } catch (error) {
        console.error('Error fetching log data:', error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Log Grid</h1>
      <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  );
}
