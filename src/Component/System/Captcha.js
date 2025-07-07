import React, { useEffect, useRef } from 'react';
import { useDispatch } from "react-redux";
import { CaptchaKey } from '../../Services/Api';
import { setCaptchaToken } from '../../Redux/Actions/System/SessionAction';

const siteKey = CaptchaKey;

const Captcha = ({setCaptCha}) => {
    const widgetRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    
        script.onload = () => {
            if (window.turnstile && widgetRef.current) {
              window.turnstile.render(widgetRef.current, {
                sitekey: siteKey,
                callback: (token) => {
                  setCaptCha(token);
                  dispatch(setCaptchaToken(token));
                },
                'error-callback': (error) => {
                  console.error('Turnstile error:', error);
                },
              });
            }
          };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

  return (
    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <div ref={widgetRef}></div>
    </div>
  )
}

export default Captcha