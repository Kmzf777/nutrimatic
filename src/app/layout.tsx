import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nutrimatic - Receitas, atendimento e prospecção no piloto automático",
  description: "Automatize prescrições, converse com clientes, gere novos atendimentos — tudo em minutos, usando inteligência artificial. O tempo do nutricionista não se negocia — a Nutrimatic resolve.",
  keywords: "nutrição, prescrição automática, chatbot, inteligência artificial, nutricionista, atendimento automatizado",
  authors: [{ name: "Nutrimatic" }],
  openGraph: {
    title: "Nutrimatic - Receitas, atendimento e prospecção no piloto automático",
    description: "Automatize prescrições, converse com clientes, gere novos atendimentos — tudo em minutos, usando inteligência artificial.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
