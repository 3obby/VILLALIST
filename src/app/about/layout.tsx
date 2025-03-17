import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | The Villa List",
  description:
    "Learn more about The Villa List, our luxury villas, services, and team.",
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
