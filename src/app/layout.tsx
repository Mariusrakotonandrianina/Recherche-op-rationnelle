import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
        <div className="">
          <Navbar />
        </div>
        <div className="">
          {children}
        </div>
        <div className="max-h-16">
          <Footer />
        </div>
      </body>
    </html>
  );
}