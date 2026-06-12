
import { useTheme } from "./shared/hooks/use-theme";

function App() {
  const { toggleTheme } = useTheme();

  return (
    <div
      className={
        "min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900 transition"
      }
    >
      <h1 className="text-4xl font-bold text-black dark:text-white">HRMS Ready</h1>
      <button onClick={toggleTheme} className="mt-6 px-5 py2 rounded bg-indigo-600 text-white"> Toogle Theme</button>

      <p className="mt-3 dark:text-white"></p>      
    </div>
  );
}

export default App;
