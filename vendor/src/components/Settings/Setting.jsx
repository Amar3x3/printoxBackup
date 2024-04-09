import React, { useEffect, useState } from 'react'
import getAllPrinters from '../Print/GetAllPrinters';
const { ipcRenderer } = window.require('electron');

export default function Setting() {
    const [pricingData,setPricingData]=useState([]);
    const [element, setElement] = useState({ printer: "", papersize: "", type: "", price: "", pagesPerSheet: "" });
    const [printerList, setPrinterList] = useState([]);

    

    useEffect(() => {
        console.log("Printer List:- ", printerList);
    }, [printerList]);

    useEffect(()=>{
        ipcRenderer.send('getPricingData');
        ipcRenderer.on('getPricingData', (event, data) => {
            console.log(data);
            if (data) {
                setPricingData(data);
            }
        });
        getAllPrinters().then((data) => {
            setPrinterList(data);
        });
    },[]);
    useEffect(()=>{
        if(pricingData.length>0){
        ipcRenderer.send('setPricingData',pricingData);
        console.log(pricingData);
        }
    },[pricingData]);

    const addElement = (event)=>{
        event.preventDefault();
        setPricingData((prev)=>([...prev,element]));
    };
    return (
        <>
            Set price
            <div>
                <form action="">
                    <label htmlFor="">Printer :-
                        {/* <input type="text" value={element.printer} onChange={(event) => { setElement((prev) => ({ ...prev, printer: event.target.value })) }} /> */}
                        <select
                            name='Printer'
                            value={element.printer}
                            onChange={(event) => {
                                setElement((prev) => ({...prev, printer: event.target.value}))
                            }}
                        >
                        {
                            printerList.map((printer) => {
                                return (
                                    <option value={printer.name}>{ printer.name }</option>
                                )
                            })
                            }
                            </select>
                    </label>
                    <br />
                    <label htmlFor="">Paper Size :-
                        <select name="papersize" value={element.papersize} onChange={(event) => { setElement((prev) => ({ ...prev, papersize: event.target.value })) }}>
                            <option value="" disabled >Select an option</option>
                            <option value="A1">A1</option>
                            <option value="A2">A2</option>
                            <option value="A3">A3</option>
                            <option value="A4">A4</option>
                        </select></label>
                    <br />
                    <label> Pages Per Sheet:-{" "}
                        <select
                            onChange={event => {
                                setElement(prev => ({ ...prev, pagesPerSheet: event.target.value }))
                            }}
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select>
                    </label>
                    <br />
                    <label htmlFor="">Type :-
                        <select name="type" value={element.type} onChange={(event) => { setElement((prev) => ({ ...prev, type: event.target.value })) }}>
                            <option value="" disabled >Select an option</option>
                            <option value="Color">Colour</option>
                            <option value="B/W">Black and White</option>
                        </select></label>
                    <br />
                    <label htmlFor="">Price :- <input type="text" value={element.price} onChange={(event) => { setElement((prev) => ({ ...prev, price: event.target.value })) }} /></label>
                    <button onClick={addElement}>Add New</button>
                </form>
                {
                    pricingData && pricingData.map((ele, idx) => (
                        <div key={idx}>
                            <div>{ele.printer} {ele.papersize} {ele.type} {ele.price}</div>
                        </div>
                    ))
                }
            </div>
        </>
    );
};
