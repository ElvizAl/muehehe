import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, PawPrint } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "#/components/ui/sheet";
import { authClient } from "#/modules/auth/auth.client";

export function LandingHeader() {
	const { data: session } = authClient.useSession();
	const [menu, setMenu] = useState(false);

	return (
		<header className="relative flex h-[78px] items-center justify-between gap-6 md:h-[100px] mx-auto w-[calc(100%-40px)] max-w-[1180px] md:w-[calc(100%-48px)] lg:w-[calc(100%-80px)]">
			<a
				className="flex items-center text-2xl font-bold tracking-[-1px] [&>span:first-child]:mr-2 [&>span:first-child]:flex [&>svg]:mr-2 [&>i]:mb-2 [&>i]:ml-1 [&>i]:size-[5px] [&>i]:self-end [&>i]:rounded-full [&>i]:bg-[#d6a866]"
				href="#beranda"
				aria-label="AnabulCare beranda"
			>
				<span>
					<PawPrint size={22} />
				</span>
				Anabul<span className="text-[#69856b]">Care</span>
				<i />
			</a>
			<nav
				className="hidden gap-7 text-[13px] md:flex [&_a:hover]:text-[#8c704b]"
				aria-label="Navigasi utama"
			>
				<a href="#beranda">Beranda</a>
				<a href="#tentang">Tentang kami</a>
				<a href="#cara-kerja">Cara kerja</a>
				<a href="#faq">FAQ</a>
				<Link to="/login">{session ? "Akun saya" : "Masuk"}</Link>
			</nav>
			<Button
				nativeButton={false}
				render={(props) => (
					<a {...props} href="/register">
						{props.children}
					</a>
				)}
				className="h-auto gap-[18px] rounded-lg bg-[#284f3d] px-[23px] py-[17px] text-[13px] font-medium text-white hover:-translate-y-0.5 hover:bg-[#3c664e] hidden px-[17px] py-[13px] text-xs lg:inline-flex"
			>
				Daftar sekarang <ArrowRight size={16} />
			</Button>
			<Sheet open={menu} onOpenChange={setMenu}>
				<SheetTrigger
					render={
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
							aria-label="Buka menu"
						/>
					}
				>
					<Menu />
				</SheetTrigger>
				<SheetContent className="bg-[#fcfbf7] text-[#253e32]">
					<SheetHeader>
						<SheetTitle>AnabulCare</SheetTitle>
						<SheetDescription>Teman memahami kucingmu.</SheetDescription>
					</SheetHeader>
					<nav
						aria-label="Navigasi mobile"
						className="flex flex-col gap-3 px-4"
					>
						{[
							{ href: "#beranda", label: "Beranda" },
							{ href: "#tentang", label: "Tentang kami" },
							{ href: "#cara-kerja", label: "Cara kerja" },
							{ href: "#faq", label: "FAQ" },
							{ href: "/login", label: session ? "Akun saya" : "Masuk" },
							{ href: "/register", label: "Daftar sekarang" },
						].map((link) => (
							<SheetClose
								key={link.href}
								nativeButton={false}
								render={
									<a
										href={link.href}
										className="rounded-lg px-3 py-3 text-sm hover:bg-[#edf0e7]"
									>
										{link.label}
									</a>
								}
							>
								{link.label}
							</SheetClose>
						))}
					</nav>
				</SheetContent>
			</Sheet>
		</header>
	);
}
