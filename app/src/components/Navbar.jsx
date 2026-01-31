import { Link } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useState } from 'react';

const Navbar = () => {
    const { isConnected } = useAccount()
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="w-full h-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-4 md:px-12 fixed top-0 z-50 transition-all duration-300">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 z-50">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <span className="text-white font-black text-xl">M</span>
                </div>
                <div className="font-bold text-xl tracking-tighter text-white">
                    NFT <span className="text-blue-400">Market</span>
                </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center bg-white/5 p-1 rounded-xl border border-white/5">
                <Link to="/" className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10">
                    Explore
                </Link>
                {isConnected && (
                    <>
                        <Link to="/create" className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10">
                            Mint
                        </Link>
                        <Link to="/my-listed-items" className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10">
                            My Items
                        </Link>
                        <Link to="/my-purchases" className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10">
                            Portfolio
                        </Link>
                    </>
                )}
            </div>

            {/* Right Side Tools */}
            <div className="flex items-center gap-2 md:gap-4">
                <div className="scale-90 md:scale-100">
                    <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
                </div>
                
                {/* Mobile Menu Toggle */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-blue-500 z-[60] md:hidden animate-in fade-in zoom-in duration-300">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center h-20 px-4">
                            <Link to="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-black text-xl">M</span>
                                </div>
                            </Link>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col p-6 gap-4 bg-blue-500">
                            <Link 
                                to="/" 
                                onClick={() => setIsMenuOpen(false)}
                                className="text-3xl font-black text-white hover:text-blue-400 transition-colors"
                            >
                                Explore
                            </Link>
                            {isConnected && (
                                <>
                                    <Link 
                                        to="/create" 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-3xl font-black text-white hover:text-blue-400 transition-colors"
                                    >
                                        Mint NFT
                                    </Link>
                                    <Link 
                                        to="/my-listed-items" 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-3xl font-black text-white hover:text-blue-400 transition-colors"
                                    >
                                        My Items
                                    </Link>
                                    <Link 
                                        to="/my-purchases" 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-3xl font-black text-white hover:text-blue-400 transition-colors"
                                    >
                                        Portfolio
                                    </Link>
                                </>
                            )}
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <ConnectButton />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
