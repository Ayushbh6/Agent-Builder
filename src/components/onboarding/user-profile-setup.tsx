'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UserProfileSetupProps {
  onComplete: () => void;
}

export function UserProfileSetup({ onComplete }: UserProfileSetupProps) {
  const user = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill from existing profile if available (OAuth names, previous attempts, etc.)
  useEffect(() => {
    if (!user) return;
    const metaFirst = (user.clientMetadata?.firstName as string | undefined) ?? '';
    const metaLast = (user.clientMetadata?.lastName as string | undefined) ?? '';

    if (metaFirst || metaLast) {
      setFirstName(metaFirst);
      setLastName(metaLast);
      return;
    }

    const display = (user.displayName ?? '').trim();
    if (display) {
      const parts = display.split(/\s+/);
      if (parts.length === 1) {
        setFirstName(parts[0]);
      } else if (parts.length > 1) {
        setFirstName(parts[0]);
        setLastName(parts.slice(1).join(' '));
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firstName.trim() || !lastName.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      // Update both the public displayName and client metadata.
      await user.update({
        displayName: `${firstName.trim()} ${lastName.trim()}`.trim(),
        clientMetadata: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          onboarded: true,
        },
      });
      onComplete();
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('We couldn\'t save your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-secondary/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-accent/20 to-primary/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="backdrop-blur-xl bg-card/90 border border-border shadow-2xl">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl mb-4 shadow-lg mx-auto">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Help us personalize your Agent Builder experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-2">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-background text-foreground"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-background text-foreground"
                  placeholder="Enter your last name"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                disabled={isLoading || !firstName.trim() || !lastName.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Setting up...
                  </div>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}