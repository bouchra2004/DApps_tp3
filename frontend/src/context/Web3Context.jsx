/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Web3 from 'web3'

const RPC_URL = 'http://127.0.0.1:7545'
const EXPECTED_NETWORK_ID = '1337'
const SUPPORTED_NETWORK_IDS = ['1337', '5777']
const artifactModules = import.meta.glob('../../../blockchain/build/contracts/*.json', { eager: true })

const Web3Context = createContext(null)

function normalizeArtifact(module) {
  return module.default ?? module
}

function getArtifacts() {
  return Object.entries(artifactModules).reduce((acc, [path, module]) => {
    const name = path.split('/').pop().replace('.json', '')
    acc[name] = normalizeArtifact(module)
    return acc
  }, {})
}

function getFunctionSignature(artifact, methodName) {
  const entry = artifact?.abi?.find((item) => item.type === 'function' && item.name === methodName)
  if (!entry) return methodName
  const params = entry.inputs?.map((input) => `${input.name || 'param'}: ${input.type}`).join(', ') ?? ''
  return `${methodName}(${params})`
}

async function enrichReceipt(web3, receipt, contractData, methodName, transactionNumber) {
  if (!receipt?.transactionHash) return null
  const tx = await web3.eth.getTransaction(receipt.transactionHash)
  const block = receipt.blockNumber ? await web3.eth.getBlock(receipt.blockNumber) : null
  const balanceAfterWei = tx?.from ? await web3.eth.getBalance(tx.from, receipt.blockNumber ?? 'latest') : null

  return {
    number: transactionNumber,
    hash: receipt.transactionHash,
    from: tx?.from ?? receipt.from,
    to: tx?.to ?? receipt.to,
    nonce: tx?.nonce,
    valueWei: tx?.value ?? '0',
    gasPriceWei: tx?.gasPrice,
    gasLimit: tx?.gas,
    gasUsed: receipt.gasUsed,
    balanceAfterWei,
    status: Boolean(receipt.status),
    blockNumber: receipt.blockNumber,
    timestamp: block?.timestamp,
    functionName: getFunctionSignature(contractData?.artifact, methodName),
    contractName: contractData?.name ? `${contractData.name}.sol` : 'N/A',
  }
}

export function Web3Provider({ children }) {
  const [web3, setWeb3] = useState(null)
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('0')
  const [networkId, setNetworkId] = useState('')
  const [contracts, setContracts] = useState({})
  const [lastBlock, setLastBlock] = useState(null)
  const [lastTransaction, setLastTransaction] = useState(null)
  const [transactionCount, setTransactionCount] = useState(0)
  const [status, setStatus] = useState('Initialisation Web3...')
  const [error, setError] = useState('')

  const refreshBalance = useCallback(async (client, currentAccount) => {
    if (!client || !currentAccount) return
    const wei = await client.eth.getBalance(currentAccount)
    setBalance(Number(client.utils.fromWei(wei, 'ether')).toFixed(4))
  }, [])

  const loadContracts = useCallback((client, id) => {
    const artifacts = getArtifacts()
    const loaded = {}

    Object.entries(artifacts).forEach(([name, artifact]) => {
      const address = artifact.networks?.[id]?.address
      if (address) {
        loaded[name] = {
          name,
          address,
          artifact,
          instance: new client.eth.Contract(artifact.abi, address),
        }
      }
    })

    setContracts(loaded)
    return loaded
  }, [])

  const refreshBlock = useCallback(async (client) => {
    if (!client) return
    const block = await client.eth.getBlock('latest')
    setLastBlock(block)
  }, [])

  const initialize = useCallback(async ({ requestAccounts = false } = {}) => {
    try {
      setError('')
      const provider = window.ethereum ?? new Web3.providers.HttpProvider(RPC_URL)
      const client = new Web3(provider)
      setWeb3(client)

      let accounts = []
      if (window.ethereum && requestAccounts) {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      } else {
        accounts = await client.eth.getAccounts()
      }

      const id = String(await client.eth.net.getId())
      setNetworkId(id)
      const currentAccount = accounts[0] ?? ''
      setAccount(currentAccount)
      await refreshBalance(client, currentAccount)
      loadContracts(client, id)
      await refreshBlock(client)
      setStatus(SUPPORTED_NETWORK_IDS.includes(id) ? `Connecte a Ganache ${id}` : `Reseau detecte: ${id}`)
    } catch (err) {
      setError(err.message)
      setStatus('Connexion Web3 indisponible')
    }
  }, [loadContracts, refreshBalance, refreshBlock])

  useEffect(() => {
    // Web3 is an external system; the initial sync belongs in this provider effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initialize()
  }, [initialize])

  useEffect(() => {
    if (!web3) return undefined
    const timer = window.setInterval(() => {
      refreshBlock(web3)
      refreshBalance(web3, account)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [account, refreshBalance, refreshBlock, web3])

  useEffect(() => {
    if (!window.ethereum) return undefined

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0] ?? '')
      if (web3 && accounts[0]) refreshBalance(web3, accounts[0])
    }
    const handleChainChanged = () => initialize()

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [initialize, refreshBalance, web3])

  const callMethod = useCallback(async (contractName, methodName, args = []) => {
    const contract = contracts[contractName]?.instance
    if (!contract) throw new Error(`Contrat ${contractName} introuvable. Lancez truffle migrate.`)
    return contract.methods[methodName](...args).call()
  }, [contracts])

  const sendMethod = useCallback(async (contractName, methodName, args = [], options = {}) => {
    const contractData = contracts[contractName]
    const contract = contractData?.instance
    if (!contract) throw new Error(`Contrat ${contractName} introuvable. Lancez truffle migrate.`)
    if (!account) throw new Error('Aucun compte disponible')

    const receipt = await contract.methods[methodName](...args).send({
      from: account,
      value: options.value ?? '0',
    })
    const nextTransactionNumber = transactionCount + 1
    const enriched = await enrichReceipt(web3, receipt, contractData, methodName, nextTransactionNumber)
    setLastTransaction(enriched)
    setTransactionCount(nextTransactionNumber)
    await refreshBlock(web3)
    await refreshBalance(web3, account)
    return receipt
  }, [account, contracts, refreshBalance, refreshBlock, transactionCount, web3])

  const value = useMemo(() => ({
    account,
    balance,
    callMethod,
    connectWallet: () => initialize({ requestAccounts: true }),
    contracts,
    error,
    expectedNetworkId: EXPECTED_NETWORK_ID,
    supportedNetworkIds: SUPPORTED_NETWORK_IDS,
    lastBlock,
    lastTransaction,
    networkId,
    rpcUrl: RPC_URL,
    sendMethod,
    status,
    web3,
  }), [account, balance, callMethod, contracts, error, initialize, lastBlock, lastTransaction, networkId, sendMethod, status, web3])

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) throw new Error('useWeb3 doit etre utilise dans Web3Provider')
  return context
}
