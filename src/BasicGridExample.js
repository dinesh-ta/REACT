import React, { useEffect,useState,useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

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
    const [colDefs] = useState([
        {
          field: 'mission',
          checkboxSelection: true,
          flex: 1,
        },
        {
          field: 'company',
          cellRenderer: CompanyLogoRenderer,
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
  };


    return (
        <div className="ag-theme-alpine" style={{height: '80vh', width: '100%' }}>
            <h1>REACT GRID </h1>
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                onGridReady={onGridReady}
                defaultColDef={{
                  filter: true,
                  editable: true,
                  flex: 1, // Allow columns to take up remaining space equally
                }}
                pagination={true}
                rowSelection="multiple"
                onSelectionChanged={(event) => console.log('Row Selected!')}
                onCellValueChanged={(event) => console.log(`New Cell Value: ${event.value}`)}>
            </AgGridReact>
        </div>
    );
}

export default BasicGridExample;
