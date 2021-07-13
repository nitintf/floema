import gsap from 'gsap'
import { each } from 'lodash'

import Animation from 'classes/Animation'

import { calculate, split } from 'utils/text'


export default class Paragraph extends Animation {
  constructor({element, elements}) {
    super({
      element,
      elements
    })

    this.elementLinesSpans = split({
      element: this.element,
      append: true,
    });
  }

  animateIn() {
   this.timelineIn = gsap.timeline({
     delay: 0.5,
   });
   this.timelineIn.set(this.element, {
     autoAlpha: 1,
   });

   each(this.elementLines, (line, index) => {
     this.timelineIn.fromTo(
       line,
       {
         y: "100%",
         autoAlpha: 0,
       },
       {
         delay: index * 0.2,
         duration: 1.5,
         y: "0%",
         ease: "expo.out",
         autoAlpha: 1
       },
       0
     );
   });
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
