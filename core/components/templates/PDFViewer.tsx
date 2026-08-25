import React from "react";

interface PdfProps {
  pdfUrl: string;
}
const PDFViewer = ({ pdfUrl }: PdfProps) => {
  return (
    <iframe
      className="w-full h-full"
      src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`}
    ></iframe>
  );
};

export default PDFViewer;
