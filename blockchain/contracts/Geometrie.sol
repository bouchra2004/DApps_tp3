// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Geometrie {
    struct Forme {
        uint256 longueur;
        uint256 largeur;
    }

    Forme private rectangle;

    function definirRectangle(uint256 longueur, uint256 largeur) public {
        rectangle = Forme(longueur, largeur);
    }

    function obtenirRectangle() public view returns (uint256 longueur, uint256 largeur) {
        return (rectangle.longueur, rectangle.largeur);
    }

    function surface() public view returns (uint256) {
        return rectangle.longueur * rectangle.largeur;
    }

    function perimetre() public view returns (uint256) {
        return 2 * (rectangle.longueur + rectangle.largeur);
    }

    function calculerSurface(uint256 longueur, uint256 largeur) public pure returns (uint256) {
        return longueur * largeur;
    }

    function calculerPerimetre(uint256 longueur, uint256 largeur) public pure returns (uint256) {
        return 2 * (longueur + largeur);
    }
}
