export default function C2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {children}
    </div>
  );
}
