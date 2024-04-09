import React, { useEffect } from 'react';

function onPaymentSuccess(){
    alert('success')
}
function onPaymentError(){
    alert('error')
}
const GooglePayButton = () => {
  useEffect(() => {
    // Load Google Pay API library
    const script = document.createElement('script');
    script.src = 'https://pay.google.com/gp/p/js/pay.js';
    script.onload = () => {
      initializeGooglePay();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGooglePay = () => {
    // Check if the browser supports the Google Pay API
    if (window.google && window.google.payments) {
      const paymentsClient = new window.google.payments.api.PaymentsClient({
        environment: 'TEST', // Use 'PRODUCTION' for live transactions
      });

      // Create a Google Pay button
      const button = paymentsClient.createButton({
        onClick: () => {
          const paymentDataRequest = {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
              {
                type: 'UPI',
                parameters: {
                  payeeId: '', // Replace with your merchant ID
                },
                tokenizationSpecification: {
                  type: 'DIRECT',
                },
              },
            ],
            merchantInfo: {
              merchantName: '',
            },
            transactionInfo: {
              totalPriceStatus: 'FINAL',
              totalPrice: '10',
              currencyCode: 'INR', // Replace with your currency code
            },
          };

          paymentsClient.loadPaymentData(paymentDataRequest)
            .then((paymentData) => {
              // Handle successful payment
              onPaymentSuccess(paymentData);
            })
            .catch((error) => {
              // Handle payment error
              onPaymentError(error);
            });
        },
      });

      // Attach the button to the DOM
      const containerElement = document.getElementById('google-pay-container'); // Replace with the ID of your container element
      containerElement.appendChild(button);
    } else {
      console.error('Google Pay API not available');
    }
  };

  return <div id="google-pay-container" />;
};

export default GooglePayButton;
