"use client";

interface PdfProps {
  pdfUrl: string;
}
const PDFViewer = ({ pdfUrl }: PdfProps) => {
  return (
    <section className="flex max-h-screen p-4 overflow-auto flex-5">
      <iframe
        className="w-full h-full"
        src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`}
      ></iframe>
    </section>
  );
};

export default PDFViewer;
