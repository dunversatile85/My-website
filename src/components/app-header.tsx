"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Clapperboard, LogOut, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Spinner } from './spinner';

export default function AppHeader() {
  const { user, signOutUser } = useAuth();
  const { toast } = useToast();
  const [isAdPlaying, setIsAdPlaying] = useState(false);

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  const handleWatchAd = () => {
    setIsAdPlaying(true);
    toast({ title: 'Watching reward ad...', description: 'Please wait to receive your reward.' });
    
    setTimeout(() => {
      setIsAdPlaying(false);
      toast({
        title: 'Reward Granted!',
        description: 'You have received 100 points.',
        duration: 3000,
      });
    }, 4000);
  };

  const tapjoyUrl = `https://www.tapjoy.com/offerwall/show?app_id=YOUR_APP_ID&user_id=${user?.uid || ''}`;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Award className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold text-primary">Don’s PlayWorld</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <Button asChild variant="secondary" className="bg-accent hover:bg-accent/80">
          <a href={tapjoyUrl} target="_blank" rel="noopener noreferrer">
            <Award className="mr-2 h-4 w-4" />
            Earn Rewards
          </a>
        </Button>
        <Button onClick={handleWatchAd} disabled={isAdPlaying}>
          {isAdPlaying ? <Spinner size="sm" color="primary"/> : <Clapperboard className="mr-2 h-4 w-4" />}
          Watch Ad
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL || undefined} alt="User avatar" />
                <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{user?.email}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOutUser}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
