
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut, User, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import emitter from "@/lib/eventEmitter";
import { useAppState } from '@/hooks/useAppState';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { conversationType } = useAppState();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const handleSidebarToggle = () => {
    emitter.emit("toggleSidebar");
  };

  return (
    <header className="border-b border-border py-4 px-4 sm:px-6">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="p-2 rounded-md hover:bg-secondary focus:outline-none lg:hidden mr-2"
            onClick={handleSidebarToggle}
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white shadow-md">
              <Sparkles size={20} />
            </div>
            <span className="font-display font-bold text-xl">Digital Twin Hub</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            {user && (
              <>
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                  My Twins
                </Link>
                <Link to="/create-twin" className="text-sm font-medium hover:text-primary transition-colors">
                  Create Twin
                </Link>
              </>
            )}
          </nav>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="gradient-bg text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  <span>{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
