import { Link } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="w-full h-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-4 md:px-12 fixed top-0 z-50">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <span className="text-white font-black text-xl">R</span>
                </div>
                <div className="font-bold text-xl tracking-tighter text-white">
                    Rahman <span className="text-indigo-400">Staking</span>
                </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center bg-white/5 p-1 rounded-xl border border-white/5">
                <Link to="/" className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10">
                    Dashboard
                </Link>
                <Link to="/faucet" className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10">
                    Faucet
                </Link>
            </div>

            {/* Right Side Tools */}
            <div className="flex items-center gap-4">
                <ConnectButton showBalance={false} chainStatus="icon" />
            </div>
        </nav>
    );
};

export default Navbar;
