/// <reference types="vite/client" />

// vite-imagetools query modules — return a URL string.
declare module "*&as=srcset" {
  const src: string;
  export default src;
}
declare module "*&format=webp" {
  const src: string;
  export default src;
}
declare module "*&format=jpg" {
  const src: string;
  export default src;
}
declare module "*&format=avif" {
  const src: string;
  export default src;
}
