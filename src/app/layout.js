import "./globals.css";

export const metadata = {
  title: "AwayHome",
  description: "Find hotels, apartments & properties",
   icons: {
    icon: '/favicon.ico', 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}