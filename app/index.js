import each from 'lodash/each'

import About from 'pages/About'
import Home from 'pages/Home'
import Collections from 'pages/Collections'
import Detail from 'pages/Detail'

import Preloader from 'components/Preloader'
import Navigation from 'components/Navigation'
import Canvas from 'components/Canvas'

class App {
  constructor() {
    this.createContent()

    this.createNavigation()
    this.createPreloader()
    this.createCanvas()
    this.createPages()

    this.addEventListeners()
    this.addLinkListeners()

    this.update()
  }

  createNavigation() {
    this.navigation = new Navigation({
      template: this.template
    })
  }

  createCanvas() {
    this.canvas = new Canvas()
  }

  createPreloader() {
    this.preloader = new Preloader();
    this.preloader.once("completed", this.onPreloaded.bind(this));
  }

  createContent() {
    this.content = document.querySelector(".content");
    this.template = this.content.getAttribute("data-template");
  }

  createPages() {
    this.pages = {
      home: new Home(),
      collections: new Collections(),
      about: new About(),
      detail: new Detail(),
    };
    this.page = this.pages[this.template];
    this.page.create();
  }

  // /////////
  // Events

  onPreloaded() {
    this.onResize();

    this.preloader.destroy();

    this.page.show();
  }

  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false
    })
  }

  async onChange({url, push= true}) {
    await this.page.hide();

    const request = await window.fetch(url);

    if (request.ok) {
      const html = await request.text();
      const div = document.createElement("div");

      if (push) {
        window.history.pushState({}, '', url)
      }

      div.innerHTML = html;

      const divContent = div.querySelector(".content");
      this.template = divContent.getAttribute("data-template");

      this.navigation.onChange(this.template)

      this.content.setAttribute(
        "data-template",
        divContent.getAttribute("data-template")
      );
      this.content.innerHTML = divContent.innerHTML;

      this.page = this.pages[this.template];

      this.page.create();
      this.onResize()
      this.page.show();

      this.addLinkListeners();
    } else {
      console.log("error");
    }
  }

  onResize() {
    if (this.canvas && this.canvas.onResize) {
      this.canvas.onResize()
    }

    if (this.page && this.page.onResize) {
      this.page.onResize();
    }
  }

  // /////////
  // Loops

  update() {
    if (this.canvas && this.canvas.update) {
      this.canvas.update()
    } 

    if (this.page && this.page.update) {
      this.page.update();
    }
    this.frame = window.requestAnimationFrame(this.update.bind(this));
  }

  // /////////
  // Listeners

  addLinkListeners() {
    const links = document.querySelectorAll("a");
    each(links, (link) => {
      link.onclick = (event) => {
        event.preventDefault();
        const { href } = link;

        this.onChange({url: href});
      };
    });
  }

  addEventListeners() {
    window.addEventListener('popstate', this.onPopState.bind(this))
    window.addEventListener("resize", this.onResize.bind(this));
  }
}

new App();