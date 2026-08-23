export type PdfPage = {
  pageContent: string;
  metadata: {
    loc: {
      pageNumber: number;
    };
    source: string;
  };
};
