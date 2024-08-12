
// pages/welcome.js

import React from 'react';
import Link from 'next/link';

export default function Welcome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
        
      <div className="flex flex-row space-x-4">
        
        <Link href="/login">
          <div className="block">
            <button className="px-6 py-3 text-white bg-blue-500 rounded-md text-lg font-semibold hover:bg-blue-600 transition">
              Login
            </button>
          </div>
        </Link>
        <Link href="/signup">
          <div className="block">
            <button className="px-6 py-3 text-white bg-blue-500 rounded-md text-lg font-semibold hover:bg-blue-600 transition">
              Sign Up
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}

