// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Conversion {
    function weiEnEther(uint256 montantWei) public pure returns (uint256) {
        return montantWei / 1 ether;
    }

    function etherEnWei(uint256 montantEther) public pure returns (uint256) {
        return montantEther * 1 ether;
    }

    function weiEnGwei(uint256 montantWei) public pure returns (uint256) {
        return montantWei / 1 gwei;
    }
}
