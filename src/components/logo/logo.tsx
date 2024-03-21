import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  singleMode?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, singleMode = false, sx, ...other }, ref) => {
    // const theme = useTheme();

    const settings = useSettingsContext();

    const isNavMini = settings.themeLayout === 'mini';

    // const PRIMARY_LIGHT = theme.palette.primary.light;

    // const PRIMARY_MAIN = theme.palette.primary.main;

    // const PRIMARY_DARK = theme.palette.primary.dark;

    // OR using local (public folder)
    // -------------------------------------------------------
    const logo = (
      <Box
        component="img"
        src={isNavMini || singleMode ? '/logo/gbb_single.svg' : '/logo/gbb_full.svg'}
        sx={{ width: 146, height: 40, cursor: 'pointer', ...sx }}
      />
    );

    // const logo = (
    //   <Box
    //     ref={ref}
    //     component="div"
    //     sx={{
    //       width: 42,
    //       height: 42,
    //       display: 'inline-flex',
    //       ...sx,
    //     }}
    //     {...other}
    //   >
    //     <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
    //       <path d="M326 170C326 185.464 313.464 198 298 198H276.961C261.612 198 248.139 208.219 244 223V223V154C244 138.536 256.536 126 272 126L298 126C313.464 126 326 138.536 326 154V170Z" fill="url(#paint0_linear_866_55663)" />
    //       <path d="M352 198H288L326 157L326.326 162.054C327.351 177.944 337.302 191.876 352 198Z" fill="url(#paint1_linear_866_55663)" />
    //       <path d="M191 342C191 326.536 203.536 314 219 314H240.039C255.388 314 268.861 303.781 273 289V289V358C273 373.464 260.464 386 245 386H219C203.536 386 191 373.464 191 358V342Z" fill="url(#paint2_linear_866_55663)" />
    //       <path d="M165 314H229L191 355L190.674 349.946C189.649 334.056 179.698 320.124 165 314Z" fill="url(#paint3_linear_866_55663)" />
    //       <path d="M295.007 207.977C296.783 202.055 302.234 198 308.416 198H385C392.732 198 399 204.268 399 212V236.527C399 243.491 398.294 250.437 396.892 257.258L391.423 283.876C386.495 307.856 378.456 331.089 367.507 352.985V352.985C357.391 373.219 336.71 386 314.088 386H230H240.707C247.297 386 252.995 381.404 254.39 374.962L273 289L286 238L295.007 207.977Z" fill="url(#paint4_linear_866_55663)" />
    //       <path d="M218.191 304.427C216.285 310.144 210.935 314 204.909 314H128C120.268 314 114 307.732 114 300V275.473C114 268.509 114.706 261.563 116.108 254.742L121.577 228.124C126.505 204.144 134.544 180.911 145.493 159.015V159.015C155.609 138.781 176.29 126 198.912 126H283V126C274.189 126 266.514 132.008 264.397 140.561L244 223L228 275L218.191 304.427Z" fill="url(#paint5_linear_866_55663)" />
    //       <defs>
    //         <linearGradient id="paint0_linear_866_55663" x1="347" y1="198" x2="279" y2="130" gradientUnits="userSpaceOnUse">
    //           <stop stop-color="#086EA1" />
    //           <stop offset="1" stop-color="#0F4B6E" />
    //         </linearGradient>
    //         <linearGradient id="paint1_linear_866_55663" x1="347" y1="198" x2="279" y2="130" gradientUnits="userSpaceOnUse">
    //           <stop stop-color="#086EA1" />
    //           <stop offset="1" stop-color="#0F4B6E" />
    //         </linearGradient>
    //         <linearGradient id="paint2_linear_866_55663" x1="266" y1="301.125" x2="183.824" y2="352.107" gradientUnits="userSpaceOnUse">
    //           <stop stop-color="#0840C0" />
    //           <stop offset="1" stop-color="#1868E9" />
    //         </linearGradient>
    //         <linearGradient id="paint3_linear_866_55663" x1="266" y1="301.125" x2="183.824" y2="352.107" gradientUnits="userSpaceOnUse">
    //           <stop stop-color="#0840C0" />
    //           <stop offset="1" stop-color="#1868E9" />
    //         </linearGradient>
    //         <linearGradient id="paint4_linear_866_55663" x1="314.5" y1="198" x2="314.5" y2="386" gradientUnits="userSpaceOnUse">
    //           <stop stop-color="#1582E5" />
    //           <stop offset="1" stop-color="#6BD6FF" />
    //         </linearGradient>
    //         <linearGradient id="paint5_linear_866_55663" x1="198.5" y1="314" x2="198.5" y2="126" gradientUnits="userSpaceOnUse">
    //           <stop stop-color="#53D897" />
    //           <stop offset="0.484375" stop-color="#00A7D6" />
    //           <stop offset="1" stop-color="#02BCE7" />
    //         </linearGradient>
    //       </defs>
    //     </svg>

    //     {/* <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
    //       <defs>
    //         <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
    //           <stop offset="0%" stopColor={PRIMARY_DARK} />
    //           <stop offset="100%" stopColor={PRIMARY_MAIN} />
    //         </linearGradient>

    //         <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
    //           <stop offset="0%" stopColor={PRIMARY_LIGHT} />
    //           <stop offset="100%" stopColor={PRIMARY_MAIN} />
    //         </linearGradient>

    //         <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
    //           <stop offset="0%" stopColor={PRIMARY_LIGHT} />
    //           <stop offset="100%" stopColor={PRIMARY_MAIN} />
    //         </linearGradient>
    //       </defs>

    //       <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
    //         <path
    //           fill="url(#BG1)"
    //           d="M183.168 285.573l-2.918 5.298-2.973 5.363-2.846 5.095-2.274 4.043-2.186 3.857-2.506 4.383-1.6 2.774-2.294 3.939-1.099 1.869-1.416 2.388-1.025 1.713-1.317 2.18-.95 1.558-1.514 2.447-.866 1.38-.833 1.312-.802 1.246-.77 1.18-.739 1.111-.935 1.38-.664.956-.425.6-.41.572-.59.8-.376.497-.537.69-.171.214c-10.76 13.37-22.496 23.493-36.93 29.334-30.346 14.262-68.07 14.929-97.202-2.704l72.347-124.682 2.8-1.72c49.257-29.326 73.08 1.117 94.02 40.927z"
    //         />
    //         <path
    //           fill="url(#BG2)"
    //           d="M444.31 229.726c-46.27-80.956-94.1-157.228-149.043-45.344-7.516 14.384-12.995 42.337-25.267 42.337v-.142c-12.272 0-17.75-27.953-25.265-42.337C189.79 72.356 141.96 148.628 95.69 229.584c-3.483 6.106-6.828 11.932-9.69 16.996 106.038-67.127 97.11 135.667 184 137.278V384c86.891-1.611 77.962-204.405 184-137.28-2.86-5.062-6.206-10.888-9.69-16.994"
    //         />
    //         <path
    //           fill="url(#BG3)"
    //           d="M450 384c26.509 0 48-21.491 48-48s-21.491-48-48-48-48 21.491-48 48 21.491 48 48 48"
    //         />
    //       </g>
    //     </svg> */}
    //   </Box>
    // );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
