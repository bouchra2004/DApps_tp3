# DApps_tp3 - Dashboard Blockchain et Web3

Projet de fin de module **Blockchain et Web3** pour la filiere **CI-ILIA (S4)** de l'Universite Moulay Ismail.

Ce projet est une dApp moderne sous forme de dashboard permettant d'interagir avec les contrats Solidity du TP3. Il utilise **Truffle**, **Ganache**, **ReactJS avec Vite**, **Tailwind CSS**, **React Router** et **Web3.js**.

## Fonctionnalites

- Dashboard React moderne et responsive.
- 8 exercices Solidity deployables avec Truffle.
- Connexion a Ganache via `http://127.0.0.1:7545`.
- Chargement automatique des ABI depuis `blockchain/build/contracts`.
- Interaction avec les contrats via des formulaires.
- Affichage des informations blockchain :
  - URL RPC
  - Network ID
  - adresse du contrat
  - compte connecte
  - details du dernier bloc
- Affichage des details de la derniere transaction envoyee :
  - hash
  - from / to
  - nonce
  - montant
  - gas
  - statut
  - bloc
  - fonction appelee
  - nom du contrat

## Structure du projet

```text
DApp_tp3/
  truffle-config.js
  blockchain/
    truffle-config.js
    contracts/
      Somme.sol
      Conversion.sol
      Chaines.sol
      Signe.sol
      Parite.sol
      Tableaux.sol
      Geometrie.sol
      GlobalVars.sol
    migrations/
      2_deploy_contracts.js
    build/contracts/
  frontend/
    package.json
    vite.config.js
    tailwind.config.js
    postcss.config.js
    src/
      context/Web3Context.jsx
      components/
      pages/
      data/
      utils/
```

## Prerequis

Installer les outils suivants :

- **Node.js** : version 18 ou plus recommandee.
- **npm** : installe avec Node.js.
- **Ganache** : application desktop ou CLI.
- **Truffle** :

```bash
npm install -g truffle
```

Optionnel :

- **MetaMask** pour tester avec un wallet navigateur.

## Configuration Ganache

Ouvrir Ganache et verifier :

- RPC Server : `HTTP://127.0.0.1:7545`
- Network ID recommande : `1337`

Le projet accepte aussi `5777`, qui est le Network ID par defaut de certaines versions de Ganache.

Si vous utilisez MetaMask :

1. Ajouter un reseau manuel.
2. RPC URL : `http://127.0.0.1:7545`
3. Chain ID : `1337` ou `5777` selon votre Ganache.
4. Importer un compte Ganache avec sa cle privee.

## Installation

Depuis la racine du projet :

```bash
cd DApp_tp3
```

Installer les dependances frontend :

```bash
cd frontend
npm install
```

Revenir a la racine :

```bash
cd ..
```

## Compiler les contrats

Depuis la racine :

```bash
npx truffle compile
```

Les fichiers ABI seront generes dans :

```text
blockchain/build/contracts/
```

## Deployer les contrats

Si Ganache utilise le Network ID `1337` :

```bash
npx truffle migrate --network development --reset --compile-all
```

Si Ganache utilise le Network ID `5777` :

```bash
npx truffle migrate --network ganache --reset --compile-all
```

Apres la migration, chaque contrat aura une adresse dans les fichiers JSON du dossier :

```text
blockchain/build/contracts/
```

## Lancer le frontend

Depuis le dossier `frontend` :

```bash
cd frontend
npm run dev
```

Ouvrir ensuite :

```text
http://127.0.0.1:5173/
```

## Tester la dApp

### Exemple avec Somme

1. Ouvrir `Exercice 1 - Somme`.
2. Saisir deux nombres.
3. Cliquer sur `Executer`.
4. Le resultat s'affiche dans la carte `Resultat`.

Important : `Somme` utilise un appel `call`, donc aucune transaction n'est creee. La section `Transactions` peut rester en `N/A`.

### Tester les details de transaction

Pour remplir la section `Transactions`, il faut appeler une fonction qui modifie la blockchain.

Exemples :

- `Chaines` -> `Definir le message`
- `Parite` -> `Verifier et emettre`
- `Tableaux` -> `Ajouter un nombre`
- `Geometrie` -> `Definir rectangle`
- `GlobalVars` -> `Deposer Ether`

Apres confirmation de la transaction, la carte `Transactions` affiche les details reels : hash, from, to, gas, statut, bloc, fonction appelee, etc.

## Commandes utiles

Compiler :

```bash
npx truffle compile
```

Migrer sur Network ID 1337 :

```bash
npx truffle migrate --network development --reset --compile-all
```

Migrer sur Network ID 5777 :

```bash
npx truffle migrate --network ganache --reset --compile-all
```

Lancer React :

```bash
cd frontend
npm run dev
```

Verifier le build :

```bash
cd frontend
npm run build
```

Verifier le lint :

```bash
cd frontend
npm run lint
```

## Depannage

### Erreur : Contrat introuvable. Lancez truffle migrate.

Cela signifie que les contrats ne sont pas encore deployes sur le Network ID utilise par Ganache.

Solution :

```bash
npx truffle migrate --network development --reset --compile-all
```

ou, si Ganache affiche `5777` :

```bash
npx truffle migrate --network ganache --reset --compile-all
```

### Erreur : Couldn't connect to node http://127.0.0.1:7545

Ganache n'est pas ouvert ou le port n'est pas correct.

Solution :

- ouvrir Ganache,
- verifier que le RPC est `http://127.0.0.1:7545`,
- relancer la migration.

### Erreur : invalid opcode while deploying

Certaines versions de Ganache ne supportent pas le bytecode Solidity recent.

Le projet est deja configure avec :

```js
evmVersion: "paris"
```

Si l'erreur persiste, relancer :

```bash
npx truffle migrate --network ganache --reset --compile-all
```

### La page ne s'affiche pas sur localhost

Utiliser directement :

```text
http://127.0.0.1:5173/
```

Le script `npm run dev` est configure pour lancer Vite sur `127.0.0.1`.

## Technologies utilisees

- Solidity `^0.8.0`
- Truffle
- Ganache
- ReactJS
- Vite
- Tailwind CSS
- React Router
- Web3.js
- Lucide React

## Auteur

Projet realise pour le TP3 du module **Blockchain et Web3**.
