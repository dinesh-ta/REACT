import React, { useEffect,useState,useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ExcelExportParams } from 'ag-grid-community'

const CompanyLogoRenderer = ({ value }) => (
    <span
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
      }}
    >
      {value && (
        <img
          alt={`${value} Flag`}
          src={`https://www.ag-grid.com/example-assets/space-company-logos/${value.toLowerCase()}.png`}
          style={{
            display: 'block',
            width: '25px',
            height: 'auto',
            maxHeight: '50%',
            marginRight: '12px',
            filter: 'brightness(1.1)',
          }}
        />
      )}
      <p
        style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </p>
    </span>
  );

  /* Custom Cell Renderer (Display tick / cross in 'Successful' column) */
const MissionResultRenderer = ({ value }) => (
<span
  style={{
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center',
  }}
>
  {
    <img
      alt={`${value}`}
      src={`https://www.ag-grid.com/example-assets/icons/${
        value ? 'tick-in-circle' : 'cross-in-circle'
      }.png`}
      style={{ width: 'auto', height: 'auto' }}
    />
  }
</span>
);

/* Format Date Cells */
const dateFormatter = (params) => {
return new Date(params.value).toLocaleDateString('en-us', {
  weekday: 'long',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});
};


const BasicGridExample = () => {
    const[rowData,setRowData] = useState([])
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [colDefs] = useState([
        {
            field: 'mission',
            checkboxSelection: true,
            flex: 1,
            enableRowGroup: true,
            floatingFilterComponent: 'globalSearchFilterComponent', // Use custom floating filter component for global search
            floatingFilterComponentParams: {
              suppressFilterButton: true, // Hide the filter button in the floating filter
            },
        },
        {
          field: 'company',
          cellRenderer: CompanyLogoRenderer,
          enableRowGroup: true,
          flex: 1,
        },
        {
          field: 'location',
          flex: 1,
        },
        {
          field: 'date',
          valueFormatter: dateFormatter,
          flex: 1,
        },
        {
          field: 'price',
          valueFormatter: (params) => {
            return '£' + params.value.toLocaleString();
          },
          flex: 1,
        },
        {
          field: 'successful',
          cellRenderer: MissionResultRenderer,
          flex: 1,
        },
        { field: 'rocket',
        flex: 1, },
      ]);

const defaultColDef = useMemo(() => ({
filter: true, // Enable filtering on all columns
editable: true,
}))

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/space-mission-data.json') // Fetch data from server
      .then((result) => result.json()) // Convert to JSON
      .then((rowData) => setRowData(rowData)); // Update state of `rowData`
  }, []);

  useEffect(() => {
    // Update column widths when gridApi is available and rowData changes
    if (gridApi && rowData.length > 0) {
      gridApi.sizeColumnsToFit();
    }
  }, [gridApi, rowData]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const onCellValueChanged = (event) => {
    console.log('Row Data:', event.data); // Logging entire row data to console
};


useEffect(() => {
    if (gridApi && gridColumnApi) {
        gridApi.setGridOption('quickFilterText', searchText); // Updated usage to set quickFilterText
    }
}, [gridApi, gridColumnApi, searchText]);

const exportToCsv = () => {
  const params = {
      skipHeader: false,
      columnGroups: true,
      skipFooters: true,
      skipGroups: true,
      skipPinnedTop: true,
      skipPinnedBottom: true,
      allColumns: true,
      onlySelected: false,
      suppressQuotes: false,
      fileName: 'exported_data.csv',
  };
  gridApi.exportDataAsCsv(params);
};


    return (
      <div className="ag-theme-alpine-dark" style={{ height: '80vh', width: '100%' }}>
            <h1 style={{ color: 'red' }}>REACT GRID </h1>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button onClick={exportToCsv}>Export to CSV</button>
            </div>
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                onGridReady={onGridReady}
                defaultColDef={{
                    ...defaultColDef,
                    flex: 1,
                }}
                rowSelection="multiple"
                onCellValueChanged={onCellValueChanged}
                suppressRowClickSelection
                gridOptions={{
                  sideBar: {
                      toolPanels: ['columns'],
                  },
              }}
            />
        </div>
    );
}

export default BasicGridExample;
