export const metadata = {
  title: "AwayHome",
  description: "Find hotels, apartments & properties",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}