/**
 * Photographs from work, passing under the Experience heading.
 *
 * Files live in `public/work`. Encode them the way the travel photographs are
 * (see `public/photos/README.md`) — 1100px on the long side, EXIF rotation
 * baked into the pixels and the metadata stripped — so `aspect` below is simply
 * the file's own ratio and nothing is ever cropped.
 */
export interface WorkPhoto {
  src: string;
  alt: string;
  /** Printed under the frame, exactly as written. Keep it to a line or two. */
  caption: string;
  /** The words of `caption` set in bold, wherever they fall — usually the role. */
  bold?: string;
  /** width ÷ height of the file. The frame takes this, so nothing is cropped. */
  aspect: number;
  /**
   * A silent clip to play in the frame. `src` is then its poster: a still taken
   * from the clip at the clip's own size, shown until the reel nears the
   * viewport and throughout under prefers-reduced-motion. Encode it H.264 with
   * no audio track and no metadata, `-movflags +faststart`, a couple of MB.
   */
  video?: string;
}

/** In the order they pass. While this is empty the reel does not render. */
export const workPhotos: WorkPhoto[] = [
  {
    src: "/work/argo-ai.jpg",
    alt: "Standing beside an Argo AI autonomous test vehicle, a white Ford with a sensor pod on its roof.",
    caption: "Argo AI Internship: autonomous Argo vehicle on which I applied my SFDM algorithm",
    bold: "Argo AI Internship",
    aspect: 1.03,
  },
  {
    src: "/work/fogarty-innovation.jpg",
    alt: "Speaking into a microphone in front of a Fogarty Innovation banner, another presenter standing behind.",
    caption: "Fogarty Innovation Internship: Final Showcase at Fogarty",
    bold: "Fogarty Innovation Internship",
    aspect: 1.5,
  },
  {
    src: "/work/skywalk-vr.jpg",
    alt: "Wearing a HoloLens headset and reaching out to a virtual interface, sensors on two fingers.",
    caption: "Skywalk Internship: using the VR app I made",
    bold: "Skywalk Internship",
    aspect: 1.333,
  },
  {
    src: "/work/skywalk-wristworn-2.jpg",
    alt: "A raised hand wearing Skywalk's second wristworn prototype: a white puck with a glowing logo, wired to sensors on two fingertips.",
    caption: "Skywalk Internship: wristworn device we made",
    bold: "Skywalk Internship",
    aspect: 0.66,
  },
  {
    src: "/work/immergo-labs.jpg",
    alt: "A large group photo of the Immergo Labs team in a conference room, the Immergo Labs title slide on the screen behind them.",
    caption:
      "Immergo Labs Internship: our team after hosting our first VR physical therapy user study",
    bold: "Immergo Labs Internship",
    aspect: 1.333,
  },
  {
    src: "/work/immergo-labs-planning.jpg",
    alt: "The Immergo Labs team around a long wooden conference table, one member presenting at a whiteboard covered in sticky notes.",
    caption: "Immergo Labs Internship: our team planning our VR physical therapy user study",
    bold: "Immergo Labs Internship",
    aspect: 1.328,
  },
  {
    src: "/work/abbott-mitraclip.jpg",
    alt: "Demonstrating an Abbott MitraClip delivery system on a training stand, the device's generations on the slide behind.",
    caption: "Abbott Laboratories: demoing the MitraClip delivery system",
    bold: "Abbott Laboratories",
    aspect: 1.333,
  },
  {
    src: "/work/skywalk-skrilla.jpg",
    alt: "Holding a HoloLens headset over the eyes of Skrilla, a small tan dog curled up on a fluffy blanket.",
    caption: "Skywalk Internship: Skrilla the dog trying out the VR app I made",
    bold: "Skywalk Internship",
    aspect: 0.75,
  },
  //{
    //src: "/work/fogarty-final-presentation.jpg",
    //alt: "Arm in arm with a colleague in front of a Fogarty Innovation screen reading “Shaping the future of human health.”",
    //caption: "Fogarty Innovation Internship: Fogarty Innovation presentation",
    //bold: "Fogarty Innovation Internship",
    //aspect: 0.75,
  //},
  {
    src: "/work/immergo-labs-vr.jpg",
    alt: "Two avatars, “ash-PT” and “mike,” standing in a virtual therapy clinic beside a floating panel graphing elbow flexion.",
    caption: "Immergo Labs Internship: company founders interacting in the VR environment I made",
    bold: "Immergo Labs Internship",
    aspect: 1.167,
  },
  {
    src: "/work/argo-ai-sensor-data.jpg",
    alt: "Four panels of sensor data from an Argo AI vehicle: two street camera feeds and their lidar point clouds, with detected cars and objects outlined in 3D boxes.",
    caption: "Argo AI Internship: autonomous vehicle collecting sensor data for my diagnostic app",
    bold: "Argo AI Internship",
    aspect: 1.778,
  },
];
