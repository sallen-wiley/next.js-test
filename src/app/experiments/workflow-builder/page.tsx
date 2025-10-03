"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Switch,
  Divider,
  Paper,
  Grid,
  Stack,
  Autocomplete,
} from "@mui/material";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";

// Types for the workflow data
interface WorkflowStep {
  id: string;
  stepNumber: number;
  name: string;
  activity: string;
  enabled: boolean;
  responsibleRole: string;
  subSteps: SubStep[];
}

interface SubStep {
  id: string;
  name: string;
  enabled: boolean;
  responsibleRole: string[];
  assignmentMethod: string;
  decisions: string[];
}

interface WorkflowFormData {
  editorialModelName: string;
  issueTypes: string[];
  articleTypes: string[];
  workflow: WorkflowStep[];
}

// Mock data for dropdowns
const assignmentMethods = ["Automatic assignment", "Manual email invitation"];

const issueTypeOptions = ["Regular issue", "Special issue"];

const articleTypeOptions = [
  "Case Report",
  "Case Series",
  "Research Article",
  "Review Article",
  "Editorial",
  "Letter to Editor",
  "Opinion",
  "Book Review",
];

const roleOptions = [
  "Editor",
  "Associate Editor",
  "Review Coordinator",
  "Managing Editor",
  "Section Editor",
  "Guest Editor",
  "Editorial Assistant",
  "Submission Checker",
  "Revision Checker",
  "Quality Checker",
  "Material Checker",
  "Editor-in-Chief",
  "Deputy Editor",
  "Academic Editor",
];

const decisionOptions = [
  "Accept",
  "Minor Revision",
  "Major Revision",
  "Reject",
  "Reject and Resubmit",
  "Withdraw",
  "Pending Review",
  "Revise",
];

