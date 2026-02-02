import { useState } from 'react';
import { ethers } from "ethers";
import StakingData from '../contracts/StakingData.json';

const Faucet = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const claimTokens = async () => {
        try {
            setLoading(true);
            setMessage('Requesting tokens from faucet...');
            
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            const tokenContract = new ethers.Contract(
                StakingData.token.address,
                StakingData.token.abi,
                signer
            );
            
            const tx = await tokenContract.faucet();
            await tx.wait();
            
            setMessage('Success! 1,000 RHM received.');
            alert('Tokens received! Add token address to MetaMask: ' + StakingData.token.address);
        } catch (error) {
            if (error.code === 'ACTION_REJECTED') {
                setMessage('Error: Transaction cancelled by user.');
            } else {
                setMessage('Error: ' + (error.reason || error.message));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-12 bg-slate-950 px-6">
            <div className="max-w-xl mx-auto">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center">
                    <div className="w-20 h-20 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
                        <span className="text-4xl">💧</span>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-4">Token Faucet</h1>
                    <p className="text-slate-400 mb-8">
                        Need test tokens? Claim 1,000 RHM tokens once every 24 hours to test out the staking features.
                    </p>
                    
                    {message && (
                        <div className="mb-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium animate-pulse">
                            {message}
                        </div>
                    )}
                    
                    <button 
                        onClick={claimTokens}
                        disabled={loading}
                        className={`w-full py-4 px-6 rounded-2xl font-black text-white transition-all transform active:scale-[0.98] ${loading ? 'bg-slate-800' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1'}`}
                    >
                        {loading ? 'GETTING TOKENS...' : 'CLAIM 1,000 RHM'}
                    </button>
                    
                    <div className="mt-8 pt-8 border-t border-white/5">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Token Address</p>
                        <code className="text-[10px] md:text-sm text-indigo-400 bg-indigo-500/5 px-3 py-1 rounded-lg border border-indigo-500/10">
                            {StakingData.token?.address || 'Contract not deployed'}
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faucet;
