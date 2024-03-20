import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFFile from "./PDFFile";

const PDFDownload = () => {
    return (
        <div className="App">
            <PDFDownloadLink
                document={<PDFFile />}
                filename="Transaction Summary"
            >
                {({ loading }) =>
                    loading ? (
                        <button>Loading Document...</button>
                    ) : (
                        <button>Download</button>
                    )
                }
            </PDFDownloadLink>
        </div>
    );
};

export default PDFDownload;
