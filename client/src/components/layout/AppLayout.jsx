// client/src/components/layout/AppLayout.jsx
import Sidebar from './Sidebar';

/**
 * AppLayout wraps all authenticated pages with the sidebar.
 * Usage: wrap protected pages with <AppLayout> in App.jsx.
 */
const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-dark-950">
      <Sidebar />
      {/* Push content past the sidebar */}
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
