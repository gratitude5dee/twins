
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b border-border py-4 px-4 sm:px-6">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white shadow-md">
            <Sparkles size={20} />
          </div>
          <span className="font-display font-bold text-xl">AgentForge</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/create-agent" className="text-sm font-medium hover:text-primary transition-colors">
              Create
            </Link>
            <Link to="/my-agents" className="text-sm font-medium hover:text-primary transition-colors">
              My Agents
            </Link>
            <Link to="/documentation" className="text-sm font-medium hover:text-primary transition-colors">
              Docs
            </Link>
          </nav>
          
          <Button size="sm" className="hidden sm:flex">
            Sign In
          </Button>
          <Button size="sm" variant="ghost" className="md:hidden">
            Menu
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
