import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { OnboardingLayout } from "@/layouts/OnboardingLayout";
import { Terminal } from "@/pages/Terminal";
import { Wallet } from "@/pages/Wallet";
import { Brain } from "@/pages/Brain";
import { Automations } from "@/pages/Automations";
import { AgentsHub } from "@/pages/AgentsHub";
import { Subscription } from "@/pages/Subscription";
import { DeployAgent } from "@/pages/DeployAgent";
import { CreateAutomation } from "@/pages/CreateAutomation";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Terminal />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/brain" element={<Brain />} />
        <Route path="/automations" element={<Automations />} />
        <Route path="/marketplace" element={<AgentsHub />} />
        <Route path="/subscription" element={<Subscription />} />
      </Route>
      <Route element={<OnboardingLayout />}>
        <Route path="/deploy" element={<DeployAgent />} />
        <Route path="/create-automation" element={<CreateAutomation />} />
      </Route>
    </Routes>
  );
}
