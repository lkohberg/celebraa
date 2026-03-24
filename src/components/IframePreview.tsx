import { useRef, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface IframePreviewProps {
  children: ReactNode;
  width: number;
  className?: string;
}

/**
 * Renders children inside an <iframe> so that CSS media queries
 * (Tailwind sm:, md:, lg: breakpoints) fire based on the iframe's
 * actual width rather than the parent viewport.
 */
const IframePreview = ({ children, width, className }: IframePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // Copy all stylesheets from parent document into the iframe
      const parentStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
      parentStyles.forEach((node) => {
        const clone = node.cloneNode(true) as HTMLElement;
        doc.head.appendChild(clone);
      });

      // Copy CSS custom properties from :root
      const rootStyles = getComputedStyle(document.documentElement);
      const cssVars: string[] = [];
      for (let i = 0; i < rootStyles.length; i++) {
        const prop = rootStyles[i];
        if (prop.startsWith("--")) {
          cssVars.push(`${prop}: ${rootStyles.getPropertyValue(prop)};`);
        }
      }
      const varStyle = doc.createElement("style");
      varStyle.textContent = `:root { ${cssVars.join(" ")} }`;
      doc.head.appendChild(varStyle);

      // Set base styles on iframe body
      doc.body.style.margin = "0";
      doc.body.style.padding = "0";
      doc.body.style.overflow = "auto";
      doc.body.style.fontFamily = getComputedStyle(document.body).fontFamily;

      // Copy class from <html> (dark mode, etc.)
      doc.documentElement.className = document.documentElement.className;

      // Create a mount div
      let mount = doc.getElementById("iframe-root");
      if (!mount) {
        mount = doc.createElement("div");
        mount.id = "iframe-root";
        doc.body.appendChild(mount);
      }
      setMountNode(mount);
    };

    // Trigger on load — for about:blank iframes this fires immediately
    iframe.addEventListener("load", onLoad);
    // Also try immediately in case already loaded
    onLoad();

    return () => {
      iframe.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="Mobile Preview"
      className={className}
      style={{
        width: `${width}px`,
        border: "none",
        display: "block",
      }}
      srcDoc="<!DOCTYPE html><html><head></head><body></body></html>"
    />
  );

  // This won't work because the return above exits. We need to restructure:
};

// Proper implementation using a wrapper pattern
const IframePreviewWrapper = ({ children, width, className }: IframePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setup = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // Copy all stylesheets from parent
      const parentStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
      parentStyles.forEach((node) => {
        const clone = node.cloneNode(true) as HTMLElement;
        doc.head.appendChild(clone);
      });

      // Copy CSS custom properties
      const rootStyles = getComputedStyle(document.documentElement);
      const cssVars: string[] = [];
      for (let i = 0; i < rootStyles.length; i++) {
        const prop = rootStyles[i];
        if (prop.startsWith("--")) {
          cssVars.push(`${prop}: ${rootStyles.getPropertyValue(prop)};`);
        }
      }
      const varStyle = doc.createElement("style");
      varStyle.textContent = `:root { ${cssVars.join(" ")} } body { margin: 0; padding: 0; overflow-x: hidden; }`;
      doc.head.appendChild(varStyle);

      // Copy dark mode class
      doc.documentElement.className = document.documentElement.className;

      // Create mount point
      let mount = doc.getElementById("iframe-root");
      if (!mount) {
        mount = doc.createElement("div");
        mount.id = "iframe-root";
        doc.body.appendChild(mount);
      }
      setMountNode(mount);
      setReady(true);
    };

    iframe.addEventListener("load", setup);
    return () => iframe.removeEventListener("load", setup);
  }, []);

  return (
    <>
      <iframe
        ref={iframeRef}
        title="Mobile Preview"
        className={className}
        style={{
          width: `${width}px`,
          border: "none",
          display: "block",
        }}
        srcDoc="<!DOCTYPE html><html><head></head><body></body></html>"
      />
      {ready && mountNode && createPortal(children, mountNode)}
    </>
  );
};

export default IframePreviewWrapper;
