// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tableaux {
    uint256[] private nombres;

    function ajouter(uint256 nombre) public {
        nombres.push(nombre);
    }

    function lire(uint256 index) public view returns (uint256) {
        require(index < nombres.length, "Index hors limites");
        return nombres[index];
    }

    function taille() public view returns (uint256) {
        return nombres.length;
    }

    function obtenirTout() public view returns (uint256[] memory) {
        return nombres;
    }
}
