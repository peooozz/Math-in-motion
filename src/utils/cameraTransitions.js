/**
 * cameraTransitions.js
 * GSAP-based camera fly-to helpers for hub ↔ module transitions.
 */
import gsap from 'gsap';

/**
 * Animate the camera from its current position/target to a new one.
 * @param {THREE.Camera} camera
 * @param {Object} opts
 * @param {[number,number,number]} opts.position – target camera position
 * @param {[number,number,number]} opts.lookAt – target lookAt point
 * @param {number} [opts.duration=1.5]
 * @param {Function} [opts.onStart]
 * @param {Function} [opts.onComplete]
 * @param {Object} [opts.controlsRef] – OrbitControls ref to update target
 */
export function flyCamera(camera, opts = {}) {
  const {
    position = [0, 0, 5],
    lookAt = [0, 0, 0],
    duration = 1.5,
    onStart,
    onComplete,
    controlsRef,
  } = opts;

  // Animate a proxy lookAt target so we can smoothly interpolate
  const lookAtProxy = {
    x: controlsRef?.current?.target?.x ?? 0,
    y: controlsRef?.current?.target?.y ?? 0,
    z: controlsRef?.current?.target?.z ?? 0,
  };

  const tl = gsap.timeline({
    onStart,
    onComplete,
  });

  // Camera position
  tl.to(
    camera.position,
    {
      x: position[0],
      y: position[1],
      z: position[2],
      duration,
      ease: 'power2.inOut',
    },
    0
  );

  // LookAt target (update controls if available, otherwise manual lookAt)
  tl.to(
    lookAtProxy,
    {
      x: lookAt[0],
      y: lookAt[1],
      z: lookAt[2],
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (controlsRef?.current) {
          controlsRef.current.target.set(
            lookAtProxy.x,
            lookAtProxy.y,
            lookAtProxy.z
          );
          controlsRef.current.update();
        } else {
          camera.lookAt(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z);
        }
      },
    },
    0
  );

  return tl;
}
