'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

type ErrorContextType = {
  showError: (message: string) => void;
};

const ErrorContext = createContext<
  ErrorContextType | undefined
>(undefined);

export function ErrorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
  };

  const closeError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}

      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Error
            </h2>

            <p className="mb-6 text-gray-600">
              {error}
            </p>

            <button
              onClick={closeError}
              className="rounded-lg bg-gray-900 px-4 py-2 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error(
      'useError must be used inside ErrorProvider',
    );
  }

  return context;
}