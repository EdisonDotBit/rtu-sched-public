import React from "react";
import {
    Page,
    Text,
    Image,
    Document,
    View,
    StyleSheet,
} from "@react-pdf/renderer";
import Qwe from "../Component/Subcomponent/Asset/rtu-logo.png";
import { Font } from "@react-pdf/renderer";

// Font.register({
//     family: "Poppins",
//     src: "http://fonts.gstatic.com/s/poppins/v1/TDTjCH39JjVycIF24TlO-Q.ttf",
//     fontStyle: "normal",
//     fontWeight: "normal",
// });

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },

    title: {
        // Title of the page
        margin: 12,
        marginBottom: 16,
        fontSize: 24,
        textAlign: "justify",
        fontWeight: "heavy",
        textDecoration: "underline",
    },

    primaryText: {
        // Most used texts especially for content inside the header texts
        margin: 12,
        marginBottom: 2,
        fontSize: 10,
        textAlign: "justify",
        fontFamily: "Helvetica",
    },

    secondaryText: {
        // For header or heading texts
        margin: 12,
        fontSize: 14,
        textAlign: "justify",
        fontFamily: "Helvetica",
    },

    thirdText: {
        // Used for detailed instructions located below the page (optional)
        margin: 12,
        fontSize: 6,
        textAlign: "justify",
        fontFamily: "Helvetica",
    },

    image: {
        marginVertical: 15,
        marginHorizontal: 100,
    },

    pageNumber: {
        position: "absolute",
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "grey",
    },

    column: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },

    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: 60,
    },
});

const PDFFile = () => {
    return (
        <Document>
            <Page style={styles.body}>
                <Image style={styles.image} src={Qwe} />
                <Text style={styles.title} fixed>
                    RTU Appointment Summary
                </Text>

                <Text style={styles.primaryText}>
                    Your online application has been submitted.
                </Text>

                <Text style={styles.primaryText}>
                    Your Reference Number is:{" "}
                </Text>

                <Text style={styles.primaryText}>
                    Please read the details and instructions below.
                </Text>

                <Text style={styles.primaryText}>
                    Print a copy of this page.
                </Text>

                <Text
                    style={[
                        styles.secondaryText,
                        {
                            marginTop: 24,
                            textDecoration: "underline",
                            fontWeight: "heavy",
                        },
                    ]}
                >
                    Personal Information
                </Text>

                <Text style={[styles.primaryText, { fontWeight: "heavy" }]}>
                    Student Number:{" "}
                </Text>

                <Text style={[styles.primaryText, { fontWeight: "heavy" }]}>
                    Full Name:{" "}
                </Text>

                <Text style={[styles.primaryText, { fontWeight: "heavy" }]}>
                    Contact Number:{" "}
                </Text>

                <Text style={[styles.primaryText, { fontWeight: "heavy" }]}>
                    Email Address:{" "}
                </Text>

                <Text
                    style={[
                        styles.secondaryText,
                        {
                            marginTop: 24,
                            textDecoration: "underline",
                            fontWeight: "heavy",
                        },
                    ]}
                >
                    Appointment Information
                </Text>

                <View style={styles.column}>
                    <View style={styles.row}>
                        <Text
                            style={[
                                styles.primaryText,
                                { fontWeight: "heavy", color: "grey" },
                            ]}
                        >
                            RTU Branch
                        </Text>

                        <Text
                            style={[
                                styles.primaryText,
                                { fontWeight: "heavy", color: "grey" },
                            ]}
                        >
                            Office Name
                        </Text>

                        <Text
                            style={[
                                styles.primaryText,
                                { fontWeight: "heavy", color: "grey" },
                            ]}
                        >
                            Purpose
                        </Text>

                        <Text
                            style={[
                                styles.primaryText,
                                { fontWeight: "heavy", color: "grey" },
                            ]}
                        >
                            Date
                        </Text>
                    </View>
                </View>

                <Text
                    style={styles.pageNumber}
                    render={({ pageNumber, totalPages }) =>
                        `${pageNumber} / ${totalPages}`
                    }
                    fixed
                />
            </Page>
        </Document>
    );
};

export default PDFFile;
