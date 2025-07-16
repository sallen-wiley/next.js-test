import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Divider from "@mui/material/Divider";

export default function ArticleCard() {
  return (
    <Card>
      <CardContent>
        {/* Title */}
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Article Title
        </Typography>
        {/* Metadata row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Chip label="Category" size="small" variant="outlined" />
          <span style={{ flex: 1 }} />
          <IconButton size="small">
            <StarBorderIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </div>
        {/* Divider */}
        <Divider sx={{ my: 2 }} />
        {/* Description */}
        <Typography variant="body2" color="text.primary">
          This is a short summary or description of the article. It provides a brief overview of the content.
        </Typography>
        {/* Metadata key-value row */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 16 }}>
          <Typography variant="body2">Author:</Typography>
          <Typography variant="body2" fontWeight={700}>Jane Doe</Typography>
          <Typography variant="body2">Date:</Typography>
          <Typography variant="body2" fontWeight={700}>05 June 2025</Typography>
        </div>
      </CardContent>
      <CardActions>
        {/* Example action button */}
      </CardActions>
    </Card>
  );
}
