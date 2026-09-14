import type { WorkPhoto } from "@/data/work";

/**
 * Hospital work — the time spent on the ward rather than at the desk.
 *
 * It earns a section of its own because it is the reason the rest of the page
 * looks the way it does: the clinical NLP, the wound classifier, the neonatal
 * sepsis panel are all built for people met here first.
 */
export interface ShadowingPlacement {
  hospital: string;
  location: string;
  departments: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  detail: string;
}

export const shadowing: ShadowingPlacement[] = [
  {
    hospital: "Stanford Hospital",
    location: "Stanford, CA",
    departments: [
      "Neurosurgery",
      "Neurology",
      "Pediatric cardiology",
      "General surgery",
      "Emergency department",
    ],
  },
  {
    hospital: "El Camino Hospital",
    location: "Mountain View, CA",
    departments: ["General surgery", "Gynecology", "Radiology"],
  },
];

export const certifications: Certification[] = [
  {
    name: "Medical Diagnosis & Treatment",
    issuer: "John A. Burns School of Medicine, University of Hawaiʻi",
    year: "2018",
    detail:
      "A medical school certification in diagnosis and treatment, taken while still at school in Honolulu.",
  },
];

export const clinicalNote =
  "Textbooks don't show you what a procedure actually looks like in practice. I shadow to see that: how a team moves through a case, where the pace slows because of a bottleneck with the technology, and which steps take more attention. Even in a well-equipped hospital, the gaps are there, just smaller and more specific than a textbook would suggest. Since I come from a bioengineering background, I look at things from a biodesign perspective and shadow for the purposes of identifying unmet clinical needs."
/**
 * Photographs from the hospital, passing under the Hospital Work heading on the
 * same reel the Experience section opens with.
 *
 * Files live in `public/hospital`, encoded exactly as `src/data/work.ts`
 * describes, so `aspect` is the file's own ratio. In the order they pass; while
 * this is empty the reel does not render.
 */
export const hospitalPhotos: WorkPhoto[] = [
  {
    src: "/hospital/el-camino-dissection.jpg",
    alt: "Smiling in safety glasses and purple gloves at a steel dissection table, holding a heart in both hands, instruments laid out alongside.",
    caption: "Heart dissection at El Camino Hospital",
    bold: "El Camino Hospital",
    aspect: 0.75,
  },
  {
    src: "/hospital/stanford-fls-training.jpg",
    alt: "In a surgical mask at a Fundamentals of Laparoscopic Surgery trainer, working two laparoscopic instruments while a monitor beside it shows the camera view inside.",
    caption:
      "Me doing the simulation & skills training lab for the Fundamentals of Laparoscopic Surgery exam at Stanford Hospital",
    bold: "Stanford Hospital",
    aspect: 1.333,
  },
  {
    src: "/hospital/el-camino-interns.jpg",
    alt: "A large group of interns in matching light-blue scrubs posed in a wood-panelled lobby, four of them sitting on the floor in front.",
    caption: "Me and the other interns at El Camino Hospital",
    bold: "El Camino Hospital",
    aspect: 1.5,
  },
  {
    src: "/hospital/el-camino-da-vinci.jpg",
    alt: "Eight interns in blue scrubs and bouffant caps huddled together in an operating room, the arms of a da Vinci Xi surgical robot behind them.",
    caption:
      "Me and the other interns after receiving training on the Da Vinci machine at El Camino Hospital",
    bold: "El Camino Hospital",
    aspect: 1.333,
  },
  {
    src: "/hospital/stanford-laparoscopic-training.jpg",
    alt: "Standing on a step stool in a surgical mask, working laparoscopic instruments through a practice box trainer while other students look on.",
    caption: "Me learning how to do laparoscopic surgery at Stanford Hospital",
    bold: "Stanford Hospital",
    aspect: 1.333,
  },
  {
    src: "/hospital/stanford-simulation-lab.jpg",
    alt: "Students taking notes around a simulation mannequin as a surgeon demonstrates an ultrasound probe, a da Vinci console and a bank of monitors behind them.",
    caption: "Me in a medical training simulation lab at Stanford Hospital",
    bold: "Stanford Hospital",
    aspect: 1.333,
  },
  {
    src: "/hospital/lucile-packard-surgery.jpg",
    alt: "A selfie with a friend in blue scrubs and surgical caps, masks pulled down, under an “E20 Surgery Waiting” sign in a hospital corridor.",
    caption:
      "Me after shadowing a pediatric cardiothoracic surgery at Lucile Packard Children's Hospital",
    bold: "Lucile Packard Children's Hospital",
    aspect: 1.343,
  },
  {
    src: "/hospital/stanford-or.jpg",
    alt: "A low-angle selfie in an operating room under green light, in scrubs, a mask and laser-safety glasses beside a colleague, the wall clock reading 9:39.",
    caption: "Me in the OR at Stanford Hospital",
    bold: "Stanford Hospital",
    aspect: 1.338,
  },
  {
    src: "/hospital/stanford-emergency-department.jpg",
    alt: "Giving a thumbs up in a white Stanford Medicine coat with a stethoscope around the neck, in an emergency department room.",
    caption: "Me shadowing in the emergency department at Stanford Hospital",
    bold: "Stanford Hospital",
    aspect: 0.748,
  },
  {
    src: "/hospital/stanford-12-hour-shift.jpg",
    alt: "Standing with a colleague in blue scrubs, masks, caps and shoe covers in a hospital ward, empty beds lined up behind them.",
    caption: "Me working a 12 hour shift at Stanford Hospital",
    bold: "Stanford Hospital",
    aspect: 0.747,
  },
  {
    src: "/hospital/stanford-neurosurgery-or.jpg",
    alt: "Surgeons in gowns and caps at work over the operating table under the surgical lights, a gowned team member seated beside the draped instrument table.",
    caption: "My POV while shadowing in the neurosurgery OR at Stanford Hospital",
    bold: "Stanford Hospital",
    aspect: 1.341,
  },
  {
    src: "/hospital/stanford-da-vinci.jpg",
    alt: "Sitting at a da Vinci surgeon console in a training lab, a monitor tower beside it showing a simulated exercise.",
    caption: "Me learning to use the Da Vinci machine at Stanford Hospital",
    bold: "Stanford Hospital",
    aspect: 1.334,
  },
  {
    src: "/hospital/el-camino-da-vinci-console.jpg",
    alt: "Sitting in blue scrubs and a bouffant cap beside a da Vinci Xi surgeon console, one hand resting on its controls.",
    caption: "Me using the Da Vinci machine at El Camino Hospital",
    bold: "El Camino Hospital",
    aspect: 0.75,
  },
  {
    src: "/hospital/el-camino-da-vinci-practice-poster.jpg",
    video: "/hospital/el-camino-da-vinci-practice.mp4",
    alt: "Seated at a da Vinci Xi surgeon console in blue scrubs and a bouffant cap, looking into the viewer while the robot's arms work on a practice pad.",
    caption:
      "Me practicing a laparoscopic surgery using the Da Vinci machine at El Camino Hospital",
    bold: "El Camino Hospital",
    aspect: 0.5625,
  },
];
