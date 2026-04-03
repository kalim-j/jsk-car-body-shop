import Link from "next/link";

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

export default async function AdminProductsPage() {
  const { res, data } = await api("/admin/products");

  // If backend is down, show a friendly message.
  if (!res.ok && res.status >= 500) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-black">Admin · Products</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
          Backend not responding. Start it at <span className="font-mono">backend/</span> then refresh.
        </p>
      </div>
    );
  }

  const products: Array<any> = data?.products ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Admin · Products</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Only admins can create/update/delete. If you are not an admin, API calls will be rejected.
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
        <CreateProductCard />
        <form
          action={async () => {
            "use server";
            // no-op placeholder (keeps page server-only). Real actions handled in client below.
          }}
          className="rounded-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:bg-zinc-900/40"
        >
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Tip: you can manage products from this page. (UI uses client fetch for simplicity.)
          </p>
        </form>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

function CreateProductCard() {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:bg-zinc-900/40">
      <h2 className="text-lg font-black">Create product</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Admin-only. Uses backend endpoint <span className="font-mono">POST /products</span>.
      </p>
      <ClientCreateProductForm />
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:bg-zinc-900/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black">{product.name}</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{product.description}</p>
          <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Price: ${(product.priceCents / 100).toFixed(2)}
          </p>
        </div>
        <span
          className={[
            "rounded-full px-3 py-1 text-xs font-bold",
            product.active ? "bg-emerald-600/10 text-emerald-700" : "bg-zinc-600/10 text-zinc-700",
          ].join(" ")}
        >
          {product.active ? "Active" : "Inactive"}
        </span>
      </div>
      <ClientUpdateProductForm product={product} />
    </div>
  );
}

// Client-side forms (backend still enforces admin-only)
function ClientCreateProductForm() {
  // eslint-disable-next-line @next/next/no-sync-scripts
  return (
    <form
      className="mt-4 grid gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const fd = new FormData(form);
        const payload = {
          name: String(fd.get("name") || ""),
          description: String(fd.get("description") || ""),
          priceCents: Number(fd.get("priceCents") || 0),
          active: Boolean(fd.get("active")),
        };
        const res = await fetch(`/api/admin/products`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          // Token comes from httpOnly cookie on website; browser cannot read it.
          // For dev simplicity: we call backend directly only for public reads.
          // Create/update will typically be called via a server proxy in production.
          body: JSON.stringify(payload),
        });
        if (!res.ok) alert("Create failed (make sure you are logged in as admin)");
        else window.location.reload();
      }}
    >
      <input className="rounded-xl border px-4 py-3 text-sm" name="name" placeholder="Name" required />
      <input
        className="rounded-xl border px-4 py-3 text-sm"
        name="description"
        placeholder="Description"
        required
      />
      <input
        className="rounded-xl border px-4 py-3 text-sm"
        name="priceCents"
        placeholder="Price (cents)"
        type="number"
        min={0}
        defaultValue={0}
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked /> Active
      </label>
      <button className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-500">
        Create
      </button>
      <p className="text-xs text-zinc-500">
        Note: for secure admin writes from the website we’ll next proxy writes through Next.js API routes (so the
        httpOnly cookie can be used). Backend already blocks non-admins.
      </p>
    </form>
  );
}

function ClientUpdateProductForm({ product }: { product: any }) {
  return (
    <form
      className="mt-5 grid gap-2 border-t border-zinc-200/80 pt-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const fd = new FormData(form);
        const payload = {
          name: String(fd.get("name") || ""),
          description: String(fd.get("description") || ""),
          priceCents: Number(fd.get("priceCents") || 0),
          active: Boolean(fd.get("active")),
        };
        const res = await fetch(`/api/admin/products/${product.id}`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) alert("Update failed (admin only)");
        else window.location.reload();
      }}
    >
      <input className="rounded-xl border px-3 py-2 text-sm" name="name" defaultValue={product.name} required />
      <input
        className="rounded-xl border px-3 py-2 text-sm"
        name="description"
        defaultValue={product.description}
        required
      />
      <input
        className="rounded-xl border px-3 py-2 text-sm"
        name="priceCents"
        type="number"
        min={0}
        defaultValue={product.priceCents}
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={Boolean(product.active)} /> Active
      </label>
      <button className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-bold hover:bg-white/80">
        Update
      </button>
    </form>
  );
}

