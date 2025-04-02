<!DOCTYPE html>
<html>

<head>
    <title>Appointment Confirmation</title>
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

        .details {
            font-size: 14px;
            color: #333;
            text-align: left;
            margin-bottom: 15px;
            line-height: 1.5;
        }

        .details ul {
            list-style-type: none;
            padding: 0;
        }

        .details ul li {
            margin-bottom: 10px;
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
            Appointment Confirmation
        </div>

        <div class="content">
            <!-- Message -->
            <p class="message">
                Dear {{ $appointment->aptname }},
            </p>

            <p class="message">
                Your appointment has been confirmed. Please find the details below:
            </p>

            <!-- Appointment Details -->
            <div class="details">
                <ul>
                    <li><strong>Appointment No:</strong> {{ $appointment->aptid }}</li>
                    <li><strong>ID No:</strong> {{ $appointment->aptstudnum }}</li>
                    <li><strong>Type:</strong> {{ $appointment->apttype }}</li>
                    <li><strong>Branch:</strong> {{ $appointment->aptbranch }}</li>
                    <li><strong>Office:</strong> {{ $appointment->aptoffice }}</li>
                    <li><strong>Purpose:</strong> {{ $appointment->aptpurpose }}</li>
                    <li><strong>Date:</strong> {{ $appointment->aptdate }}</li>
                    <li><strong>Time:</strong> {{ $appointment->apttime }}</li>
                </ul>
            </div>

            <!-- Thank You Message -->
            <p class="thank-you">Thank you!</p>

            <!-- Instructions -->
            <p class="instructions">
                Please find and print the attached PDF before going to the appointed office.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            &copy; {{ date('Y') }} RTU-SCHED. All rights reserved.
        </div>
    </div>

</body>

</html>