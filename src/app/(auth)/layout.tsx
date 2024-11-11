export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex justify-center items-center h-full bg-slate-400">
      {children}
    </div>
  );
}
