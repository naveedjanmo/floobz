import React from 'react';

const ModalComponent = ({toggleModal}) => (
    <>
        <div className="modal">
            <h1>Welcome to the Floobiverze</h1>
            <p className="p-pad">Floobz are a series of NFTs created using a combination of shaders for the web and Three.js. The animations are pulled directly from an NFT smart contract published on the Ethereum Rinkeby Test Network.</p>
            <p className="p-pad">I wrote the contracts in Solidity and built this app using React. View the repo <a href="https://github.com/naveedjan/floobz" target="_blank" rel="noreferrer">here</a>.</p>
            <p>Made by <a href="https://www.naveedjan.com/" target="_blank" rel="noreferrer">me</a>.</p>
        </div>
        
        <div className="background" onClick={toggleModal}></div>
    </>
    
    
    
)

export default ModalComponent