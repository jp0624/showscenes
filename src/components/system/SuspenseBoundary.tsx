// src/components/system/SuspenseBoundary.tsx
import { Suspense, type ReactNode } from "react";
import PageLoader from "./Pageloader";

export default function SuspenseBoundary({
	children,
}: {
	children: ReactNode;
}) {
	return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}
