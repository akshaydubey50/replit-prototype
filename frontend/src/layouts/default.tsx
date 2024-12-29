
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen bg-gray-800">
      <main className="container flex-grow px-6 pt-16 mx-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
