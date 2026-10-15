import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Document flow positions remain stable while GSAP translates the sections. */
export function sectionTop(target: HTMLElement) {
  if (target.id === 'work') {
    const pin = ScrollTrigger.getById('work');
    if (pin) return pin.start;
  }
  let top = 0;
  for (let node: HTMLElement | null = target; node; node = node.offsetParent as HTMLElement | null) top += node.offsetTop;
  return top;
}
