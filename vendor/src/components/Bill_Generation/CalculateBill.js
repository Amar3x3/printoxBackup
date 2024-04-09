const { PDFDocument } = require("pdf-lib");
const mammoth = require('mammoth');
const { ipcRenderer } = window.require('electron');


let prices = null;

function getPriceDetails() {
  ipcRenderer.send("getPricingData");
  ipcRenderer.on('getPricingData', (event, data) => {
    console.log(data);
    if (data) {
      prices = data;
    }
  }
  );
};

getPriceDetails();
console.log("Pricing", prices);

async function getNoOfPages(fileName, file, pages) {
  if (pages.type === "Custom") {
    const pageRange = pages.range.split("-");
    let count = parseInt(pageRange[1]) - parseInt(pageRange[0]) + 1;
    return count;
  } else {
    if (fileName.includes(".pdf")) {
      const pdfDoc = await PDFDocument.load(file);
      return pdfDoc.getPageCount();
    } else if (fileName.includes(".docx")) {
      const docxBuffer = Buffer.from(file);

      const { value } = await mammoth.extractRawText({ buffer: docxBuffer });

      // This is a basic way and may not be perfect
      const pageBreaks = value.split("<w:pageBreak>").length - 1;

      // Assuming one page to start and adding the breaks to determine total pages
      return 1 + pageBreaks;
    } else {
        return 1;
    }
  }
};

/* 
 const bill = {
    fileName: {
        pages: int,
        color: true/false,
        amount: int
    }
}
*/

async function CalculateBill(user) {
  console.log("user file data:- ", user);
    let totalPrice = 0;
    const bill = {}
    for (let i = 0; i < user.files.length; i++) {
        const fileInfo = user.files[i];
        const noOfPages = await getNoOfPages(fileInfo.name, fileInfo.file, fileInfo.configuration.pages);

      let pricePerPage = 1;
      for (let i = 0; i < prices.length; i++) {
        const price = prices[i];
        const { pageSize, color, pagesPerSheet } = fileInfo.configuration;
        const type = color ? "Color" : "B/W";
        if (price.papersize === pageSize && price.pagesPerSheet === pagesPerSheet && price.type === type) {
          pricePerPage = price.price;
          break;
        }
      }

        const price = noOfPages * pricePerPage * fileInfo.configuration.copies;

        const fileBill = {
            pages: noOfPages,
            color: (fileInfo.configuration.color ? "Color" : "B/W"),
            amount: price
        };

        bill[fileInfo.name] = fileBill;

        totalPrice += price;

    }
  const totalBill = (0.05 * totalPrice) + (totalPrice);
  return {
    bill,
    totalPrice,
    totalBill
  };
};

export default CalculateBill;
