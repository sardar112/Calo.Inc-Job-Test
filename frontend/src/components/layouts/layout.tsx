import * as React from "react";
import "./layout.css";

export function AppLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <div className="gradient-bg min-h-screen pt-10 md:pt-10 pb-6 px-2 md:px-0">
        <header className="max-w-lg mx-auto">
          <a href="#">
            <h1 className="text-4xl font-bold text-white text-center">
              Calo Job Management System
            </h1>
          </a>
        </header>

        <main className="bg-white w-full md:max-w-[85%] mx-auto p-0 md:p-5 lg:p-10 my-10 rounded-lg shadow-2xl">
          {children}
        </main>

        <div className="max-w-lg mx-auto text-center mt-12 mb-6">
          <p className="text-white">
            Developed by&nbsp;
            <a
              href="https://www.linkedin.com/in/muhammad-saqib-raheem-082345204/"
              className="font-bold hover:underline"
              target="_blank"
            >
              Saqib Raheem
            </a>
          </p>
        </div>

        <footer className="max-w-lg mx-auto flex justify-center text-white">
          <span className="mx-3">•</span>
          <a
            href="https://github.com/sardar112/"
            target="_blank"
            className="hover:underline"
          >
            Github
          </a>
          <span className="mx-3">•</span>
          <a
            href="https://www.linkedin.com/in/muhammad-saqib-raheem-082345204/"
            target="_blank"
            className="hover:underline"
          >
            Linkedin
          </a>
        </footer>
      </div>
    </>
  );
}