export default function WorkflowBuilder() {
  const [formData, setFormData] = useState<WorkflowFormData>({
    editorialModelName: "Double Tier, Associate Editor",
    issueTypes: ["Regular issue", "Special issue"],
    articleTypes: [
      "Case Report",
      "Case Series",
      "Research Article",
      "Review Article",
    ],
    workflow: [
      {
        id: "step-1",
        stepNumber: 1,
        name: "Step 1",
        activity: "Submission Checks",
        enabled: true,
        responsibleRole: "Submission Checker",
        subSteps: [],
      },
      {
        id: "step-2",
        stepNumber: 2,
        name: "Step 2",
        activity: "Review",
        enabled: true,
        responsibleRole: "",
        subSteps: [
          {
            id: "triage-1",
            name: "Triage 1",
            enabled: true,
            responsibleRole: ["Editor-in-Chief"],
            assignmentMethod: "Automatic assignment",
            decisions: ["Accept", "Revise", "Reject"],
          },
          {
            id: "triage-2",
            name: "Triage 2",
            enabled: true,
            responsibleRole: ["Deputy Editor", "Academic Editor"],
            assignmentMethod: "Manual email invitation",
            decisions: ["Revise", "Accept", "Reject"],
          },
        ],
      },
      {
        id: "step-3",
        stepNumber: 3,
        name: "Step 3",
        activity: "Revision Checks",
        enabled: true,
        responsibleRole: "Revision Checker",
        subSteps: [],
      },
      {
        id: "step-4",
        stepNumber: 4,
        name: "Step 4",
        activity: "Quality Checks",
        enabled: true,
        responsibleRole: "Quality Checker",
        subSteps: [],
      },
      {
        id: "step-5",
        stepNumber: 5,
        name: "Step 5",
        activity: "Material Checks",
        enabled: false,
        responsibleRole: "Material Checker",
        subSteps: [],
      },
    ],
  });

  const handleEditorialModelNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      editorialModelName: event.target.value,
    }));
  };

  const handleIssueTypeChange = (issueType: string) => {
    setFormData((prev) => ({
      ...prev,
      issueTypes: prev.issueTypes.includes(issueType)
        ? prev.issueTypes.filter((type) => type !== issueType)
        : [...prev.issueTypes, issueType],
    }));
  };

  const handleArticleTypesChange = (
    event: React.SyntheticEvent,
    newValue: string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      articleTypes: newValue,
    }));
  };

  const handleResponsibleRoleChange = (
    stepId: string,
    subStepId: string,
    newValue: string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      workflow: prev.workflow.map((step) =>
        step.id === stepId
          ? {
              ...step,
              subSteps: step.subSteps.map((subStep) =>
                subStep.id === subStepId
                  ? { ...subStep, responsibleRole: newValue }
                  : subStep
              ),
            }
          : step
      ),
    }));
  };

  const handleDecisionChange = (
    stepId: string,
    subStepId: string,
    newValue: string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      workflow: prev.workflow.map((step) =>
        step.id === stepId
          ? {
              ...step,
              subSteps: step.subSteps.map((subStep) =>
                subStep.id === subStepId
                  ? { ...subStep, decisions: newValue }
                  : subStep
              ),
            }
          : step
      ),
    }));
  };

  const handleStepResponsibleRoleChange = (
    stepId: string,
    newValue: string | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      workflow: prev.workflow.map((step) =>
        step.id === stepId ? { ...step, responsibleRole: newValue || "" } : step
      ),
    }));
  };

  const handleStepToggle = (stepId: string) => {
    setFormData((prev) => ({
      ...prev,
      workflow: prev.workflow.map((step) =>
        step.id === stepId ? { ...step, enabled: !step.enabled } : step
      ),
    }));
  };

  const handleStepNameChange = (stepId: string, newName: string) => {
    setFormData((prev) => ({
      ...prev,
      workflow: prev.workflow.map((step) =>
        step.id === stepId ? { ...step, name: newName } : step
      ),
    }));
  };

  const handleSubStepNameChange = (
    stepId: string,
    subStepId: string,
    newName: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      workflow: prev.workflow.map((step) =>
        step.id === stepId
          ? {
              ...step,
              subSteps: step.subSteps.map((subStep) =>
                subStep.id === subStepId
                  ? { ...subStep, name: newName }
                  : subStep
              ),
            }
          : step
      ),
    }));
  };

  const addTriageStep = (stepId: string) => {
    setFormData((prev) => ({
      ...prev,
      workflow: prev.workflow.map((step) =>
        step.id === stepId
          ? {
              ...step,
              subSteps: [
                ...step.subSteps,
                {
                  id: `triage-${step.subSteps.length + 1}`,
                  name: `Triage ${step.subSteps.length + 1}`,
                  enabled: true,
                  responsibleRole: [],
                  assignmentMethod: "Automatic assignment",
                  decisions: [],
                },
              ],
            }
          : step
      ),
    }));
  };

  const removeSubStep = (stepId: string, subStepId: string) => {
    setFormData((prev) => ({
      ...prev,
      workflow: prev.workflow.map((step) =>
        step.id === stepId
          ? {
              ...step,
              subSteps: step.subSteps.filter(
                (subStep) => subStep.id !== subStepId
              ),
            }
          : step
      ),
    }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Create Editorial Model & Workflow
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Editorial Model Name */}
          <FormControl fullWidth>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Editorial model name
            </Typography>
            <TextField
              value={formData.editorialModelName}
              onChange={handleEditorialModelNameChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </FormControl>

          {/* Issue Types */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Issue type(s){" "}
              <Typography component="span" color="error">
                *
              </Typography>
            </Typography>
            <Stack direction="row" spacing={2}>
              {issueTypeOptions.map((issueType) => (
                <FormControlLabel
                  key={issueType}
                  control={
                    <Checkbox
                      checked={formData.issueTypes.includes(issueType)}
                      onChange={() => handleIssueTypeChange(issueType)}
                    />
                  }
                  label={issueType}
                />
              ))}
            </Stack>
          </Box>

          {/* Article Types */}
          <FormControl fullWidth>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Article type(s){" "}
              <Typography component="span" color="error">
                *
              </Typography>
            </Typography>
            <Autocomplete
              multiple
              options={articleTypeOptions}
              value={formData.articleTypes}
              onChange={handleArticleTypesChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select article types"
                  size="small"
                />
              )}
              sx={{
                "& .MuiOutlinedInput-root": {
                  minHeight: 40,
                  padding: "6px 8px",
                },
              }}
            />
          </FormControl>

          {/* Editorial Workflow */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Editorial workflow{" "}
              <Typography component="span" color="error">
                *
              </Typography>
            </Typography>

            <Stack spacing={2}>
              {formData.workflow.map((step, index) => (
                <React.Fragment key={step.id}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      bgcolor: "background.paper",
                      borderRadius: 1.5,
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 1 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            bgcolor: "action.hover",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "text.secondary",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          {step.stepNumber}
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 3 }}>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", mb: 0.5 }}
                          >
                            Activity
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Switch
                              checked={step.enabled}
                              onChange={() => handleStepToggle(step.id)}
                              size="small"
                            />
                            <TextField
                              value={step.name}
                              onChange={(e) =>
                                handleStepNameChange(step.id, e.target.value)
                              }
                              variant="standard"
                              size="small"
                              sx={{ fontWeight: "bold" }}
                            />
                          </Box>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 4 }}>
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold" }}
                            >
                              Responsible role
                            </Typography>
                            <InfoIcon
                              sx={{ fontSize: 16, color: "grey.500" }}
                            />
                          </Box>
                          <Autocomplete
                            options={roleOptions}
                            value={step.responsibleRole || null}
                            onChange={(event, newValue) =>
                              handleStepResponsibleRoleChange(step.id, newValue)
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                              />
                            )}
                            size="small"
                            fullWidth
                          />
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 4 }}>
                        {/* Additional controls or info can go here */}
                      </Grid>
                    </Grid>

                    {/* Sub-steps for Review step */}
                    {step.id === "step-2" && (
                      <Box sx={{ mt: 2, pl: 5 }}>
                        <Divider sx={{ mb: 2 }} />

                        {/* Triage Section */}
                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Switch defaultChecked size="small" />
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: "bold" }}
                              >
                                Triage
                              </Typography>
                            </Box>
                            <Button
                              variant="text"
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => addTriageStep(step.id)}
                              sx={{ color: "primary.main" }}
                            >
                              Add triage Step
                            </Button>
                          </Box>

                          <Stack spacing={1}>
                            {step.subSteps.map((subStep) => (
                              <Paper
                                key={subStep.id}
                                variant="outlined"
                                sx={{ p: 2, bgcolor: "background.paper" }}
                              >
                                <Grid
                                  container
                                  spacing={2}
                                  alignItems="flex-start"
                                >
                                  <Grid size={{ xs: 3 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <TextField
                                        value={subStep.name}
                                        onChange={(e) =>
                                          handleSubStepNameChange(
                                            step.id,
                                            subStep.id,
                                            e.target.value
                                          )
                                        }
                                        variant="standard"
                                        size="small"
                                        sx={{ fontWeight: "bold" }}
                                      />
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          removeSubStep(step.id, subStep.id)
                                        }
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Box>
                                  </Grid>

                                  <Grid size={{ xs: 9 }}>
                                    <Stack spacing={2}>
                                      {/* Responsible Role */}
                                      <FormControl fullWidth size="small">
                                        <Typography
                                          variant="body2"
                                          sx={{ fontWeight: "bold", mb: 0.5 }}
                                        >
                                          Responsible role{" "}
                                          <Typography
                                            component="span"
                                            color="error"
                                          >
                                            *
                                          </Typography>
                                        </Typography>
                                        <Autocomplete
                                          multiple
                                          options={roleOptions}
                                          value={subStep.responsibleRole}
                                          onChange={(event, newValue) =>
                                            handleResponsibleRoleChange(
                                              step.id,
                                              subStep.id,
                                              newValue
                                            )
                                          }
                                          renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                              <Chip
                                                {...getTagProps({ index })}
                                                key={option}
                                                label={option}
                                                size="small"
                                                sx={{
                                                  bgcolor: "secondary.main",
                                                  color:
                                                    "secondary.contrastText",
                                                }}
                                              />
                                            ))
                                          }
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              variant="outlined"
                                              size="small"
                                            />
                                          )}
                                          size="small"
                                        />
                                      </FormControl>

                                      {/* Assignment Method */}
                                      <FormControl fullWidth size="small">
                                        <Typography
                                          variant="body2"
                                          sx={{ fontWeight: "bold", mb: 0.5 }}
                                        >
                                          Assignment method{" "}
                                          <Typography
                                            component="span"
                                            color="error"
                                          >
                                            *
                                          </Typography>
                                        </Typography>
                                        <Select
                                          value={subStep.assignmentMethod}
                                          variant="outlined"
                                          size="small"
                                        >
                                          {assignmentMethods.map((method) => (
                                            <MenuItem
                                              key={method}
                                              value={method}
                                            >
                                              {method}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>

                                      {/* Decisions */}
                                      <FormControl fullWidth size="small">
                                        <Typography
                                          variant="body2"
                                          sx={{ fontWeight: "bold", mb: 0.5 }}
                                        >
                                          Decisions on the manuscript{" "}
                                          <Typography
                                            component="span"
                                            color="error"
                                          >
                                            *
                                          </Typography>
                                        </Typography>
                                        <Autocomplete
                                          multiple
                                          options={decisionOptions}
                                          value={subStep.decisions}
                                          onChange={(event, newValue) =>
                                            handleDecisionChange(
                                              step.id,
                                              subStep.id,
                                              newValue
                                            )
                                          }
                                          renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                              <Chip
                                                {...getTagProps({ index })}
                                                key={option}
                                                label={option}
                                                size="small"
                                                sx={{
                                                  bgcolor: "success.main",
                                                  color: "success.contrastText",
                                                }}
                                              />
                                            ))
                                          }
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              variant="outlined"
                                              size="small"
                                            />
                                          )}
                                          size="small"
                                        />
                                      </FormControl>
                                    </Stack>
                                  </Grid>
                                </Grid>
                              </Paper>
                            ))}
                          </Stack>
                        </Box>
                      </Box>
                    )}
                  </Paper>

                  {/* Arrow between steps */}
                  {index < formData.workflow.length - 1 && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 1 }}
                    >
                      <ArrowDownIcon sx={{ color: "grey.400" }} />
                    </Box>
                  )}
                </React.Fragment>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button variant="contained" color="primary">
          Save Editorial Model
        </Button>
      </Box>
    </Container>
  );
}
