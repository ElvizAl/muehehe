import { LandingFooter } from "#/components/home/landing-footer";
import { LandingHeader } from "#/components/home/landing-header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_home")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <>
    <LandingHeader />
    <Outlet /> 
    <LandingFooter />
    </>     
  );
}