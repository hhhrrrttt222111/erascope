/**
 * Props every 3D scene receives. Kept free of three.js/R3F imports so the main
 * app can use it without pulling R3F's global JSX types into the MUI code.
 */
export interface SceneProps {
  /** False under prefers-reduced-motion: no auto-rotation, floating or animated textures. */
  animate: boolean;
  /** "demand" while off screen or reduced-motion, so nothing renders every frame. */
  frameloop: "always" | "demand";
  /** Drag-to-orbit. Off on small touch screens so the canvas never traps page scrolling. */
  interactive: boolean;
}
