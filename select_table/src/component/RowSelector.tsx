import { ChevronDown } from 'lucide-react';
import { Button } from 'primereact/button';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef, RefObject } from 'react';
import '../App.css'
interface RowSelectorProps{
    overlayCount: number;
    setOverlayCount: (value:number) => void;
    setPageSelectCount: (count:number) => void;
}
export default function RowSelector({overlayCount,setOverlayCount,setPageSelectCount}:RowSelectorProps){
    const op: RefObject<OverlayPanel> = useRef(null);
    
    const handleValueChange = (e:InputNumberValueChangeEvent) =>{
        setOverlayCount(e.value ?? 0)
        console.log(e.value)
    }
    return(
        <>
        <Button icon={<ChevronDown/>} 
        className='selector' 
        rounded text aria-label="Selection" 
        onClick={(e) => {op.current?.toggle(e)}}
        />
        <OverlayPanel ref={op}>
        <InputNumber value={overlayCount}
         onValueChange={handleValueChange}
          maxFractionDigits={0} 
          id="number-input"
          className='selection-input'
          />
        
        <Button
        label='Submit' 
        onClick={()=>{setPageSelectCount(overlayCount); op.current?.hide()}}
        />
        </OverlayPanel>  
    
        </>
    )
}