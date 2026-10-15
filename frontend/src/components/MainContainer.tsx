import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import PortfolioDetails from "./PortfolioDetails";
import CommandPalette from "./CommandPalette";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import CallToAction from "./CallToAction";
import setSplitText from "./utils/splitText";
import gsap from 'gsap';
import { setAllTimeline } from './utils/GsapScroll';

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );
  const [shouldRenderCharacter, setShouldRenderCharacter] = useState(false);

  useEffect(() => {
    let alive = true;
    let resizeTimer = 0;
    const resizeHandler = () => {
      setIsDesktopView(window.innerWidth > 1024);
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => { if (alive) setSplitText(); }, 150);
    };
    document.fonts.ready.then(() => { if (alive) setSplitText(); });
    window.addEventListener("resize", resizeHandler);
    return () => {
      alive = false;
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  // Career animation must also exist when the mobile fallback omits Scene.
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(max-width: 1024px)', () => setAllTimeline());
    return () => media.revert();
  }, []);

  useEffect(() => {
    if (!isDesktopView) { setShouldRenderCharacter(false); return; }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let idleId: number | undefined;
    const win = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const mountCharacter = () => setShouldRenderCharacter(true);

    if (typeof win.requestIdleCallback === "function") {
      idleId = win.requestIdleCallback(mountCharacter, { timeout: 1500 });
      // Some browsers defer idle callbacks in background tabs. The desktop
      // experience must still mount and finish its loader.
      timeoutId = setTimeout(mountCharacter, 1500);
    } else {
      timeoutId = setTimeout(mountCharacter, 1200);
    }

    return () => {
      if (idleId !== undefined && typeof win.cancelIdleCallback === "function") {
        win.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [isDesktopView]);

  return (
    <div className="container-main">
      <a className="skip-link" href="#about">Skip to content</a>
      <CommandPalette />
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && shouldRenderCharacter && children}
      <div className="container-main">
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <TechStackNew />
        <PortfolioDetails />
        <CallToAction />
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;
