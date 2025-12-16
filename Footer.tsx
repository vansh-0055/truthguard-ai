import React from 'react';
import { Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center space-x-2 mb-6">
                            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                TruthGuard AI
                            </span>
                        </Link>
                        <p className="text-slate-400 mb-6 max-w-sm">
                            Combating misinformation with state-of-the-art Artificial Intelligence.
                            Verify facts instantly and browse with confidence.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Platform</h4>
                        <ul className="space-y-4">
                            <li><Link to="/check" className="text-slate-400 hover:text-blue-400 transition-colors">News Achecker</Link></li>
                            <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Browser Extension</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">API Access</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>© 2024 TruthGuard AI. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
