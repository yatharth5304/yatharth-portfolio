import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import { config } from "../config";
import "./styles/Navbar.css";
import { sectionTop } from '../utils/sectionNavigation';

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

const Navbar = () => {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const instance = new Lenis({ duration: reduced ? 0 : 1.7, easing: t => Math.min(1,1.001-Math.pow(2,-10*t)), orientation:'vertical', gestureOrientation:'vertical', smoothWheel:!reduced, wheelMultiplier:1.7, touchMultiplier:2, infinite:false });
    lenis = instance; instance.stop();
    if (window.innerWidth <= 1024) instance.start();
    let frame=0;
    const raf=(time:number) => {instance.raf(time);frame=requestAnimationFrame(raf);};frame=requestAnimationFrame(raf);
    instance.on('scroll', ScrollTrigger.update);
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.header ul a'));
    const navigate = (e:Event) => {e.preventDefault();const link=e.currentTarget as HTMLAnchorElement;const selector=link.dataset.href;const target=selector?document.querySelector(selector) as HTMLElement:null;if(target)instance.scrollTo(sectionTop(target),{offset:0,duration:reduced?0:1.5});};
    links.forEach(link=>link.addEventListener('click',navigate));
    const resize=()=>instance.resize();window.addEventListener('resize',resize);
    return () => {cancelAnimationFrame(frame);links.forEach(link=>link.removeEventListener('click',navigate));window.removeEventListener('resize',resize);instance.destroy();if(lenis===instance)lenis=null;};

  }, []);
  return (
    <>
      <nav className="header" aria-label="Main navigation">
        <a href="/#" className="navbar-title" data-cursor="disable">
          YM
        </a>
        <a
          href={`mailto:${config.contact.email}`}
          className="navbar-connect"
          data-cursor="disable"
        >
          {config.contact.email}
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </nav>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
