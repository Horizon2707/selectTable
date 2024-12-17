import './App.css'
import 'primereact/resources/themes/lara-light-blue/theme.css'; 
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css';
import './index.css'; 
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DataTableStateEvent,DataTableSelectionMultipleChangeEvent } from "primereact/datatable";
import { useEffect, useRef, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import RowSelector from './component/RowSelector.tsx';

function App() {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currPage, setCurrPage] = useState(0);
  const [overlayCount, setOverlayCount] = useState<number>(0)
  const rowsperPage = 12
  const pageSelectCount = useRef<{ [key: number]: number }>({});

  const setPageSelectCount = (count:number) =>{
    let key = 1
    const tempSelectCount: { [key: number]: number } = {};
    while(count >=0){
      if((count-rowsperPage) < 0){
        tempSelectCount[key] = count;
        break
      }
      else{
        tempSelectCount[key] = rowsperPage;
        count -= rowsperPage
      }
      key++
    }
    pageSelectCount.current = tempSelectCount;
    setPageSelections(currPage)
  }

  const setPageSelections = (pageNo:number) =>{
    pageNo = pageNo + 1
    if(pageNo in pageSelectCount.current){
      const nrows = data.slice(0, pageSelectCount.current[pageNo]);
      const selectedRowsSet = new Set(selectedRows);
      const filteredrows : typeof nrows = nrows.filter((element) => !selectedRowsSet.has(element));
      const newSelectedRows = selectedRows.concat(filteredrows)
      setSelectedRows(newSelectedRows)
      delete pageSelectCount.current[pageNo]
    }
    else{
      console.log("No page select found")
    }
  }

  const onPageChange = (event:DataTableStateEvent) => {
    if (event.page !== undefined) {
      setCurrPage(event.page);
    }
  }

  const onSelectionChange = (event:DataTableSelectionMultipleChangeEvent<[]>) =>{
    setSelectedRows(event.value)
  }

  const fetchRows = async(pageNo:number) =>{
    setLoading(true);  
    await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNo+1}`) 
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json(); 
      })
      .then((jsonData) => {
        setData(jsonData.data); 
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }


  useEffect(()=>{
    fetchRows(currPage); 
  },[currPage])

  useEffect(() => {
    if (data.length > 0) { 
      setPageSelections(currPage); 
    }
  }, [data]);

  
  return (
    <>
        <div className="main_div">
           <div className="datatable">
            {loading ? (
              <ProgressSpinner/>
            ) : (
              <DataTable value={data} loading={loading} size='normal' lazy
              selectionMode = 'checkbox' 
              selection={selectedRows} 
              onSelectionChange={onSelectionChange} selectionPageOnly 
              paginator rows={12} first={currPage * rowsperPage} totalRecords={500} onPage={onPageChange}
              scrollHeight='600px' scrollable>
              <Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
                <Column header={
                  <RowSelector overlayCount={overlayCount} 
                  setOverlayCount={setOverlayCount}
                  setPageSelectCount={setPageSelectCount}
                  />}></Column>
                <Column className="title" field="title" header="Title"></Column>
                <Column field="place_of_origin" header="Place of Origin"></Column>
                <Column field="artist_display" header="Artist"></Column>
                <Column field="inscriptions" header="Inscriptions"></Column>
                <Column field="date_start" header="Start Date"></Column>
                <Column field="date_end" header="End Date"></Column>
              </DataTable>
            )}
            
            </div>
        </div>
      
    </>
  )
}

export default App
