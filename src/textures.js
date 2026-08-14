// Grille de texte (1 caractère = 1 pixel) + palette → THREE.CanvasTexture nette.
import * as THREE from "three";

export function gridToCanvas(grid, palette) {
  const h = grid.length;
  const w = Math.max(...grid.map((r) => r.length));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  for (let y = 0; y < h; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === "." || ch === " ") continue;
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvas;
}

export function makeTexture(grid, palette) {
  const tex = new THREE.CanvasTexture(gridToCanvas(grid, palette));
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Matériau pour sprites avec transparence (persos, meubles)
export function makeSpriteMaterial(texture) {
  return new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.1 });
}

// Matériau opaque (tuiles de sol/mur)
export function makeOpaqueMaterial(texture) {
  return new THREE.MeshBasicMaterial({ map: texture });
}
