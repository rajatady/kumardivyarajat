import { auth, signIn, signOut } from "@/lib/auth";
import { CMSHeader } from "@/components/cms/CMSHeader";

function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-medium tracking-tight text-text mb-2">
          Content Management
        </h1>
        <p className="font-ui text-sm text-text-muted mb-8">
          Sign in with GitHub to manage your content.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/cms" });
          }}
        >
          <button
            type="submit"
            className="font-ui text-sm font-medium px-6 py-3 rounded bg-text text-bg hover:bg-text-secondary transition-colors inline-flex items-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Sign in with GitHub
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return <SignInPage />;
  }

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="min-h-screen bg-bg">
      <CMSHeader onSignOut={handleSignOut} />
      <div className="px-4 sm:px-6 py-6 sm:py-8">{children}</div>
    </div>
  );
}
