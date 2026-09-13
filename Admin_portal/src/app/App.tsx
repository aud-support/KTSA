import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { CMSProvider } from './context/CMSContext';

export default function App() {
  return (
    <CMSProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        theme="dark"
        expand={true}
        visibleToasts={9}
        gap={8}
        duration={10000}
        toastOptions={{ duration: 10000 }}
      />
    </CMSProvider>
  );
}