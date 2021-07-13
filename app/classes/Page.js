import GSAP from 'gsap'
import {each, map} from 'lodash'
import Prefix from 'prefix'
import NormalizeWheel from 'normalize-wheel'

import { ColorsManager } from "classes/Colors";
import AsyncLoad from 'classes/AsyncLoad';

import Title from 'animations/Title'
import Paragraph from 'animations/Paragraph'
import Label from 'animations/label'
import Highlight from 'animations/Highlight'

export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,

      animationsTitles: '[data-animations="title"]',
      animationsParagraphs: '[data-animations="paragraph"]',
      animationsLabels: '[data-animations="label"]',
      animationsHighlights: '[data-animations="highlight"]',

      preloaders: "[data-src]",
    };
    this.id = id;

    this.transformPrefix = Prefix("transform");

    this.onMouseWheelEvent = this.onMouseWheel.bind(this);
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
    };

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray[entry]
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });

    this.createAnimations();
    this.createPreloader();
  }

  createAnimations() {
    this.animations = [];

    // Titles
    this.animationsTitles = map(this.elements.animationsTitles, (element) => {
      return new Title({
        element,
      });
    });

    this.animations.push(...this.animationsTitles);

    // Paragraphs
    this.animationsParagraphs = map(
      this.elements.animationsParagraphs,
      (element) => {
        return new Paragraph({
          element,
        });
      }
    );
    this.animations.push(...this.animationsParagraphs);

    // Labels
    this.animationsLabels = map(this.elements.animationsLabels, (element) => {
      return new Label({
        element,
      });
    });
    this.animations.push(...this.animationsLabels);

    // Highlight
    this.animationsHighlights = map(
      this.elements.animationsHighlights,
      (element) => {
        return new Highlight({
          element,
        });
      }
    );
    this.animations.push(...this.animationsHighlights);
  }

  createPreloader() {
    this.preloaders = map(this.elements.preloaders, (element) => {
      return new AsyncLoad({ element });
    });
  }

  // Animation

  show() {
    return new Promise((resolve) => {
      ColorsManager.change({
        backgroundColor: this.element.getAttribute("data-background"),
        color: this.element.getAttribute("data-color"),
      });

      this.animationIn = GSAP.timeline();

      this.animationIn.fromTo(
        this.element,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
        }
      );

      this.animationIn.call((_) => {
        this.addEventListeners();
        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.destroy()
      this.animationOut = GSAP.timeline();

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  // events

  onMouseWheel(event) {
    const { pixelY } = NormalizeWheel(event);

    this.scroll.target += pixelY;
  }

  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight;
    }

    each(this.animations, (animation) => {
      animation.onResize();
    });
  }

  // Loops

  update() {
    this.scroll.target = GSAP.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target
    );

    this.scroll.current = GSAP.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      0.03
    );

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }

    if (this.elements.wrapper) {
      this.elements.wrapper.style[
        this.transformPrefix
      ] = `translateY(-${this.scroll.current}px)`;
    }
  }

  // Listeners

  addEventListeners() {
    window.addEventListener("mousewheel", this.onMouseWheelEvent);
  }

  removeEventLiseners() {
    window.removeEventListener("mousewheel", this.onMouseWheelEvent);
  }

  // Destroy  
  destroy() {
    this.removeEventLiseners()
  }
}



