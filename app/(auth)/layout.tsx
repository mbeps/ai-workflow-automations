import { AuthLayout } from "@/features/auth/components/auth-layout";

/**
 * Shared layout for authentication-related pages (Login, Signup).
 * Wraps children with the central branding and UI patterns defined in AuthLayout.
 *
 * @author Maruf Bepary
 * @param props - Component props.
 * @param props.children - Auth form components.
 * @returns The rendered auth layout.
 */
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
