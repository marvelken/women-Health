import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "Enhancing Women's Health Apps",
  description: "Enhancing Women's Health Apps: Integrating Permit.io for Secure and Collaborative Data Sharing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className=""
      >
        {children}
      </body>
    </html>
  );
}
