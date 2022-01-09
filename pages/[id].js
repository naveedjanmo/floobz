import { useRouter } from 'next/router'
import Head from 'next/head'

import { web3, contract, contractAddress } from '../lib/web3'

import { useState } from 'react'

import Navigation from '../components/Navigation'
import Universe from '../components/Universe'
import EthName from '../components/EthName'
import Modal from '../components/Modal'

function Planet({ metadata, opensea }) {
  const router = useRouter()
  let { id } = router.query
  id = parseInt(id)

  if (typeof document === "object") {
    document.documentElement.style.setProperty("--main-color", metadata.properties.mainColor)
  }

  let forSaleNotice = (
    <p>↳ Not for sale</p>
  )

  if (opensea.orders) {
    if (opensea.orders.length > 0) {
      const price = web3.utils.fromWei(opensea.orders[0].base_price, "ether")
      const address = opensea.orders[0].maker.address
  
      forSaleNotice = (
        <p className="left-p">↳ Currenty for sale on Opensea for {price} ETH by <EthName address={address} /></p>
      )
    }
  }

  

  let openSeaLink = `https://testnets.opensea.io/assets/${contractAddress}/${id}`

  const [showModal, setShowModal] = useState(false)

  const toggleModal  = () => {
    setShowModal((showModal) => !showModal) 
  }

  return (
    <>
        <Universe id={id} metadata={metadata} />

        <div className="mob-wrap">
          <Navigation id={id} total={5} />

          <section className="right">
              <a href={openSeaLink} target="_blank" rel="noreferrer" className="button"> 
                View on OpenSea
              </a>
              <a href={"#"} onClick={toggleModal} className="button-left">
                ?
              </a>
          </section>
        
          <section className="left">
            <h2>Floob #{id}</h2>

            {forSaleNotice}

          </section>

        </div>

        { showModal && <Modal toggleModal={toggleModal}/> }

        <Head>
          <title>Floobz – Floob #{id}</title>
        </Head>
    </>
  )
}

export async function getStaticPaths() {
  const paths = [1, 2, 3, 4, 5].map(id => {
    return { params: { id: id.toString() }}
  })

  return {
    paths: paths,
    fallback: true
  } 
}

export async function getStaticProps({ params }) {

  let token = await contract.methods.tokenURI(params.id).call()

  let metadataResponse = await fetch(token)
  let metadata = await metadataResponse.json()

  let openseaResponse = await fetch(`https://rinkeby-api.opensea.io/api/v1/asset/${contractAddress}/${params.id}`)
  let opensea = await openseaResponse.json()

  console.log(opensea)


  return {
    props: {
      metadata: metadata,
      opensea: opensea
    }
  }
}

export default Planet