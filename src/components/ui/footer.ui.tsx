export default function Footer() {
  return (
    <footer className=" text-gray-400 text-sm py-8 text-center">
      <p>&copy; 2025 All rights reserved.</p>
      <div className="mt-4 flex justify-center space-x-4">
        <a
          href="https://github.com/your-github"
          target="_blank"
          className="hover:text-white transition-colors duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.402 2.862 8.125 6.837 9.488.5.092.682-.218.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.531 1.032 1.531 1.032.892 1.53 2.34 1.085 2.91.829.091-.644.351-1.085.636-1.334-2.22-.253-4.555-1.11-4.555-4.942 0-1.09.39-1.984 1.029-2.68a3.78 3.78 0 01.07-2.652s.837-.269 2.75 1.025c1.1-.304 2.25-.457 3.4-.462 1.15.005 2.3.158 3.4.462 1.913-1.294 2.75-1.025 2.75-1.025.215.867.214 1.748.07 2.652.639.696 1.028 1.59 1.028 2.68 0 3.832-2.339 4.685-4.569 4.935.359.309.678.92.678 1.855 0 1.336-.012 2.417-.012 2.747 0 .264.181.573.687.479C21.138 20.141 24 16.418 24 12.017 24 6.484 19.523 2 14 2h-2z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <a
          href="https://linkedin.com/in/your-linkedin"
          target="_blank"
          className="hover:text-white transition-colors duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M22.23 0H1.77C.79 0 0 .79 0 1.77v20.46c0 .98.79 1.77 1.77 1.77h20.46c.98 0 1.77-.79 1.77-1.77V1.77c0-.98-.79-1.77-1.77-1.77zM7.34 20.46H3.59V8.5h3.75v11.96zm-1.88-13.3c-1.35 0-2.45-1.1-2.45-2.45s1.1-2.45 2.45-2.45 2.45 1.1 2.45 2.45-1.1 2.45-2.45 2.45zM20.46 20.46h-3.75v-6.68c0-1.6-.57-2.69-1.99-2.69-1.08 0-1.73.73-2.02 1.44-.1.25-.13.59-.13.93v7.01h-3.75s.05-10.87 0-11.96h3.75v1.6c.5-.78 1.45-1.89 3.38-1.89 2.46 0 4.31 1.62 4.31 5.1V20.46z" />
          </svg>
        </a>
        <a
          href="mailto:kimkh05.dev@gmail.com"
          className="hover:text-white transition-colors duration-200"
        >
          connect to email
        </a>
      </div>
    </footer>
  );
}
