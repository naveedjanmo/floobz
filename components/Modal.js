import React from 'react';

const ModalComponent = ({toggleModal}) => (
    <>
        <div className="modal">
            <h1>Welcome to the Floobiverze</h1>
            <p className="p-pad">The things floobing around in the background are called Floobz. I made them using a combination of shaders for the web and Three.js.</p>
            <p className="p-pad">They are NFTs available for purchase on OpenSea. I wrote the smart contracts in Solidity and built the app using React and Next.</p>
            <p>Made by <a href="https://www.naveedjan.com/" target="_blank" rel="noreferrer">me</a>.</p>
        </div>
        
        <div className="background" onClick={toggleModal}></div>
    </>
    
    
    
)

export default ModalComponent