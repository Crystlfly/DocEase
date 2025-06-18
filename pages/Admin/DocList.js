'use client';

import React, { useEffect, useState } from 'react';
import {
  ModuleRegistry,
  ClientSideRowModelModule
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([
  ClientSideRowModelModule
]);

export default function DoctorGrid() {
  const [rowData, setRowData] = useState([]);

  const [colDefs] = useState([
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
    { field: 'phone', headerName: 'Phone' },
    {
      field: 'profileCompleted',
      headerName: 'Profile Completed',
      valueFormatter: (params) => (params.value ? 'Yes' : 'No'),
    },
  ]);

  const defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doc/list-doc');
        const data = await res.json();
        setRowData(data);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Doctor Grid</h1>
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
