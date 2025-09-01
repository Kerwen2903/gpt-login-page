import { LoginForm } from "@/components/login-form";
import { SettingsMenu } from "@/components/settings-menu";

export default function LoginPage() {
  return (
    <div className="max-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <SettingsMenu />
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
