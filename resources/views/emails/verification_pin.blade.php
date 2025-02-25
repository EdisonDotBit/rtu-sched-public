<!DOCTYPE html>
<html>

<head>
    <title>Verification PIN</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            padding: 20px;
        }

        .email-container {
            max-width: 500px;
            margin: auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border: 1px solid #ddd;
            overflow: hidden;
            text-align: center;
        }

        /* Header */
        .header {
            background-color: #194F90;
            color: white;
            font-size: 22px;
            font-weight: bold;
            padding: 15px 0;
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

        .pin {
            font-size: 28px;
            font-weight: bold;
            background: #194F90;
            color: white;
            display: inline-block;
            padding: 12px 24px;
            border-radius: 8px;
            letter-spacing: 5px;
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
            Welcome to RTU-SCHED
        </div>

        <div class="content">
            <!-- Message -->
            <p class="message">
                Please use the following PIN to verify your account:
            </p>

            <!-- PIN Display -->
            <div class="pin">{{ $pin }}</div>

            <!-- Thank You Message -->
            <p class="thank-you">Thank you!</p>

            <!-- Instructions -->
            <p class="instructions">
                If you didn't request this, you can ignore this email.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            &copy; {{ date('Y') }} RTU-SCHED. All rights reserved.
        </div>
    </div>

</body>

</html>