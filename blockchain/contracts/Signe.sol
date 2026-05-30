// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Signe {
    function verifierSigne(int256 nombre) public pure returns (string memory) {
        if (nombre > 0) {
            return "Positif";
        }
        if (nombre < 0) {
            return "Negatif";
        }
        return "Nul";
    }
}
