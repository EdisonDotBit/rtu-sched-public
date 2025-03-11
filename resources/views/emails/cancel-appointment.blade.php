<!DOCTYPE html>
<html>

<head>
    <title>Appointment Cancelled</title>
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

        /* Header */
        .header {
            background-color: #194F90;
            color: white;
            font-size: 22px;
            font-weight: bold;
            padding: 15px 0;
            text-align: center;
            text-transform: uppercase;
        }

        .content {
            padding: 20px;
        }

        .message {
            font-size: 16px;
            color: #333;
            margin-bottom: 15px;
        }

        .thank-you {
            font-size: 16px;
            color: #333;
            font-weight: bold;
            margin-top: 15px;
        }

        .instructions {
            font-size: 14px;
            color: #777;
            margin-top: 10px;
            line-height: 1.5;
        }

        .footer {
            background-color: #f9f9f9;
            padding: 10px;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #ddd;
            margin-top: 20px;
        }
    </style>
</head>

<body>

    <div class="email-container">
        <!-- Header -->
        <div class="header">
            Appointment Cancelled
        </div>

        <div class="content">
            <!-- Message -->
            <p class="message">
                Dear {{ $appointment->aptname }},
            </p>

            <p class="message">
                We regret to inform you that your appointment has been cancelled due to several reasons.
            </p>

            <p class="thank-you">
                Thank you for using our service.
            </p>

            <!-- Instructions -->
            <p class="instructions">
                If you have any questions, please contact us.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            &copy; {{ date('Y') }} RTU-SCHED. All rights reserved.
        </div>
    </div>

</body>

</html>