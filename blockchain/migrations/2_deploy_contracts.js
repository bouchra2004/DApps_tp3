const Somme = artifacts.require("Somme");
const Conversion = artifacts.require("Conversion");
const Chaines = artifacts.require("Chaines");
const Signe = artifacts.require("Signe");
const Parite = artifacts.require("Parite");
const Tableaux = artifacts.require("Tableaux");
const Geometrie = artifacts.require("Geometrie");
const GlobalVars = artifacts.require("GlobalVars");

module.exports = async function (deployer) {
  await deployer.deploy(Somme);
  await deployer.deploy(Conversion);
  await deployer.deploy(Chaines);
  await deployer.deploy(Signe);
  await deployer.deploy(Parite);
  await deployer.deploy(Tableaux);
  await deployer.deploy(Geometrie);
  await deployer.deploy(GlobalVars);
};
