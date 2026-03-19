import { LoginForm } from "../forms/login-form";

const SignInPage = () => {
  return (
    <>
      <section className="flex min-h-[calc(100dvh-140px)] w-full items-center justify-center p-6 md:p-10">
        <LoginForm className="w-full max-w-sm" />
      </section>
    </>
  );
};

export default SignInPage;
