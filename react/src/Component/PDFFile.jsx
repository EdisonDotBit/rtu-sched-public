import React from "react";
import {
    Page,
    Text,
    Image,
    Document,
    View,
    StyleSheet,
} from "@react-pdf/renderer";
import Logo from "../Component/Subcomponent/Asset/rtu_logo_v3.png";

// Define styles
const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        fontFamily: "Helvetica",
    },
    title: {
        fontSize: 15,
        fontWeight: "bold",
        textDecoration: "underline",
        textAlign: "left",
        marginBottom: 20,
    },
    primaryText: {
        fontSize: 10,
        marginBottom: 10,
        textAlign: "left",
    },
    secondaryText: {
        fontSize: 12,
        textDecoration: "underline",
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },
    imageContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: 20,
    },
    image: {
        width: 250,
        height: "auto",
    },
    paragraph: {
        marginBottom: 15,
    },
    bottomParagraph: {
        marginTop: 24,
        paddingTop: 8,
        borderTop: "1px solid black",
    },
    bulletList: {
        marginLeft: 20,
        fontSize: 8,
    },
    bulletItem: {
        fontSize: 8,
        marginBottom: 4,
    },
    link: {
        textDecoration: "underline",
        fontWeight: "bold",
        fontSize: 8,
        marginLeft: 20,
    },
    pageNumber: {
        position: "absolute",
        fontSize: 8,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "grey",
        fontStyle: "italic",
    },
});

const PDFFile = ({ succData }) => {
    return (
        <Document>
            <Page style={styles.body}>
                {/* Logo */}
                <View style={styles.imageContainer}>
                    <Image style={styles.image} src={Logo} />
                </View>

                {/* Title */}
                <Text style={styles.title}>RTU Appointment Slip</Text>

                {/* Appointment Number */}
                <View style={styles.paragraph}>
                    <Text style={styles.primaryText}>
                        Your Appointment Number is: {succData.aptid}
                    </Text>
                    <Text style={styles.primaryText}>
                        Print a copy of this page.
                    </Text>
                </View>

                {/* Personal Information */}
                <Text style={styles.secondaryText}>Personal Information</Text>
                <Text style={styles.primaryText}>
                    Student or ID Number / Type: {succData.aptstudnum}
                </Text>
                <Text style={styles.primaryText}>
                    Full Name: {succData.aptname}
                </Text>
                <Text style={styles.primaryText}>
                    Contact Number: {succData.aptpnumber}
                </Text>
                <Text style={styles.primaryText}>
                    Email Address: {succData.aptemail}
                </Text>

                {/* Appointment Information */}
                <Text style={styles.secondaryText}>
                    Appointment Information
                </Text>
                <Text style={styles.primaryText}>
                    Branch: {succData.aptbranch}
                </Text>
                <Text style={styles.primaryText}>
                    Office: {succData.aptoffice}
                </Text>
                <Text style={styles.primaryText}>
                    Purpose: {succData.aptpurpose}
                </Text>
                <Text style={styles.primaryText}>Date: {succData.aptdate}</Text>
                <Text style={styles.primaryText}>Time: {succData.apttime}</Text>

                {/* Reminder */}
                <View style={styles.bottomParagraph}>
                    <Text style={styles.primaryText}>Reminder:</Text>
                    <View style={styles.bulletList}>
                        <Text style={styles.bulletItem}>
                            • Bring your specified Valid ID / Soft Copy
                            Registration Form
                        </Text>
                        <Text style={styles.bulletItem}>
                            • If you miss the appointment on the said date, it
                            will be cancelled and disregarded.
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.pageNumber}>
                    "Forever true to the gold and blue~"
                </Text>
            </Page>
        </Document>
    );
};

export default PDFFile;
