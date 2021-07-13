import gsap from "gsap";
import { each } from "lodash";

import Animation from "classes/Animation";

import { calculate,split } from "utils/text";

export default class Title extends Animation {
  constructor({element, elements}) {
    super({
      element,
      elements
    })

    split({
      element: this.element,
      append: true
    });

    split({
      element: this.element,
      append: true,
    });

    this.elementLinesSpans = this.element.querySelectorAll('span span')

  }

  animateIn() {

    this.timelineIn = gsap.timeline({
      delay: 0.5
    })
    this.timelineIn.set(this.elementLines, {
      autoAlpha: 1,
    });

    each(this.elementLines, (line, index) => {
       this.timelineIn.fromTo(
         line,
         {
           y: "100%",
         },
         {
           delay: index * 0.2,
           duration: 1.5,
           y: "0%",
           ease: "expo.out",
         }, 0
       );
    })
  }

  animateOut() {
    gsap.set(this.elementLines, {
      autoAlpha: 0,
    });
  }

  onResize() {
    this.elementLines = calculate(this.elementLinesSpans)
  }
};
