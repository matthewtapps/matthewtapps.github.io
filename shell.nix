{
  pkgs ? import <nixpkgs> { },
}:
pkgs.mkShell {
  packages = with pkgs; [
    nodejs_22
    pnpm
    typescript-language-server
    htmx-lsp
  ];
}
