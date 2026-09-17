import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { Diver } from "./Diver";

/**
 * The wash, end to end.
 *
 * The crest takes about five seconds to cross the viewport and the water
 * spends what is left draining after it — slow enough to be watched, which is
 * the whole point of it.
 *
 * TIDE_MS reaches the stylesheet as a custom property on the tide itself, so
 * the CSS cannot fall out of step with the timer here.
 */
const TIDE_MS = 6000;

const TideContext = createContext<() => void>(() => {});

/** Raises the tide. One already up is left to run rather than restarted. */
export function useTide(): () => void {
  return useContext(TideContext);
}

/**
 * Holds the tide above the pages rather than inside one.
 *
 * The dive changes the page while the water is still over the screen, so the
 * tide cannot belong to the button that raised it — that unmounts with the
 * beach, halfway through the wash. Mounted once in the root, it carries on
 * draining over the page it delivered the reader to.
 *
 * The diver is here for the same reason and on the same clock: she is in the
 * water well before the page turns, but she is only in the water because the
 * tide put it there, and the two are raised together or not at all.
 */
export function TideProvider({ children }: { children: ReactNode }) {
  const [up, setUp] = useState(false);
  const outRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (outRef.current !== null) clearTimeout(outRef.current);
    },
    [],
  );

  const raise = useCallback(() => {
    if (outRef.current !== null) return;
    setUp(true);
    outRef.current = window.setTimeout(() => {
      outRef.current = null;
      setUp(false);
    }, TIDE_MS);
  }, []);

  return (
    <TideContext.Provider value={raise}>
      {children}
      {up && <Diver />}
      {up && <Tide />}
    </TideContext.Provider>
  );
}

/**
 * The tide.
 *
 * One sheet of water travelling down the viewport, leading edge first. The
 * water runs the full height of the sheet and the foam is a *band* riding on
 * its front edge — not a white fill from the top down, which is what a plain
 * closed path gives you and what reads as a slab rather than as surf. The band
 * is made by masking the whole foam layer so it dissolves upward into the
 * water, exactly the way the back of real foam thins out into what it came off.
 *
 * Three edges, because surf has no single outline: a soft wash furthest up, a
 * foam body, and a bright ragged lip at the front, each on its own run of
 * uneven lobes so no two line up. Only the sheet's transform and opacity move;
 * everything else is painted once and carried, so the wash stays compositor
 * work while the page changes underneath it.
 */
function Tide() {
  return (
    <div
      className="dive-tide"
      aria-hidden="true"
      data-print="hide"
      style={{ "--tide-ms": `${TIDE_MS}ms` } as CSSProperties}
    >
      <div className="dive-tide-sheet">
        <div className="dive-tide-water" />
        <div className="dive-tide-crest">
          <svg viewBox="0 0 1440 260" preserveAspectRatio="none">
            <defs>
              <filter id="dive-foam-wash" x="-4%" y="-30%" width="108%" height="180%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <filter id="dive-foam-body" x="-4%" y="-30%" width="108%" height="180%">
                <feGaussianBlur stdDeviation="2.4" />
              </filter>
              <filter id="dive-foam-lip" x="-4%" y="-30%" width="108%" height="180%">
                <feGaussianBlur stdDeviation="0.8" />
              </filter>
            </defs>
            <path
              className="dive-tide-wave-wash"
              filter="url(#dive-foam-wash)"
              d="M0 0H1440V112C1410 126 1382 134 1352 128C1322 122 1304 104 1276 102C1246 100 1222 118 1192 126C1162 134 1134 126 1116 110C1098 94 1078 84 1050 90C1022 96 1004 116 974 124C944 132 916 124 898 108C880 92 862 82 834 88C806 94 788 114 758 122C728 130 700 122 682 106C664 90 646 80 618 86C590 92 572 112 542 120C512 128 484 120 466 104C448 88 430 78 402 84C374 90 356 110 326 118C296 126 268 118 250 102C232 86 214 76 186 82C158 88 140 108 110 116C80 124 40 118 0 106Z"
            />
            <path
              className="dive-tide-wave-body"
              filter="url(#dive-foam-body)"
              d="M0 0H1440V150C1418 166 1396 176 1370 172C1342 168 1326 148 1300 144C1274 140 1254 160 1226 170C1198 180 1172 174 1154 158C1136 142 1118 130 1094 136C1068 142 1052 164 1024 172C996 180 970 172 952 156C934 140 918 128 894 134C868 140 852 162 824 170C796 178 770 170 752 154C734 138 718 126 694 132C668 138 652 160 624 168C596 176 570 168 552 152C534 136 518 124 494 130C468 136 452 158 424 166C396 174 370 166 352 150C334 134 318 122 294 128C268 134 252 156 224 164C196 172 170 164 152 148C134 132 118 120 94 126C70 132 42 152 0 150Z"
            />
            <path
              className="dive-tide-wave-lip"
              filter="url(#dive-foam-lip)"
              d="M0 0H1440V178C1430 196 1414 210 1396 208C1372 205 1364 176 1338 170C1300 161 1286 214 1246 218C1216 221 1200 196 1184 186C1170 177 1150 172 1134 182C1112 195 1104 212 1078 214C1046 216 1032 178 1004 174C982 171 968 196 944 202C918 209 900 190 884 178C866 165 842 166 830 182C816 200 806 216 782 214C752 211 742 172 714 170C690 168 678 200 654 210C630 220 610 206 598 190C588 177 570 168 556 180C538 195 532 214 508 216C478 218 466 180 440 176C416 172 402 202 378 210C354 218 336 204 326 188C317 175 300 170 286 182C270 196 262 213 238 214C210 215 198 178 172 174C150 170 138 198 116 208C94 218 74 212 58 198C44 186 24 182 0 190Z"
            />
          </svg>
          <div className="dive-tide-lace" />
          <div className="dive-tide-ahead" />
        </div>
      </div>
    </div>
  );
}
