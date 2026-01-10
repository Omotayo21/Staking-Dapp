import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

import EscrowABI from './Escrow.json';

function App() {
  // STATE
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  
  // FORM INPUTS
  const [arbiter, setArbiter] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [amount, setAmount] = useState('');
  
  // DEPLOYED ESCROWS
  const [escrows, setEscrows] = useState([]);
  
  // CONNECT WALLET ON LOAD
  useEffect(() => {
    connectWallet();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          setAccount('');
          setSigner(null);
        }
      });
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', connectWallet);
      }
    };
  }, []);
  
  async function connectWallet() {
    if (window.ethereum) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);
      
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        const browserSigner = await browserProvider.getSigner();
        setSigner(browserSigner);
        setAccount(accounts[0]);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }
  
  async function deployEscrow() {
    const cleanArbiter = arbiter.trim();
    const cleanBeneficiary = beneficiary.trim();

    if (!cleanArbiter || !cleanBeneficiary || !amount) {
      alert("Fill all fields!");
      return;
    }

    if (!ethers.isAddress(cleanArbiter) || !ethers.isAddress(cleanBeneficiary)) {
      alert("Please enter valid Ethereum addresses (starting with 0x)");
      return;
    }
    
    try {
      const factory = new ethers.ContractFactory(
        EscrowABI.abi,
        EscrowABI.bytecode,
        signer
      );
      
      const escrow = await factory.deploy(cleanArbiter, cleanBeneficiary, {
        value: ethers.parseEther(amount)
      });
      
      await escrow.waitForDeployment();
      const address = await escrow.getAddress();
      
      setEscrows([...escrows, {
        address,
        arbiter: cleanArbiter,
        beneficiary: cleanBeneficiary,
        amount,
        approved: false
      }]);
      
      setArbiter('');
      setBeneficiary('');
      setAmount('');
      
    } catch (error) {
      console.error("Deployment failed:", error);
      alert("Deployment failed! Check the console for details.");
    }
  }

  async function approveEscrow(escrowAddress, index) {
    try {
      const escrow = new ethers.Contract(escrowAddress, EscrowABI.abi, signer);
      const tx = await escrow.approve();
      await tx.wait();
      
      const updated = [...escrows];
      updated[index].approved = true;
      setEscrows(updated);
      
    } catch (error) {
      console.error("Approval failed:", error);
      alert("Only the designated arbiter can approve this release!");
    }
  }
  
  return (
    <div className="App">
      <header>
        <h1>Secure Escrow</h1>
        <div className={`connection-pill ${account ? 'active' : ''}`}>
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Not Connected"}
        </div>
      </header>
      
      <main>
        <section className="deploy-section">
          <h2>New Deposit</h2>
          <p className="role-info">As the Depositor, you lock ETH until the Arbiter approves its release to the Beneficiary.</p>
          
          <div className="input-group">
            <label>Arbiter Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={arbiter}
              onChange={(e) => setArbiter(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label>Beneficiary Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label>Amount (ETH)</label>
            <input
              type="text"
              placeholder="1.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          
          <button onClick={deployEscrow}>Create Escrow</button>
        </section>
        
        <section className="escrows-section">
          <h2>Active Escrows</h2>
          
          {escrows.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
              No deposits found. Start one to see it here.
            </div>
          )}
          
          {escrows.map((escrow, index) => (
            <div key={index} className="escrow-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className={`status-badge ${escrow.approved ? 'approved' : 'pending'}`}>
                  {escrow.approved ? "Released" : "Vaulted"}
                </span>
                <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{escrow.amount} ETH</span>
              </div>
              
              <p><strong>Arbiter</strong> {escrow.arbiter.slice(0, 10)}...</p>
              <p><strong>Beneficiary</strong> {escrow.beneficiary.slice(0, 10)}...</p>
              <p style={{ fontSize: '0.75rem', marginTop: '1rem', opacity: 0.6 }}>Contract: {escrow.address}</p>
              
              {!escrow.approved && (
                <button 
                  onClick={() => approveEscrow(escrow.address, index)}
                  style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                >
                  Approve Release
                </button>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
