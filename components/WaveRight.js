import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../public/lotties/wave1.json';

const Wave = function ({}) {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
        };
    
    return (
        <>

            <div className="wave-right">
                <Lottie 
                     options={defaultOptions}
                />
            </div>
        </>
    );
}
  
  export default Wave;