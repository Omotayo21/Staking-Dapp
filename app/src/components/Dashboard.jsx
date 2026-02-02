import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import StakingData from '../contracts/StakingData.json';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStaked: '0',
        myStaked: '0',
        myBalance: '0',
        pendingRewards: '0'
    });
    const [stakeAmount, setStakeAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isApproved, setIsApproved] = useState(false);

    // Live Rewarding Logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (parseFloat(stats.myStaked) > 0) {
                setStats(prev => {
                    const apy = 0.10;
                    const secondsInYear = 31536000;
                    const rewardPerSec = (parseFloat(prev.myStaked) * apy) / secondsInYear;
                    return {
                        ...prev,
                        pendingRewards: (parseFloat(prev.pendingRewards) + rewardPerSec).toFixed(8)
                    };
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [stats.myStaked]);

    const fetchData = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const token = new ethers.Contract(StakingData.token.address, StakingData.token.abi, signer);
            const staking = new ethers.Contract(StakingData.staking.address, StakingData.staking.abi, signer);

            const [ts, ms, mb, pr, allowance] = await Promise.all([
                staking.totalStaked(),
                staking.stakedBalance(address),
                token.balanceOf(address),
                staking.earned(address),
                token.allowance(address, StakingData.staking.address)
            ]);

            setStats({
                totalStaked: ethers.formatEther(ts),
                myStaked: ethers.formatEther(ms),
                myBalance: ethers.formatEther(mb),
                pendingRewards: ethers.formatEther(pr)
            });
            setIsApproved(allowance > 0);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async () => {
        try {
            setLoading(true);
            setMessage('Approving token spending...');
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const token = new ethers.Contract(StakingData.token.address, StakingData.token.abi, signer);
            
            const tx = await token.approve(StakingData.staking.address, ethers.MaxUint256);
            await tx.wait();
            setIsApproved(true);
            setMessage('Tokens approved!');
        } catch (error) {
            if (error.code === 'ACTION_REJECTED') {
                setMessage('Error: Transaction cancelled by user.');
            } else {
                setMessage('Error: Transaction failed or had a problem.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStake = async () => {
        if (!stakeAmount || isNaN(stakeAmount)) return;
        try {
            setLoading(true);
            setMessage('Staking tokens...');
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const staking = new ethers.Contract(StakingData.staking.address, StakingData.staking.abi, signer);
            
            const tx = await staking.stake(ethers.parseEther(stakeAmount));
            await tx.wait();
            setMessage('Staking successful!');
            setStakeAmount('');
            fetchData();
        } catch (error) {
            if (error.code === 'ACTION_REJECTED') {
                setMessage('Error: Transaction cancelled by user.');
            } else {
                setMessage('Error: Transaction failed or had a problem.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUnstake = async () => {
        try {
            setLoading(true);
            setMessage('Withdrawing tokens...');
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const staking = new ethers.Contract(StakingData.staking.address, StakingData.staking.abi, signer);
            
            const tx = await staking.withdraw(ethers.parseEther(stats.myStaked));
            await tx.wait();
            setMessage('Withdrawal successful!');
            fetchData();
        } catch (error) {
            if (error.code === 'ACTION_REJECTED') {
                setMessage('Error: Transaction cancelled by user.');
            } else {
                setMessage('Error: Transaction failed or had a problem.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async () => {
        try {
            setLoading(true);
            setMessage('Claiming rewards...');
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const staking = new ethers.Contract(StakingData.staking.address, StakingData.staking.abi, signer);
            
            const tx = await staking.claimReward();
            await tx.wait();
            setMessage('Rewards claimed!');
            fetchData();
        } catch (error) {
            if (error.code === 'ACTION_REJECTED') {
                setMessage('Error: Transaction cancelled by user.');
            } else {
                setMessage('Error: Transaction failed or had a problem.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-12 bg-slate-950 px-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Stats Header */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Wallet Balance" value={`${parseFloat(stats.myBalance).toLocaleString()} RHM`} icon="👛" />
                    <StatCard title="Total Pool Staked" value={`${stats.totalStaked} RHM`} icon="📈" />
                    <StatCard title="Current APY" value="10%" icon="🔥" />
                    <StatCard title="Global Reward Pool" value="500,000 RHM" icon="💰" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Staking Action Card */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-black text-white mb-6">Manage Stake</h2>
                        
                        <div className="space-y-6">
                            <div className="flex justify-between text-sm font-bold text-slate-400">
                                <span>AMOUNT TO STAKE</span>
                                <span>MAX: {parseFloat(stats.myBalance).toLocaleString()} RHM</span>
                            </div>
                            
                            <div className="relative">
                                <input 
                                    type="number" 
                                    placeholder="0.0"
                                    value={stakeAmount}
                                    onChange={(e) => setStakeAmount(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-5 px-6 focus:outline-none focus:border-indigo-500 transition-all text-xl font-bold"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <button 
                                        onClick={() => setStakeAmount(stats.myBalance)}
                                        className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-lg text-xs font-bold hover:bg-indigo-500/30 transition-colors"
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>

                            {parseFloat(stats.myBalance) === 0 && (
                                <p className="text-center text-xs text-slate-500">
                                    Low balance? <a href="/faucet" className="text-indigo-400 hover:underline">Get free tokens here</a>
                                </p>
                            )}

                            {message && (
                                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium text-center">
                                    {message}
                                </div>
                            )}

                            {!isApproved ? (
                                <button 
                                    onClick={handleApprove}
                                    disabled={loading}
                                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all transform active:scale-[0.98] shadow-lg shadow-indigo-500/20"
                                >
                                    {loading ? 'PROCESSING...' : 'APPROVE RHM'}
                                </button>
                            ) : (
                                <button 
                                    onClick={handleStake}
                                    disabled={loading || !stakeAmount}
                                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                                >
                                    {loading ? 'STAKING...' : 'STAKE NOW'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Earnings Card */}
                    <div className="bg-indigo-600/10 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700"></div>
                        
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2">Your Earnings</h2>
                            <p className="text-indigo-300/80 mb-8">Rewards are calculated per second.</p>
                            
                            <div className="space-y-8">
                                <div>
                                    <p className="text-xs font-bold text-indigo-300/50 uppercase tracking-widest mb-1">STAKED BALANCE</p>
                                    <p className="text-4xl font-black text-white">{stats.myStaked} <span className="text-xl text-indigo-400">RHM</span></p>
                                </div>
                                
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-xs font-bold text-indigo-300/50 uppercase tracking-widest mb-1">PENDING REWARDS</p>
                                    <p className="text-4xl font-black text-indigo-400">
                                        {stats.pendingRewards}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-12">
                            <button 
                                onClick={handleClaim}
                                disabled={loading || parseFloat(stats.pendingRewards) <= 0}
                                className="py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all disabled:opacity-30"
                            >
                                CLAIM
                            </button>
                            <button 
                                onClick={handleUnstake}
                                disabled={loading || parseFloat(stats.myStaked) <= 0}
                                className="py-4 border border-white/10 hover:bg-red-500/10 text-white rounded-xl font-bold transition-all disabled:opacity-30"
                            >
                                UNSTAKE ALL
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
        <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
            <p className="text-2xl font-black text-white">{value}</p>
        </div>
        <div className="text-3xl grayscale opacity-50">{icon}</div>
    </div>
);

export default Dashboard;
