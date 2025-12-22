<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $payment->transaction_id }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            direction: ltr;
            color: #555;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .invoice-box {
            max-width: 800px;
            margin: 40px auto;
            padding: 30px;
            border: 1px solid #eee;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, .15);
            font-size: 16px;
            line-height: 24px;
        }
        .invoice-box table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
        .invoice-box table td { padding: 8px; vertical-align: top; }
        .invoice-box table tr.top table td { padding-bottom: 20px; }
        .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
        .invoice-box table tr.item td { border-bottom: 1px solid #eee; }
        .invoice-box table tr.total td:nth-child(2) { border-top: 2px solid #eee; font-weight: bold; }

        .header-title { color: #333; font-size: 28px; font-weight: bold; }

        /* Status Badges */
        .badge {
            padding: 5px 12px;
            border-radius: 4px;
            font-size: 13px;
            color: white;
            font-weight: bold;
            display: inline-block;
            text-transform: uppercase;
            margin-top: 5px;
        }
        .status-paid { background-color: #28a745; }
        .status-pending { background-color: #ffc107; color: #333; }
        .status-refunded { background-color: #dc3545; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
            <tr class="top">
                <td colspan="2">
                    <table>
                        <tr>
                            <td class="header-title">Payment Invoice</td>
                            <td style="text-align: right;">
                                <strong>Transaction ID:</strong> {{ $payment->transaction_id }}<br>
                                <strong>Date:</strong> {{ $payment->created_at->format('Y-m-d') }}<br>
                                <div>
                                    @if($payment->status == 'paid')
                                        <span class="badge status-paid">Paid</span>
                                    @elseif($payment->status == 'pending')
                                        <span class="badge status-pending">Pending</span>
                                    @elseif($payment->status == 'refunded')
                                        <span class="badge status-refunded">Refunded</span>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="information">
                <td colspan="2">
                    <table style="margin-bottom: 20px;">
                        <tr>
                            <td>
                                <strong>Client:</strong><br>
                                {{ $payment->client->name }}<br>
                                {{ $payment->client->email }}
                            </td>
                            <td style="text-align: right;">
                                <strong>Provider:</strong><br>
                                {{ $payment->provider->name }}<br>
                                {{ $payment->provider->email }}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="heading">
                <td>Service Description</td>
                <td style="text-align: right;">Amount</td>
            </tr>

            <tr class="item">
                <td>Programming & Design Services</td>
                <td style="text-align: right;">${{ number_format($payment->amount, 2) }}</td>
            </tr>

            <tr class="total">
                <td></td>
                <td style="text-align: right;">
                   Total Amount: ${{ number_format($payment->amount, 2) }}
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
