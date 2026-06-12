type Props = {
  isDark: boolean;
  onToggleTheme: () => void;
}

function AppHeader({isDark, onToggleTheme}: Props) {
  return (
    <header className="flex justify-end p-4 border-b bg-white dark:bg-slate-900">
      <button
        onClick={onToggleTheme}
        className="px-3 py-2 rounded bg-indigo-600  text-white"
      >
        {isDark ? "Dark" : "light"}
      </button>
    </header>
  );
}

export default AppHeader;
