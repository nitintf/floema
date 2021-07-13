import gsap from "gsap";

import Animation from "classes/Animation";

export default class Highlight extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });
  }

  animateIn() {
    this.timelineIn = gsap.timeline({
      delay: 0.7,
    });
    this.timelineIn.fromTo(this.element, {
      scale: 1.2,
      autoAlpha: 0
    },{
      autoAlpha: 1,
      scale: 1,
      ease: 'expo.out',
      duration: 1.5
    });
  }

  animateOut() {
    gsap.set(this.elementLines, {
      autoAlpha: 0,
    });
  }
}
