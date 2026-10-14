import { config } from '../config';
export default function PortfolioDetails() {
    return <section className="portfolio-details section-container" aria-label="Education and engineering principles">
  <h2>Education <span>&</span> approach</h2><p>{config.education} · Nagpur, India</p>
  <div className="portfolio-stats">{config.stats.map(x => <p key={x.id}><strong>{x.value}</strong> {x.label}</p>)}</div>
  <div className="portfolio-principles">{config.principles.map(x => <article key={x.id}><h3>{x.title}</h3><p>{x.description}</p></article>)}</div>
    </section>;
}
