import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import SimpleRegister from "@/pages/simple-register";
import RcsFormatter from "@/pages/rcs-formatter-new";
import Campaigns from "@/pages/campaigns";
import Customers from "@/pages/customers";
import SettingsPage from "@/pages/settings";
import HeaderExamplesPage from "@/pages/header-examples";
import WebhooksPage from "@/pages/webhooks";
import TemplatesPage from "@/pages/templates";
import AnalyticsPage from "@/pages/analytics";
import WebhookSimulatorPage from "@/pages/webhook-simulator";
import { ProtectedRoute } from "./lib/protected-route";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/hooks/use-auth";
import { RcsFormatterProvider } from "@/context/rcs-formatter-context";

function Router() {
  return (
    <Switch>
      <Route path="/" component={RcsFormatter} />
      <Route path="/home" component={HomePage} />
      <Route path="/rcs-formatter" component={RcsFormatter} />
      <Route path="/rcs-formatter/campaign/:campaignId" component={RcsFormatter} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/customers" component={Customers} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/webhooks" component={WebhooksPage} />
      <Route path="/templates" component={TemplatesPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/webhook-simulator" component={WebhookSimulatorPage} />
      <Route path="/header-examples" component={HeaderExamplesPage} />
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
        <RcsFormatterProvider>
          <ThemeProvider attribute="class">
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </RcsFormatterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
