// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Parite {
    event PariteVerifiee(uint256 nombre, bool estPair, address verificateur);

    function verifierParite(uint256 nombre) public returns (bool) {
        bool estPair = nombre % 2 == 0;
        emit PariteVerifiee(nombre, estPair, msg.sender);
        return estPair;
    }
}
