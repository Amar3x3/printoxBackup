const { getPrinters } = window.require("pdf-to-printer");

async function getAllPrinters() {
  try {
    const printerList = await getPrinters();

    return printerList;
  } catch (error) {
    console.error("Error retrieving printers:", error);
  }
}

export default getAllPrinters;
