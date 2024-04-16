import React, { useState, useEffect } from 'react';

const DonateButton = () => {
  const [paypalReady, setPaypalReady] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true); // State to control button visibility

  useEffect(() => {
    const scriptId = 'paypal-sdk-script';

    if (document.getElementById(scriptId)) {
      setPaypalReady(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = "https://www.paypal.com/sdk/js?client-id=AWs21KYsOBl0DAJgoHbmakQAwNpRnaJuhxSccRfpEDK2Qks25yIg1A_yaWllDWO-mo_-BzyqEgYELi-h&vault=true&intent=subscription";
    script.async = true;
    script.onload = () => {
      setPaypalReady(true);
      if (window.paypal) {
        window.paypal.Buttons({
          style: {
            color: 'blue',
            label: 'subscribe',
            height: 55
          },
          createSubscription: function(data, actions) {
            return actions.subscription.create({
              'plan_id': 'P-34C9109237094743BMYOTIUA'
            });
          },
          onApprove: function(data, actions) {
            alert('You have successfully created a subscription!');
            setButtonVisible(false); // Optionally hide the custom button after approval
          }
        }).render('#paypal-button-container');
      }
    };
    script.onerror = () => {
      console.error('PayPal SDK could not be loaded.');
    };
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <div id="donate-button-container" style={{position:"relative", height:"2em", width:"7em", overflow:'hidden', borderRadius:'10px'}} onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 20px purple';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
        {buttonVisible && (
          <button
            id="custom-button"
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              height: '100%',
              background: 'transparent',
              padding: '0',
              outline: 'none',
              backgroundImage: 'url(./donate-button.png)',
              backgroundSize: '100%',
              zIndex: '500',
              pointerEvents: 'none'
            }}
          >
          </button>
        )}<div id="paypal-button-container" style={{width:"7em"}}></div>
      </div>
    </>
  );
};

export default DonateButton;