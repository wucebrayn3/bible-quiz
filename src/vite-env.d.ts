/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly;
  VITE_GIST_ID;
  readonly: VITE_GIST_TOKEN;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
