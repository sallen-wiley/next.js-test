import React from "react";
import { Box, Typography, Link } from "@mui/material";
import theme from "@/theme";

/**
 * PrimaryLogo component renders the primary logo SVG with an optional affix text.
 * @param affix - The affix text to show next to the logo. If not provided, affix is hidden.
 */
export default function PrimaryLogo({ affix }: { affix?: string }) {
  // If affix is not provided, do not show the affix section
  const showAffix = Boolean(affix);
  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap={3}>
      <Box maxHeight={80} maxWidth={300} overflow="clip">
        <Link href="/" underline="none" sx={{ display: "inline-block" }}>
          <svg
            width="134"
            height="29"
            viewBox="0 0 134 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M45.966 23.9209C45.966 25.6725 45.574 26.7985 44.3396 27.4908V27.7577H51.9964V27.5241C50.762 26.8318 50.3783 25.7058 50.3783 23.9543V9.03262C50.3783 7.36446 50.762 6.20509 51.9964 5.4711V5.23756H44.3396V5.43774C45.574 6.17173 45.966 7.29773 45.966 8.99925V23.9209ZM80.0381 27.7577L81.1141 23.0285L80.8806 22.9534C79.5711 25.0052 77.5442 25.856 74.5833 25.856H65.8421V9.2328C65.8421 7.3311 66.3092 6.23846 67.6187 5.4711V5.23756H59.9285V5.43774C61.1296 6.17173 61.4716 7.25603 61.4716 8.77406V24.1211C61.4716 25.7142 61.1296 26.7568 59.9285 27.4574V27.6909L80.0381 27.7577ZM117.313 27.4908L117.355 27.7243H125.095V27.4908C123.811 26.7568 123.427 25.5891 123.427 23.7291V18.4577L130.233 8.72401C131.476 6.93908 132.518 5.85478 133.402 5.4711V5.23756H127.405V5.43774C128.49 6.05496 128.64 7.56464 127.48 9.2328L122.476 16.4476L116.988 8.34034C116.154 7.09756 116.287 5.97155 117.296 5.43774V5.23756H108.839V5.43774C109.848 5.86312 110.465 6.43864 111.55 7.99002L119.056 18.7329V23.7374C119.056 25.5974 118.631 26.7651 117.388 27.4991M90.3974 14.8878V7.17262H98.4379C102.116 7.17262 103.509 7.75648 104.819 9.61647L105.052 9.54141L104.585 5.23756H84.4838V5.43774C85.6848 6.17173 86.0352 7.25603 86.0352 8.77406V24.1211C86.0352 25.7142 85.6848 26.7568 84.4838 27.4574V27.6909H105.636L106.412 23.1202L106.212 23.0368C104.86 24.8634 103.234 25.7892 99.5973 25.7892H90.4224V16.7145H96.5696C99.1969 16.7145 100.515 17.1399 101.215 18.2659H101.466V13.3782H101.199C100.498 14.5042 99.1802 14.9296 96.5529 14.9296L90.3974 14.8878ZM28.759 28.5H28.9508L38.4593 4.72878C39.3935 2.4434 40.2443 1.3174 41.095 0.816951V0.583407H35.3649V0.816951C36.566 1.47587 36.8412 3.2608 36.0238 5.31263L30.1853 19.9674L22.2282 0.5H22.0363L13.6956 19.934L7.71522 4.65371C7.02294 2.82708 7.21478 1.47587 8.34078 0.816951V0.583407H0V0.816951C0.892464 1.27569 1.55139 2.24322 2.36044 4.22833L12.1859 28.5H12.3777L20.6518 8.84078L28.759 28.5Z"
              fill="black"
            />
          </svg>
        </Link>
      </Box>
      {showAffix && (
        <Box display="flex" flexDirection="row" alignItems="center" gap={3}>
          <Box
            sx={{
              width: "1px",
              height: 42,
              bgcolor: "#d6d6d6",
              borderRadius: 1,
              mx: 2,
            }}
          />
          <Typography
            sx={{
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: 400,
              fontSize: 24,
              lineHeight: "24px",
              color: theme.palette.common.black,
              whiteSpace: "nowrap",
            }}
          >
            {affix ?? "{site.name}"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
