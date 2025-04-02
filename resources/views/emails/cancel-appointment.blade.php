<!DOCTYPE html>
<html>

<head>
    <title>Appointment Cancellation Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            padding: 20px;
        }

        .email-container {
            max-width: 600px;
            margin: auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border: 1px solid #ddd;
            overflow: hidden;
        }

        .header {
            background-color: #194F90;
            color: white;
            font-size: 22px;
            font-weight: bold;
            padding: 15px 0;
            text-align: center;
        }

        .content {
            padding: 25px;
            text-align: left;
        }

        .appointment-details {
            background-color: #f9f9f9;
            border-left: 4px solid #194F90;
            padding: 15px;
            margin: 15px 0;
        }

        .reason-list {
            margin: 20px 0 20px 20px;
        }

        .reason-item {
            margin-bottom: 10px;
            position: relative;
            padding-left: 25px;
        }

        .reason-item:before {
            content: "•";
            color: #194F90;
            font-weight: bold;
            position: absolute;
            left: 0;
        }

        .footer {
            background-color: #f9f9f9;
            padding: 15px;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #ddd;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            Appointment Cancellation Notification
        </div>

        <div class="content">
            <p>Dear {{ $appointment->aptname }},</p>

            <p>We regret to inform you that your scheduled appointment has been cancelled. Please review the details below:</p>

            <div class="appointment-details">
                <strong>Appointment Details:</strong><br>
                Appointment No: {{ $appointment->aptid }}<br>
                ID No: {{ $appointment->aptstudnum }}<br>
                Type: {{ $appointment->apttype }}<br>
                Branch: {{ $appointment->aptbranch }}<br>
                Office: {{ $appointment->aptoffice }}<br>
                Purpose: {{ $appointment->aptpurpose }}<br>
                Date: {{ $appointment->aptdate }}<br>
                Time: {{ $appointment->apttime }}<br>

            </div>

            <p><strong>Possible reasons for cancellation:</strong></p>
            <div class="reason-list">
                <div class="reason-item">Incomplete or invalid appointment information.</div>
                <div class="reason-item">Unforeseen office closure or unavailability</div>
                <div class="reason-item">Staff emergency or unavailability.</div>
                <div class="reason-item">Technical or system issues preventing service delivery.</div>
                <div class="reason-item">Duplicate appointment request.</div>
                <div class="reason-item">University-wide closure or emergency.</div>
            </div>

            <p>We sincerely apologize for any inconvenience this may cause. You may now schedule your appointment at your earliest convenience through our online portal.</p>
        </div>

        <div class="footer">
            © {{ date('Y') }} Rizal Technological University - Appointment System. All rights reserved.<br>
            This is an automated message - please do not reply directly to this email.
        </div>
    </div>
</body>

</html>