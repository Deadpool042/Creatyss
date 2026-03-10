import Link from "next/link";
import { env } from "@/lib/env";
import { getUploadsPublicPath } from "@/lib/uploads";

const foundations = [
  "Next.js App Router",
  "TypeScript strict",
  "PostgreSQL",
  "Docker Compose",
  "Uploads locaux"
];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Fondation technique</p>
        <h1>Creatyss</h1>
        <p className="lead">
          Le socle minimal est en place. Aucun écran métier n&apos;est encore
          implémenté.
        </p>

        <ul className="list">
          {foundations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <dl className="meta">
          <div>
            <dt>URL locale</dt>
            <dd>{env.appUrl}</dd>
          </div>
          <div>
            <dt>Uploads publics</dt>
            <dd>{getUploadsPublicPath()}</dd>
          </div>
          <div>
            <dt>Health check</dt>
            <dd>
              <Link href="/api/health">/api/health</Link>
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
