'use client';
import { usePrivy } from '@privy-io/react-auth';

export default function PrivyLogin() {
  const { login, logout, user, ready, authenticated } = usePrivy();

  if (!ready) return null;

  // Dynamically find the best available email
  const getEmail = () => {
    if (!user) return null;
    return (
      user.email?.address ||
      user.google?.email ||
      user.github?.username ||
      'Unknown User'
    );
  };

  return (
    <div>
      {authenticated ? (
        <div className="text-white">
          <p>Welcome, {getEmail()}</p>
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded mt-2"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={login}
          className="bg-fuchsia-600 px-4 py-2 rounded text-white"
        >
          Connect with Privy
        </button>
      )}
    </div>
  );
}
