'use client'; // Only needed if you're using Next.js 13+ with App Router

import React, { useEffect, useState } from 'react';
import { AllCommunityModules } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function DoctorGrid() {
  const [rowData, setRowData] = useState([]);

  const [colDefs] = useState([
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
    { field: 'phone', headerName: 'Phone' },
  ]);

  const defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/patient/list-Patients');
        const data = await res.json();
        setRowData(data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
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
          modules={AllCommunityModules}
        />
      </div>
    </div>
  );
}
