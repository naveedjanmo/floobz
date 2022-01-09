import Web3 from 'web3'
import Floobz from './Floobz.json'

let web3 = new Web3("https://rinkeby.infura.io/v3/e71c46e9c24d4c4eb89f5b94a0e568d6")

const contractAddress = "0x11581879d8a65A58BC2eCaa2BB29cCcAa2106Ca8"
const contract = new web3.eth.Contract(Floobz.abi, contractAddress)

export { web3, contract, contractAddress }