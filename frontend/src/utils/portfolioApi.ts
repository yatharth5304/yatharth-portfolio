import { config } from '../config';
import snapshot from '../data/portfolio-snapshot.json';
const ordered = <T extends {
    displayOrder?: number;
}>(rows: T[]) => [...rows].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
const safeURL = (value: string | null | undefined) => value && /^https?:\/\//.test(value) && !value.includes('yourrepo') ? value : '';
export async function loadPortfolioContent() {
    const names = ['experiences', 'projects', 'skills', 'stats', 'principles'] as const;
    const results = await Promise.allSettled(names.map(async (name) => {
        const response = await fetch(`/api/${name}`, { signal: AbortSignal.timeout(6000) });
        if (!response.ok)
            throw new Error(`HTTP ${response.status}`);
        const rows = await response.json();
        if (!Array.isArray(rows))
            throw new Error('Invalid content response');
        return rows;
    }));
    const data = { ...snapshot };
    results.forEach((result, i) => { if (result.status === 'fulfilled' && result.value.length)
        Object.assign(data, { [names[i]]: ordered(result.value) }); });
    config.experiences = data.experiences.map(x => ({ position: x.role, company: x.company, period: x.displayLabel || `${x.startDate} – ${x.current ? 'Present' : x.endDate}`, location: x.location, description: x.description, technologies: (x.tags || '').split(', ') }));
    config.projects = data.projects.map(x => {
        const fallback = config.projects.find(p => p.id === x.id || p.link.includes(x.slug));
        return { id: x.id, title: x.title, category: fallback?.category || 'Software Engineering', technologies: x.technologies || '', image: fallback?.image || '/images/developer-portfolio.svg', description: x.description, link: fallback?.link || safeURL(x.liveLink) || safeURL(x.githubLink), github: safeURL(x.githubLink), live: safeURL(x.liveLink), problem: x.problem || '', highlight: x.highlight || '', challenge: x.challenge || '' };
    });
    config.techStack = data.skills;
    config.skills.develop.tools = data.skills.filter(x => x.category === 'Backend').map(x => x.name);
    config.skills.design.tools = data.skills.filter(x => ['Database', 'Tools & DevOps'].includes(x.category)).map(x => x.name);
    config.stats = data.stats.map(x => ({ ...x, value: x.value || snapshot.stats.find(s => s.id === x.id)?.value || '' }));
    config.principles = data.principles;
    document.documentElement.dataset.contentSource = results.every(r => r.status === 'fulfilled' && r.value.length > 0) ? 'api' : 'verified-fallback';
}
