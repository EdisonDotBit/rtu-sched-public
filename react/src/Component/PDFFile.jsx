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
        width: 200,
        height: 40,
    },

    pageNumber: {
        position: "absolute",
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "grey",
        fontStyle: "italic",
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
    bottomParagraph: {
        marginTop: 24,
        borderTopWidth: 1,
        borderTopColor: "black",
        paddingTop: 8,
    },
    paragraph: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: "black",
        paddingTop: 8,
    },

    bottomText: {
        fontSize: 10,
        textAlign: "center",
    },
    bulletList: {
        marginLeft: 20,
    },

    bulletItem: {
        fontSize: 10,
        marginBottom: 4,
    },

    link: {
        textDecoration: "underline",
        fontWeight: "bold",
        fontSize: 12,
        marginLeft: 20,
    },
});

const PDFFile = ({ succData }) => {
    return (
        <Document>
            <Page style={styles.body}>
                <View style={[styles.row, { justifyContent: "center" }]}>
                    <Image style={{ width: 200, height: 40 }} src={Qwe} />
                </View>

                <View style={[styles.row, { justifyContent: "center" }]}>
                    <Text style={styles.title} fixed>
                        RTU Appointment Slip
                    </Text>
                </View>
                <View style={styles.paragraph}>
                    <Text style={styles.primaryText}>
                        Your Appointment Number is: {succData.aptid}
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
                        Student or ID Number / Type: {succData.aptstudnum}
                    </Text>

                    <Text style={[styles.primaryText, { fontWeight: "heavy" }]}>
                        Full Name: {succData.aptname}
                    </Text>

                    <Text style={[styles.primaryText, { fontWeight: "heavy" }]}>
                        Contact Number: {succData.aptpnumber}
                    </Text>

                    <Text style={[styles.primaryText, { fontWeight: "heavy" }]}>
                        Email Address: {succData.aptemail}
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
                        <Text
                            style={[
                                styles.primaryText,
                                { fontWeight: "heavy" },
                            ]}
                        >
                            Branch: {succData.aptbranch}
                        </Text>

                        <Text
                            style={[
                                styles.primaryText,
                                { fontWeight: "heavy" },
                            ]}
                        >
                            Office: {succData.aptoffice}
                        </Text>

                        <Text
                            style={[
                                styles.primaryText,
                                { fontWeight: "heavy" },
                            ]}
                        >
                            Purpose: {succData.aptpurpose}
                        </Text>

                        <Text
                            style={[
                                styles.primaryText,
                                { fontWeight: "heavy" },
                            ]}
                        >
                            Date: {succData.aptdate}
                        </Text>
                        <Text
                            style={[
                                styles.primaryText,
                                { fontWeight: "heavy" },
                            ]}
                        >
                            Time: {succData.apttime}
                        </Text>
                    </View>
                    <View style={styles.bottomParagraph}>
                        <Text style={styles.primaryText}>Reminder:</Text>
                        <Text style={styles.primaryText}></Text>
                        <View style={styles.bulletList}>
                            <Text style={styles.bulletItem}>
                                • Bring your specified Valid ID / Soft Copy
                                Registration Form
                            </Text>
                            <Text style={styles.bulletItem}></Text>
                            <Text style={styles.bulletItem}>
                                • If you miss the appointment, you have three
                                (3) days to reschedule before it automatically
                                deleted.
                            </Text>
                            <Text style={styles.bulletItem}></Text>
                            <Text style={styles.bulletItem}>
                                • You may submit a feedback at:
                            </Text>
                            <Text style={styles.link}>
                                link to feedback.comasdasdasd
                            </Text>
                        </View>
                    </View>
                </View>
                <Text style={[styles.pageNumber, { fontStyle: "italic" }]}>
                    "Forever true to the gold and blue~"
                </Text>
            </Page>
        </Document>
    );
};

export default PDFFile;
