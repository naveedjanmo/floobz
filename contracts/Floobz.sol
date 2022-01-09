// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Floobz is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Floobz", "FLBZ") {
        _createPlanet(
            msg.sender,
            1,
            "QmU3oyoURBdaYQT5AVAQRbRecj2ysbbZrxnnrrDHTj4wnj"
        );
        _createPlanet(
            msg.sender,
            2,
            "Qmakn4Rw5SSYaNoeELxBwSqfofKRwisZnGeDGtX8Zc7oSW"
        );
        _createPlanet(
            msg.sender,
            3,
            "QmcbjHhMqizagspEtBsxDpWZRfbCUF912925o1qkLkNN4M"
        );
        _createPlanet(
            msg.sender,
            4,
            "QmTQCGEe8ZuYRxEbSppPz5vpZoRaWUU5VjtpvC9SU49sr6"
        );
        _createPlanet(
            msg.sender,
            5,
            "QmbLf6QPv7HhcneAiTRyCHPDEZhvsaqqavGexFwB25ivMg"
        );
    }

    function _createPlanet(
        address to,
        uint256 id,
        string memory url
    ) private returns (bool) {
        _safeMint(to, id);
        _setTokenURI(id, url);
        return true;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
