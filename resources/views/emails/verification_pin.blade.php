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
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border: 1px solid #ddd;
        }

        .logo-container {
            margin-bottom: 15px;
        }

        .logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        .heading {
            font-size: 22px;
            font-weight: bold;
            color: #333;
        }

        .message {
            font-size: 16px;
            color: #555;
            margin-top: 10px;
        }

        .pin {
            font-size: 32px;
            font-weight: bold;
            background: #194F90;
            color: white;
            display: inline-block;
            padding: 10px 20px;
            border-radius: 8px;
            margin-top: 15px;
            letter-spacing: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        .instructions {
            font-size: 14px;
            color: #777;
            margin-top: 15px;
            line-height: 1.5;
        }

        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Logo -->
        <!-- <div class="logo-container">
            <img src="{{ url('images/rtu_logo_v3.png') }}" alt="RTU-SCHED Logo" class="logo">
        </div> -->

        <!-- Greeting -->
        <!-- Greeting -->
        <h2 class="heading">Hello Student</h2>
        <p class="message">Welcome to RTU-SCHED! Your verification PIN is:</p>


        <!-- PIN Display -->
        <h1 class="pin">{{ $pin }}</h1>

        <!-- Instructions -->
        <p class="instructions">
            Please enter this PIN to complete your registration.
            <br>
            If you didn't request this, you can ignore this email.
        </p>

        <!-- Footer -->
        <div class="footer">
            &copy; {{ date('Y') }} RTU-SCHED. All rights reserved.
        </div>
    </div>
</body>

</html>