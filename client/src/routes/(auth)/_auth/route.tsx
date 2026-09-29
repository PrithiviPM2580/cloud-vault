import Logo from "#/components/logo";
import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-muted flex-center min-h-dvh flex-col gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="mx-auto">
          <Logo />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
