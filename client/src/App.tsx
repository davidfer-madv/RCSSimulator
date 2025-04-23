import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import SimpleRegister from "@/pages/simple-register";
import RcsFormatter from "@/pages/rcs-formatter";
import Campaigns from "@/pages/campaigns";
import Customers from "@/pages/customers";
import SettingsPage from "@/pages/settings";
import { ProtectedRoute } from "./lib/protected-route";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  // Direct routing without protection for immediate functionality
  return (
    <Switch>
      <Route path="/" component={RcsFormatter} />
      <Route path="/home" component={HomePage} />
      <Route path="/rcs-formatter" component={RcsFormatter} />
      <Route path="/rcs-formatter/campaign/:campaignId" component={RcsFormatter} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/customers" component={Customers} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/register" component={SimpleRegister} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider attribute="class">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
