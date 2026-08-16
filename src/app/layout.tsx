import { ThemeProvider } from "@/ThemeProvider";
import "./globals.css";
import "./landing.css";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-black dark:bg-gray-950 dark:text-white">
        <ThemeProvider>
          <div style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}>
            <div style={{ flex: 1 }}>
              {children}
            </div>
            <center>
              <Footer /></center>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}