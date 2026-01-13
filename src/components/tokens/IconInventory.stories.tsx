import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";

/**
 * Icon Inventory - ReX Migration
 *
 * Complete inventory of ReX icons with their Material UI equivalents,
 * descriptions, usage guidelines, and current status.
 */

interface IconData {
  name: string;
  muiName: string;
  description: string;
  usage: string;
  status: string; // Faithful migration from Figma - includes: Active, Deprecated, Upcoming, Pending, Not used, ?, -, and empty
}

// Icon inventory data - extracted from Figma
const iconInventory: IconData[] = [
  {
    name: "loading",
    muiName: "cached",
    description: 'if stand alone, always animated (spinning) "Loading" or "Loading (object)" if possible. if button, "Update (object)"',
    usage: "Used as loading affordance (always brand color, rotation animation) or Refresh button (ie tables)",
    status: "Active",
  },
  {
    name: "search",
    muiName: "search",
    description: '"Search" if autocomplete, treat as decoration',
    usage: "Used on search and autocomplete inputs",
    status: "Active",
  },
  {
    name: "edit",
    muiName: "edit",
    description: '"Edit (object)"',
    usage: "used to swap read-only elements into editable",
    status: "Upcoming",
  },
  {
    name: "delete",
    muiName: "delete",
    description: '"Delete (object)"',
    usage: "for destructive actions (not just dismissing, but removing). Usually with confirmation popover",
    status: "Active",
  },
  {
    name: "cancel",
    muiName: "cancel",
    description: '"Cancel" ("Remove (object)" if on autocomplete pills). non-destructive',
    usage: "Used in back buttons, dismiss modals/selections or to ignore changes",
    status: "-",
  },
  {
    name: "reorder",
    muiName: "reorder",
    description: "treat as decoration",
    usage: "Used to reorder list items, also used on badges to denote list is reorderable",
    status: "Active",
  },
  {
    name: "wizard",
    muiName: "select_window, ad_group",
    description: "Case-by-case scenario",
    usage: 'affordance for "modal wizard ahead"',
    status: "Active",
  },
  {
    name: "ok",
    muiName: "check",
    description: 'if progress board or button, treat as decoration. if on notification "Success message"',
    usage: "Success system color. Conditions met, user may pass. Also as end-of-quest buttons.",
    status: "Active",
  },
  {
    name: "lock",
    muiName: "lock",
    description: "Treat as decoration",
    usage: "Used on steps closed because condition not met",
    status: "Active",
  },
  {
    name: "lock-open",
    muiName: "lock_open",
    description: "?",
    usage: "?",
    status: "",
  },
  {
    name: "minus",
    muiName: "remove",
    description: "?",
    usage: "?",
    status: "Active",
  },
  {
    name: "plus",
    muiName: "add",
    description: '"Add (object)"',
    usage: "Used in buttons that add new elements (new suggested reviewer, new author, etc)",
    status: "Not used",
  },
  {
    name: "chevron",
    muiName: "keyboard_arrow_down",
    description: "If select, treat as decoration",
    usage: "used in select objects, and collapse. turn upside-down when open?",
    status: "Not used?",
  },
  {
    name: "chevron-up",
    muiName: "keyboard_arrow_up",
    description: "",
    usage: "",
    status: "Active",
  },
  {
    name: "previous",
    muiName: "arrow_back",
    description: "if button or link, treat as decoration",
    usage: 'Used in buttons to return one step (mainly modals), also used in "back to progress board"',
    status: "Active",
  },
  {
    name: "up",
    muiName: "arrow_upward",
    description: "",
    usage: "",
    status: "",
  },
  {
    name: "next",
    muiName: "arrow_forward",
    description: "",
    usage: "",
    status: "",
  },
  {
    name: "down",
    muiName: "arrow_downward",
    description: "",
    usage: "",
    status: "Active",
  },
  {
    name: "swap",
    muiName: "pending",
    description: "?",
    usage: "?",
    status: "",
  },
  {
    name: "help",
    muiName: "tooltip",
    description: "?",
    usage: "?",
    status: "",
  },
  {
    name: "info",
    muiName: "info",
    description: "if button, treat as decoration",
    usage: 'Used in buttons mid-quest. for end of quest, use "ok"',
    status: "",
  },
  {
    name: "calendar",
    muiName: "calendar",
    description: "?",
    usage: "?",
    status: "",
  },
  {
    name: "calendar2",
    muiName: "time",
    description: "?",
    usage: "AS, Help site, maybe if explanation tooltip too? (reduce contrast)",
    status: "",
  },
  {
    name: "new",
    muiName: "-",
    description: 'Dedicated icon for alert states. if on notification "Alert message". if on button, treat it as decoration',
    usage: "Dedicated to attention system color. User may pass for now, but they will be confronted with an error in the future or some change was made and needs their attention",
    status: "",
  },
  {
    name: "download",
    muiName: "download",
    description: '"Due by (due date, "DD Month")"',
    usage: "Used for direct download (opens browser file menu)",
    status: "?",
  },
  {
    name: "upload",
    muiName: "upload",
    description: "treat as decoration",
    usage: "Used for direct upload (opens browser file menu)",
    status: "",
  },
  {
    name: "none",
    muiName: "-",
    description: '"!!PENDING!! (object)"',
    usage: "Used in update button (a delete + upload shortcut). As we wrap metadata around object, we need to educate users to update (to keep metadata)",
    status: "",
  },
  {
    name: "cover",
    muiName: "-",
    description: '"Download (object)"',
    usage: "Used in due dates warnings",
    status: "",
  },
  {
    name: "link",
    muiName: "insert_link",
    description: '"Upload (object)"',
    usage: "used in badges, to denote optional upload.",
    status: "",
  },
  {
    name: "destination",
    muiName: "-",
    description: '"Destination journal"',
    usage: "Used for transfer, to refer to destination journal",
    status: "?",
  },
  {
    name: "origin",
    muiName: "-",
    description: '"Origin journal"',
    usage: "Used for transfer, to refer to origin journal",
    status: "Active",
  },
  {
    name: "chat",
    muiName: "messages",
    description: "?",
    usage: "?",
    status: "Upcoming",
  },
  {
    name: "error",
    muiName: "error",
    description: 'If on notification, "Error message"',
    usage: "Dedicated to error system color. An action is required and user can't go forward until fix.",
    status: "Pending",
  },
  {
    name: "external",
    muiName: "external_link",
    description: '"External link"',
    usage: "Used when link is external",
    status: "Active",
  },
  {
    name: "graphs",
    muiName: "reports",
    description: "?",
    usage: "?",
    status: "Deprecated",
  },
  {
    name: "mail",
    muiName: "mail",
    description: "on button, treat as decoration",
    usage: "Used to denote message came from an email, as Decision Letter or that it creates a mail message",
    status: "Active",
  },
  {
    name: "asterisk",
    muiName: "-",
    description: "?",
    usage: "?",
    status: "Active",
  },
  {
    name: "filter",
    muiName: "funnel",
    description: "?",
    usage: "?",
    status: "Active",
  },
  {
    name: "active",
    muiName: "-",
    description: 'if button, "Activate" "Activate for all journals" or "Enable for pilot journals"',
    usage: "Used to indicate if additional feature is on (status) or can be turned on (button)",
    status: "?",
  },
  {
    name: "inactive",
    muiName: "-",
    description: 'if button, "Deactivate"',
    usage: "Used to indicate if additional feature is off (status) or can be turned off (button)",
    status: "?",
  },
  {
    name: "check",
    muiName: "check",
    description: "To decide",
    usage: 'Used in "The editorial office updated this for you" notification',
    status: "?",
  },
  {
    name: "copyright",
    muiName: "-",
    description: "?",
    usage: "AS",
    status: "Active",
  },
  {
    name: "globe",
    muiName: "-",
    description: "?",
    usage: "?",
    status: "Active",
  },
  {
    name: "globe-2",
    muiName: "-",
    description: '"Geographic discount"',
    usage: "Used to represent Geographic discount",
    status: "?",
  },
  {
    name: "open-access",
    muiName: "-",
    description: '"Open Access"',
    usage: "Open Access marketing objects. Uses own color.",
    status: "Pending",
  },
  {
    name: "video",
    muiName: "-",
    description: "?",
    usage: "Marketing for additional services",
    status: "?",
  },
  {
    name: "resubmit",
    muiName: "-",
    description: "treat as decoration",
    usage: "Used to signal rejected submission can be transfered",
    status: "Not used",
  },
  {
    name: "quote",
    muiName: "pending",
    description: "Pending",
    usage: "Pending",
    status: "Pending",
  },
  {
    name: "wait",
    muiName: "pending",
    description: "Pending",
    usage: "Pending",
    status: "?",
  },
  {
    name: "alert",
    muiName: "bell",
    description: "Pending",
    usage: "Pending",
    status: "?",
  },
  {
    name: "logout",
    muiName: "logout",
    description: "Pending",
    usage: "Pending",
    status: "?",
  },
  {
    name: "menu",
    muiName: "content_blocks",
    description: "Pending",
    usage: "Pending",
    status: "Active",
  },
  {
    name: "actions",
    muiName: "more",
    description: "Pending",
    usage: "Pending",
    status: "Pending",
  },
  {
    name: "eye",
    muiName: "preview",
    description: "Pending",
    usage: "Pending",
    status: "Pending",
  },
  {
    name: "eye-closed",
    muiName: "hide",
    description: "Pending",
    usage: "Pending",
    status: "Pending",
  },
  {
    name: "filter-line",
    muiName: "sort",
    description: "Pending",
    usage: "Pending",
    status: "Pending",
  },
  {
    name: "deprecated chevron",
    muiName: "-",
    description: "Old chevron style - do not use",
    usage: "Old chevron style - do not use",
    status: "Pending",
  },
  {
    name: "first",
    muiName: "first_page",
    description: "Pending",
    usage: "Pending",
    status: "Pending",
  },
  {
    name: "last",
    muiName: "last_page",
    description: "Pending",
    usage: "Pending",
    status: "Pending",
  },
  {
    name: "maximum",
    muiName: "expand",
    description: "Pending",
    usage: "Pending",
    status: "Pending",
  },
  {
    name: "alert-empty",
    muiName: "bell",
    description: "Pending",
    usage: "Pending",
    status: "Pending",
  },
];

const IconInventoryTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredIcons = iconInventory.filter((icon) => {
    const matchesSearch =
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.muiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || icon.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (
    status: IconData["status"]
  ): "success" | "error" | "info" | "warning" | "default" => {
    switch (status) {
      case "Active":
        return "success";
      case "Deprecated":
        return "error";
      case "Upcoming":
        return "info";
      case "Pending":
        return "warning";
      case "Not used":
      case "Not used?":
        return "default";
      default:
        // For empty strings, "?", "-", and any other values
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        ReX Icon Inventory
      </Typography>
      <Typography variant="body1" paragraph>
        Complete inventory of ReX icons with Material UI equivalents. Use this
        reference when migrating from ReX to the new design system.
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Search icons"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Deprecated">Deprecated</MenuItem>
            <MenuItem value="Upcoming">Upcoming</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Not used">Not used</MenuItem>
            <MenuItem value="">Empty</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredIcons.length} of {iconInventory.length} icons
      </Typography>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: 80 }}>
                Icon
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 150 }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 180 }}>
                MUI Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 200 }}>
                Description
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Usage</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 120 }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIcons.map((icon) => (
              <TableRow
                key={icon.name}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  opacity: icon.status === "Deprecated" ? 0.6 : 1,
                }}
              >
                <TableCell sx={{ verticalAlign: "top" }}>
                  <Box
                    component="img"
                    src={`/icons/rex/${icon.name}.svg`}
                    alt={icon.name}
                    sx={{
                      width: 16,
                      height: 16,
                      display: "block",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ verticalAlign: "top" }}>
                  <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                    {icon.name}
                  </Typography>
                </TableCell>
                <TableCell sx={{ verticalAlign: "top" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      color: "text.secondary",
                    }}
                  >
                    {icon.muiName}
                  </Typography>
                </TableCell>
                <TableCell sx={{ verticalAlign: "top" }}>
                  <Typography variant="body2">{icon.description}</Typography>
                </TableCell>
                <TableCell sx={{ verticalAlign: "top" }}>
                  <Typography variant="body2" color="text.secondary">
                    {icon.usage}
                  </Typography>
                </TableCell>
                <TableCell sx={{ verticalAlign: "top" }}>
                  <Chip
                    label={icon.status || "(empty)"}
                    color={getStatusColor(icon.status)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const meta = {
  title: "Design Tokens/Icon Inventory",
  component: IconInventoryTable,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Complete inventory of ReX icons with their Material UI equivalents, descriptions, and usage guidelines. Use this reference when migrating from the ReX system to the new design system.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof IconInventoryTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
