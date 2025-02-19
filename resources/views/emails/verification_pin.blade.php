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
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .pin {
            font-size: 28px;
            font-weight: bold;
            color: #194F90;
            margin: 20px 0;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <h2>Hello,</h2>
        <p>Your verification PIN is:</p>
        <h1 class="pin">{{ $pin }}</h1>
        <p>Please enter this PIN in the system to complete your registration.</p>
    </div>
</body>

</html>