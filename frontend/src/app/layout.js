
import "./globals.css";

export const metadata = {
  title: "FEMS - Farm & Employee Management System",
  description: "Empowering Farmers Digitally - Manage your farm efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}

