import React from "react";
import styles from "./BillComponent.module.css"; 

const BillComponent = ({ bill }) => {
  const { totalBill, bill: files } = bill;

  return (
    <div>
      <h2>Bill Information</h2>
      <p>Total Bill: INR{totalBill}</p>

      <h3>Files:</h3>
      <table className={styles.billtable}>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(files).map((fileName) => {
            const file = files[fileName];
            return (
              <tr key={fileName}>
                <td>{fileName}</td>
                <td>INR{file.amount.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BillComponent;
