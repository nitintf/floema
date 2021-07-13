import gsap from "gsap/gsap-core"

class Colors {
  change({
    backgroundColor,
    color
  }) {
    gsap.to(document.documentElement, {
      backgroundColor,
      color,
      duration: 1.5,
    })
  }
};

export const ColorsManager = new Colors()
