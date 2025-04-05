<!DOCTYPE html>
<html>

<head>
    <title>RTU Appointment Slip</title>
    <style>
        .body {
            padding-top: 35px;
            padding-bottom: 65px;
            font-family: Helvetica, sans-serif;
            text-align: center;
        }

        .title {
            margin: 12px;
            margin-bottom: 16px;
            font-size: 24px;
            text-align: left;
            font-weight: bold;
            text-decoration: underline;
        }

        .primaryText {
            margin: 14px;
            margin-bottom: 2px;
            font-size: 14px;
            text-align: justify;
        }

        .secondaryText {
            margin: 14px;
            font-size: 16px;
            text-align: justify;
        }

        .image-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
        }

        .image {
            width: 350px;
            height: auto;
        }

        .pageNumber {
            position: absolute;
            font-size: 12px;
            bottom: 30px;
            left: 0;
            right: 0;
            text-align: center;
            color: grey;
            font-style: italic;
        }

        .column {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .row {
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 60px;
        }

        .bottomParagraph {
            margin-top: 24px;
            border-top-width: 1px;
            border-top-color: black;
            padding-top: 8px;
            text-align: left;
        }

        .paragraph {
            margin-top: 10px;
            border-top-width: 1px;
            border-top-color: black;
            padding-top: 8px;
        }

        .bottomText {
            font-size: 12px;
            text-align: center;
        }

        .bulletList {
            margin-left: 20px;
        }

        .bulletItem {
            font-size: 10px;
            margin-bottom: 4px;
        }

        .link {
            text-decoration: underline;
            font-weight: bold;
            font-size: 12px;
            margin-left: 20px;
        }
    </style>
</head>

<body>
    <div class="body">
        <div class="image-container">
            <img class="image" src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/rtu_logo_v3.png'))) }}" alt="RTU Logo">
        </div>

        <div class="row" style="justify-content: left;">
            <div class="title" style="font-size: 24px;">RTU Appointment Slip</div>
        </div>
        <div class="paragraph">
            <div class="primaryText">Your Appointment Number is: {{ $appointment->aptid }}</div>
            <div class="primaryText">Print a copy of this page.</div>

            <div class="secondaryText" style="margin-top: 24px; text-decoration: underline; font-weight: bold;">Personal Information</div>
            <div class="primaryText">Student or ID Number / ID Type: {{ $appointment->aptstudnum }}</div>
            <div class="primaryText">Type: {{ $appointment->apttype }}</div>
            <div class="primaryText">Full Name: {{ $appointment->aptname }}</div>
            <div class="primaryText">Contact Number: {{ $appointment->aptpnumber }}</div>
            <div class="primaryText">Email Address: {{ $appointment->aptemail }}</div>

            <div class="secondaryText" style="margin-top: 24px; text-decoration: underline; font-weight: bold;">Appointment Information</div>
            <div class="column">
                <div class="primaryText">Branch: {{ $appointment->aptbranch }}</div>
                <div class="primaryText">Office: {{ $appointment->aptoffice }}</div>
                <div class="primaryText">Purpose: {{ $appointment->aptpurpose }}</div>
                <div class="primaryText">Date: {{ $appointment->aptdate }}</div>
                <div class="primaryText">Time: {{ $appointment->apttime }}</div>
            </div>

            <div class="bottomParagraph">
                <div class="primaryText">Reminder:</div>
                <div class="bulletList">
                    <div class="bulletItem">• Bring your specified Valid ID / Soft Copy Registration Form</div>
                    <div class="bulletItem">• If you miss the appointment on the said date, it will be cancelled and disregarded.</div>
                </div>
            </div>
        </div>
        <div class="pageNumber" style="font-style: italic;">"Forever true to the gold and blue~"</div>
    </div>
</body>

</html>