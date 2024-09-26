import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function PrayerCards({ name, time, image }) {
  return (
    <Card sx={{ width: 250 }} style={{ marginTop: "10px" }}>
      <CardMedia sx={{ height: 140 }} image={image} title="prayer name" />
      <CardContent>
        <h3>{name}</h3>
        <Typography variant="h2" sx={{ color: "text.secondary" }}>
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}

// Add PropTypes validation
PrayerCards.propTypes = {
  name: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired, // Adjust if time is a different type (e.g., number)
  image: PropTypes.string.isRequired, // Image should be a string URL
};
