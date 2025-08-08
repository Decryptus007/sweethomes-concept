import Footer from "@/components/generic/Footer";
import Header from "@/components/generic/Header";
import React from "react";

export default function layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
