export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex w-full justify-center items-center  h-full">
      <div className="flex  justify-center">{children}</div>
    </div>
  );
}
