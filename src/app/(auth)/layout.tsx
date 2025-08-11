export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-full w-full items-center justify-center bg-background p-4">
      {children}
    </main>
  );
}
