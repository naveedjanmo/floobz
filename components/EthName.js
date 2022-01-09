const EthName = function ({ address }) {
  let formatted = "&mdash;"
  if (address) {
    formatted = address.substr(0, 8) + "…" + address.substr(-4)
    formatted = formatted.toLowerCase()
  } 

  return (
    <abbr className="eth-name" title={address}>{formatted}</abbr>
  )
}

export default EthName;