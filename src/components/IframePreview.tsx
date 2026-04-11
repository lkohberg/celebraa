import { useRef, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface IframePreviewProps {
  children: ReactNode;
  width: number;
  maxHeight?: string;
  className?: string;
  scaleToFit?: boolean;
}

/**
 * Renders children inside an <iframe> so that CSS media queries
 * (Tailwind sm:, md:, lg:) fire based on the iframe viewport width.
 */
const IframePreview = ({ children, width, maxHeight = "75vh", className, scaleToFit }: IframePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!scaleToFit || !containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        if (containerWidth > 0 && containerWidth < width) {
          setScale(containerWidth / width);
        } else {
          setScale(1);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [scaleToFit, width]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setup = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      doc.head.innerHTML = "";
      doc.body.innerHTML = "";

      const parentStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
      parentStyles.forEach((node) => {
        const clone = node.cloneNode(true) as HTMLElement;
        doc.head.appendChild(clone);
      });

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

      doc.documentElement.className = document.documentElement.className;

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

  if (scaleToFit) {
    return (
      <div ref={containerRef} className={className} style={{ width: "100%", height: maxHeight, overflow: "hidden", borderRadius: "inherit", position: "relative" }}>
        <div style={{
          width: `${width}px`,
          height: maxHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}>
          <iframe
            ref={iframeRef}
            title="Preview"
            style={{ width: `${width}px`, height: `calc(${maxHeight} / ${scale})`, border: "none", display: "block" }}
            srcDoc="<!DOCTYPE html><html><head></head><body></body></html>"
          />
          {ready && mountNode && createPortal(children, mountNode)}
        </div>
      </div>
    );
  }

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
