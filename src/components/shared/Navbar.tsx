import Link from "next/link";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between gap-4 border-b py-3 px-5 shadow-md rounded-full bg-primary/5">
      <div>
        <Link href={"/"} className="font-black text-xl">PassGate</Link>
      </div>
      <div>
        <Button size={'lg'}>
          <Link href={"/sign-in"}>SignIn</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
