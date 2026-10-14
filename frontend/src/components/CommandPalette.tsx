import { useEffect, useRef, useState } from 'react';
import { config } from '../config';
import { lenis } from './Navbar';
export default function CommandPalette() {
    const ref = useRef<HTMLDialogElement>(null);
    const input = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const commands = [{ label: 'About', href: '#about' }, { label: 'Experience', href: '#experience' }, { label: 'Projects', href: '#work' }, { label: 'Tech Stack', href: '#skills' }, { label: 'Contact', href: '#contact' }, { label: 'Resume', href: '/resume' }, { label: 'GitHub', href: config.contact.github }, { label: 'LinkedIn', href: config.contact.linkedin }];
    const filtered = commands.filter(x => x.label.toLowerCase().includes(query.toLowerCase()));
    function choose(href: string) { ref.current?.close(); if (href.startsWith('#')) {
        const target = document.querySelector(href) as HTMLElement;
        if (target) {
            lenis?.scrollTo(target);
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
    else
        window.open(href, '_blank', 'noopener,noreferrer'); }
    useEffect(() => { const key = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (ref.current?.open)
            ref.current.close();
        else {
            ref.current?.showModal();
            input.current?.focus();
        }
    } }; window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key); }, []);
    return <><button className="command-trigger" aria-label="Open command palette, Control or Command K" onClick={() => { ref.current?.showModal(); input.current?.focus(); }}>⌘K</button><dialog ref={ref} className="command-palette" aria-label="Portfolio commands" onClick={e => { if (e.target === ref.current)
        ref.current.close(); }}><input ref={input} aria-label="Search portfolio commands" placeholder="Search or type a command…" value={query} onChange={e => { setQuery(e.target.value); setActive(0); }} onKeyDown={e => { if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(x => (x + 1) % Math.max(1, filtered.length));
    } if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(x => (x - 1 + filtered.length) % Math.max(1, filtered.length));
    } if (e.key === 'Enter' && filtered[active])
        choose(filtered[active].href); }}/><div>{filtered.map((x, i) => <button key={x.label} className={i === active ? 'selected' : ''} onClick={() => choose(x.href)}>{x.label} ↗</button>)}</div><button onClick={() => ref.current?.close()}>Close · Esc</button></dialog></>;
}
