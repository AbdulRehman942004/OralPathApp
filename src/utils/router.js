// Minimal hash-based router. Avoids react-router-dom so we keep the bundle small
// and we can serve from any static host (incl. GitHub Pages) without rewrites.

import { useEffect, useState } from "react";

const parseHash = () => {
  const h = window.location.hash.replace(/^#/, "") || "/";
  const [path, query = ""] = h.split("?");
  const params = Object.fromEntries(new URLSearchParams(query).entries());
  return { path, params };
};

export const useRoute = () => {
  const [route, setRoute] = useState(parseHash());
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
};

export const navigate = (path, params) => {
  let url = `#${path.startsWith("/") ? path : "/" + path}`;
  if (params && Object.keys(params).length) {
    url += "?" + new URLSearchParams(params).toString();
  }
  if (window.location.hash !== url) {
    window.location.hash = url;
  }
};

export const Link = ({ to, params, className, children, ...rest }) => {
  const href = (() => {
    let url = `#${to.startsWith("/") ? to : "/" + to}`;
    if (params && Object.keys(params).length) {
      url += "?" + new URLSearchParams(params).toString();
    }
    return url;
  })();
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
};
