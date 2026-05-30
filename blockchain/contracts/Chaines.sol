// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Chaines {
    string private message;

    function definirMessage(string memory nouveauMessage) public {
        message = nouveauMessage;
    }

    function obtenirMessage() public view returns (string memory) {
        return message;
    }

    function longueur(string memory texte) public pure returns (uint256) {
        return bytes(texte).length;
    }

    function concatener(string memory a, string memory b) public pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }

    function comparer(string memory a, string memory b) public pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }

    function decouper(string memory texte, uint256 debut, uint256 fin) public pure returns (string memory) {
        bytes memory source = bytes(texte);
        require(debut <= fin, "Indice debut invalide");
        require(fin <= source.length, "Indice fin hors limites");

        bytes memory resultat = new bytes(fin - debut);
        for (uint256 i = debut; i < fin; i++) {
            resultat[i - debut] = source[i];
        }
        return string(resultat);
    }
}
