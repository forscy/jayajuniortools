import {
  Box,
} from "@mui/material";

// Icons
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

export const StarRating = ({ rating }: { rating: any }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <Box sx={{ display: "flex", alignItems: "center", color: "warning.500" }}>
      {Array(5)
        .fill(0)
        .map((_, index) => {
          if (index < fullStars) {
            return <StarIcon key={index} fontSize="small" />;
          } else if (index === fullStars && hasHalfStar) {
            return <StarHalfIcon key={index} fontSize="small" />;
          } else {
            return <StarOutlineIcon key={index} fontSize="small" />;
          }
        })}
    </Box>
  );
};
