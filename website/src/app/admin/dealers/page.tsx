import Link from "next/link";
import { ALL_STATES, INDIAN_STATES } from "../../../lib/indianStates";
import { ClientCreateDealerForm, ClientUpdateDealerForm } from "./ClientForms";

async function api(path: string, init?: RequestInit) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api${path}`, {
    ...init,
    headers: {
      ...(init?.headers as any),
      "content-type": "application/json",
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export default async function AdminDealersPage() {
  const { res, data } = await api("/admin/dealers");

  // If backend is down, show a friendly message.
  if (!res.ok && res.status >= 500) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-black">Admin · Dealers</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
          Backend not responding. Start it at <span className="font-mono">backend/</span> then refresh.
        </p>
      </div>
    );
  }

  const dealers: Array<any> = data?.dealers ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex gap-4 mb-4 text-lg font-bold">
            <Link href="/admin/products" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 pb-1">Products</Link>
            <Link href="/admin/dealers" className="text-zinc-900 dark:text-zinc-50 border-b-2 border-brand pb-1">Dealers</Link>
          </div>
          <h1 className="text-3xl font-black">Admin · Dealers</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Only admins can manage dealers.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/login"
            className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-bold text-zinc-900 hover:bg-white/80 transition-colors dark:bg-zinc-900/40 dark:text-zinc-50"
          >
            Login
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <CreateDealerCard />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dealers.map((d) => (
          <DealerCard key={d.id} dealer={d} />
        ))}
      </div>
    </div>
  );
}

function CreateDealerCard() {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:bg-zinc-900/40">
      <h2 className="text-lg font-black">Create dealer</h2>
      <ClientCreateDealerForm />
    </div>
  );
}

function DealerCard({ dealer }: { dealer: any }) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:bg-zinc-900/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black">{dealer.name}</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {dealer.district}, {dealer.state}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {dealer.phone} · {dealer.email}
          </p>
          {Array.isArray(dealer.brands) && dealer.brands.length > 0 && (
             <div className="mt-2 flex flex-wrap gap-1">
               {dealer.brands.map((b: string) => (
                 <span key={b} className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-300">{b}</span>
               ))}
             </div>
          )}
        </div>
        <span
          className={[
            "rounded-full px-3 py-1 text-xs font-bold",
            dealer.active ? "bg-emerald-600/10 text-emerald-700" : "bg-zinc-600/10 text-zinc-700",
          ].join(" ")}
        >
          {dealer.active ? "Active" : "Inactive"}
        </span>
      </div>
      <ClientUpdateDealerForm dealer={dealer} />
    </div>
  );
}
