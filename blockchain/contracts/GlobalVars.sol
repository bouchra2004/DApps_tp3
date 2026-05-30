// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GlobalVars {
    address public dernierExpediteur;
    uint256 public dernierMontant;
    uint256 public totalDepots;

    event Depot(address indexed expediteur, uint256 montant, uint256 total);

    function deposer() public payable {
        require(msg.value > 0, "Le depot doit etre superieur a zero");
        dernierExpediteur = msg.sender;
        dernierMontant = msg.value;
        totalDepots += msg.value;
        emit Depot(msg.sender, msg.value, totalDepots);
    }

    function infosDernierDepot() public view returns (address expediteur, uint256 montant, uint256 total) {
        return (dernierExpediteur, dernierMontant, totalDepots);
    }
}
