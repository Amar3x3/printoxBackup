import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { colorChange, pageSizeChange, layoutChange, pagesPerSheet, changePageType, changePageRange, noOfCopies } from "../../Store/UserFiles";
import styles from "./SenderPeer.module.css";

export function Color({ index, fileObj }) {
    const dispatch = useDispatch();

    function handleColorChange(e, index) {
        dispatch(colorChange(e, index));
    }

    return (
        <div>
            <label className={styles.whiteBoldText} htmlFor="">
                <div className={styles.grid2}>
                    <div>
                        Colour :{" "}
                        <input
                            type="radio"
                            name={`colour-${index}`}
                            value="color"
                            onChange={e => handleColorChange(e, index)}
                            defaultChecked={fileObj.configuration.color}
                        />
                    </div>
                    <div className={styles.mg_left_bw}>
                        B/W :{" "}
                        <input
                            type="radio"
                            name={`colour-${index}`}
                            value="bw"
                            onChange={e => handleColorChange(e, index)}
                            defaultChecked={!fileObj.configuration.color}
                        />
                    </div>
                </div>
            </label>
        </div>
    )
};

export function PageRange({ index, fileObj }) {
    const dispatch = useDispatch();
    const [showRange, setShowRange] = useState(fileObj.configuration.pages.type === "Custom" ? true : false);
    const [error, setError] = useState("");

    function isValidRange(value) {
        const pattern = /^(\d+-\d+)(,\s?\d+-\d+)*$/;
        return pattern.test(value);
    }

    function handleSetShowRange(e, index) {
        if (e.target.value === "Custom") {
            setShowRange(true);
        } else {
            setShowRange(false);
        }
        dispatch(changePageType(e, index));
    }

    function handleNumberOfPages(e, index) {
        const newRange = e.target.value;

        if (isValidRange(newRange) || newRange === "") {
            dispatch(changePageRange(newRange, index));
            setError("");
        } else {
            // Optionally, show an error message to the user or handle it appropriately.
            console.error("Invalid range format.");
            setError("Invalid range format. Please use the format '1-5, 7-9'.");
        }
    }

    return (
        <label>
            <div className={styles.optionTitle}> Pages{" "} </div>
            <select
                value={fileObj.configuration.pages.type}
                onChange={e => handleSetShowRange(e, index)}
            >
                <option value="All">All</option>
                <option value="Custom">Custom</option>
            </select>
            {showRange && (
                <>
                    <input
                        placeholder="e.g 1-5, 2-3"
                        onChange={(e) => handleNumberOfPages(e, index)}
                    />
                    {error && (<div>{error}</div>)}
                </>
            )}
        </label>
    )
}

export function Layout({ index, fileObj }) {
    const dispatch = useDispatch();

    function handleLayoutChange(e, index) {
        dispatch(layoutChange(e.target.value, index));
    }

    return (
        <label>
            <div className={styles.optionTitle}> Layout{" "}</div>
            <select
                value={fileObj.configuration.layout}
                onChange={e => handleLayoutChange(e, index)}
            >
                <option value="Portrait">Portrait</option>
                <option value="Landscape">Landscape</option>
            </select>
        </label>
    )
};

export function PageSize({ index, fileObj }) {
    const dispatch = useDispatch();

    function handlePageSizeChange(e, index) {
        dispatch(pageSizeChange(e, index));
    }

    return (
        <label htmlFor={`pagesize-${index}`}>
            <div className={styles.optionTitle}>Page Size {" "}</div>
            <select
                name={`pagesize-${index}`}
                value={fileObj.configuration.pageSize}
                onChange={e => handlePageSizeChange(e, index)}
            >
                <option value="A4">A4</option>
                <option value="A5">A5</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="A3">A3</option>
                <option value="Tabloid">Tabloid</option>
                <option value="Letter">Letter</option>
            </select>
        </label>
    )
}

export function PagesPerSheet({ index, fileObj }) {
    const dispatch = useDispatch();

    function handlePagesPerSheet(e, index) {
        dispatch(pagesPerSheet(e.target.value, index));
    }
    return (
        <label>

            <div className={styles.optionTitle}> Single / Double{" "} </div>
            <select
                value={fileObj.configuration.pagesPerSheer}
                onChange={e => handlePagesPerSheet(e, index)}
            >
                <option className={styles.opt} value="1">Yes</option>
                <option value="2">No</option>
            </select>
        </label>
    );
}

export function Copies({ index, fileObj }) {
    const dispatch = useDispatch();

    function handleNoOfCopies(e, index) {
        dispatch(noOfCopies(e.target.value, index));
    }

    return (
        <label className={`${styles.optionTitle} `}>Copies:- {" "}
            <input className={styles.copies} defaultValue={1} onChange={e => handleNoOfCopies(e, index)}></input>
        </label>
    );
}

