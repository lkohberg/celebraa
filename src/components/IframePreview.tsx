import { useRef, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface IframePreviewProps {
  children: ReactNode;
  width: number;
  maxHeight?: string;
  className?: string;
}

/**
 * Renders children inside an <iframe> so that CSS media queries
 * (Tailwind sm:, md:, lg:) fire based on the iframe viewport width.
 */
const IframePreview = ({ children, width, maxHeight = "75vh", className }: IframePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setup = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // Clear previous content if re-setup
      doc.head.innerHTML = "";
      doc.body.innerHTML = "";

      // Copy all stylesheets from parent
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

      const extraStyle = doc.createElement("style");
      extraStyle.textContent = `
        :root { ${cssVars.join(" ")} }
        body { margin: 0; padding: 0; overflow-x: hidden; overflow-y: auto; }
        * { box-sizing: border-box; }
      `;
      doc.head.appendChild(extraStyle);

      // Copy dark mode / html classes
      doc.documentElement.className = document.documentElement.className;

      // Mount point
      const mount = doc.createElement("div");
      mount.id = "iframe-root";
      doc.body.appendChild(mount);

      setMountNode(mount);
      setReady(true);
    };

    iframe.addEventListener("load", setup);
    return () => {
      iframe.removeEventListener("load", setup);
      setReady(false);
      setMountNode(null);
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        width: `${width}px`,
        maxHeight,
        overflow: "hidden",
        borderRadius: "inherit",
      }}
    >
      <iframe
        ref={iframeRef}
        title="Mobile Preview"
        style={{
          width: `${width}px`,
          height: maxHeight,
          border: "none",
          display: "block",
        }}
        srcDoc="<!DOCTYPE html><html><head></head><body></body></html>"
      />
      {ready && mountNode && createPortal(children, mountNode)}
    </div>
  );
};

export default IframePreview;
