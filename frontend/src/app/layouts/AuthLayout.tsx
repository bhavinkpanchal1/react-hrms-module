import { Outlet } from "react-router-dom";

export const AuthLayout = () => (
  <main className="grid  min-h-screen w-full place-items-center bg-slate-50 dark:bg-navy-900">
    <div className="w-full max-w-[26rem] p-4 sm:px-5">
      {/* LOGO */}
      <div className="mb-5 flex  flex-col items-center text-center">
        <img src="/src/assets/images/peoplepulse.png" alt="logo" className="size-16" />
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-slate-600 dark:text-navy-100">
            Welcome Back
          </h2>
          <p className="text-slate-400 dark:text-navy-300">
            Sign in to continue
          </p>
        </div>
      </div>

       {/* Page content (login form, etc.) */}
      <div className="card rounded-lg p-5 lg:p-7">
        <Outlet />
      </div>
    </div>
  </main>
)