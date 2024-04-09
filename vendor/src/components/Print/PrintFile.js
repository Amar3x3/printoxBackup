// // const path = window.require('Path');
// // const { shell } = require('electron');

// function PrintFile(filepath) {
//     const fileURL = 'file:///' + process.cwd() + filepath.substring(2);
//     console.log(fileURL);
//     const printWindow = window.open(fileURL, '_blank');
//     if (printWindow) {
//         printWindow.onload = () => {
//             printWindow.print();
//         }
//     }
// }

// export default PrintFile;

const { print } = window.require("pdf-to-printer");


function PrintFile(filepath) {

    print(filepath, { printer: "Microsoft Print to PDF", printDialog: true })
        .then(console.log)
        .catch(console.error);
};

export default PrintFile;