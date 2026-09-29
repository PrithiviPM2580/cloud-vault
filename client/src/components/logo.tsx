export default function Logo() {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center bg-black">
      <div className="h-8 w-8 rotate-45 bg-white"></div>
      <div className="absolute h-3.5 w-3.5 rotate-45 bg-black"></div>
    </div>
  );
}
