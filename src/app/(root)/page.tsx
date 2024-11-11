import {
  SignInButton,
  UserButton,
} from '@clerk/nextjs';

export default function SetupPage() {
  return (
    <>
      <p>Admin Dashboard</p>
      <UserButton />
      <SignInButton />
    </>
  );
}
