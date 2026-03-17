"use client";

import { useState } from "react";

export function HomepageNewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      aria-labelledby="newsletter-title"
      className="-mx-4 bg-band-bg px-4 py-20 text-center md:-mx-6 md:px-6 min-[900px]:py-24 xl:-mx-12 xl:px-12">
      {/* Eyebrow */}
      <p className="mb-4 text-[0.62rem] font-medium uppercase tracking-[0.32em] text-band-eyebrow">
        Restez proche de l'atelier
      </p>

      {/* H2 */}
      <h2
        className="mb-4 font-serif text-[1.75rem] font-light leading-[1.2] text-white min-[900px]:text-[2.5rem]"
        id="newsletter-title">
        Nouvelles créations, <br className="hidden min-[480px]:block" />
        coulisses &amp; marchés
      </h2>

      {/* Subline */}
      <p className="mx-auto mb-10 max-w-[48ch] text-[0.82rem] font-light leading-[1.8] text-white/40">
        Quelques nouvelles par mois, jamais plus.
        <br />
        Pour ceux qui aiment les belles choses faites avec soin.
      </p>

      {/* Form */}
      {status === "success" ? (
        <p className="mx-auto max-w-sm font-serif text-[1rem] font-light italic text-white/70">
          Merci — vous ferez partie des premiers informés.
        </p>
      ) : (
        <form
          className="mx-auto flex max-w-110 flex-col border border-band-form-border min-[480px]:flex-row"
          noValidate
          onSubmit={handleSubmit}>
          <label
            className="sr-only"
            htmlFor="nl-email">
            Votre adresse email
          </label>
          <input
            autoComplete="email"
            className="flex-1 border-b border-white/12 bg-transparent px-5.5 py-3.75 text-[0.82rem] font-light text-white outline-none placeholder:text-white/28 min-[480px]:border-b-0"
            disabled={status === "loading"}
            id="nl-email"
            name="email"
            onChange={e => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            required
            type="email"
            value={email}
          />
          <button
            className="cursor-pointer bg-brand px-6 py-3.75 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand/85 disabled:opacity-60"
            disabled={status === "loading"}
            type="submit">
            {status === "loading" ? "…" : "S'abonner"}
          </button>
        </form>
      )}

      {/* Legal */}
      {status !== "success" && (
        <p className="mt-4 text-[0.6rem] tracking-[0.06em] text-white/20">
          Pas de spam · Désabonnement en un clic · Données protégées
        </p>
      )}
    </section>
  );
}
