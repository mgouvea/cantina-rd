"use client";

import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import GenericBreadcrumbs from "@/app/components/breadcrumb/GenericBreadcrumb";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Paper from "@mui/material/Paper";
import React, { useState, useMemo, useCallback } from "react";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Text from "@/app/components/ui/text/Text";
import TransferList from "@/app/components/ui/transferList/TransferList";
import { useForm } from "react-hook-form";
import { EntradaTexto, useSnackbar } from "@/app/components";
import { StepIconProps } from "@mui/material/StepIcon";
import { styled } from "@mui/material/styles";
import { useAddGroupFamily } from "@/hooks/mutations/useGroupFamily.mutation";
import { useRouter } from "next/navigation";
import { useUpdateUsersGroupFamily } from "@/hooks/mutations/useUsers.mutation";

import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
} from "@mui/material";

import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { capitalize } from "@/utils";
import { User } from "@/types";
import { useUserStore } from "@/contexts";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "start",
  borderRadius: "12px",
  color: theme.palette.text.secondary,
}));

interface SelectedMember {
  userId: string;
  name: string;
}

interface FormData {
  name: string;
  members: SelectedMember[];
  owner: string;
}

const INITIAL_FORM_VALUES: FormData = {
  name: "",
  members: [],
  owner: "",
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg, rgb(169,226,173) 0%, rgb(76 175 80) 50%, rgb(21,120,27) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg, rgb(169,226,173) 0%, rgb(76 175 80) 50%, rgb(21,120,27) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(169,226,173) 0%, rgb(76 175 80) 50%, rgb(21,120,27) 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(169,226,173) 0%, rgb(76 175 80) 50%, rgb(21,120,27) 100%)",
      },
    },
  ],
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement<unknown> } = {
    1: <BadgeOutlinedIcon />,
    2: <GroupAddIcon />,
    3: <AdminPanelSettingsOutlinedIcon />,
    4: <SaveOutlinedIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = ["Nome do grupo", "Membros", "Responsável", "Salvar"];

export default function NovoGrupoFamiliar() {
  const { allUsers } = useUserStore();
  const { showSnackbar } = useSnackbar();

  const { mutateAsync: addGroup } = useAddGroupFamily();
  const { mutateAsync: updateUser } = useUpdateUsersGroupFamily();

  const router = useRouter();
  const { control, getValues, watch } = useForm<FormData>({
    defaultValues: INITIAL_FORM_VALUES,
    mode: "onChange", // Enable validation on change
  });

  const [activeStep, setActiveStep] = useState(0);
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
  const [owner, setOwner] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const groupName = watch("name");

  // Filter out users who already have a groupFamily
  const availableUsers = useMemo(() => {
    if (!allUsers) return [];
    return allUsers.filter((user: User) => !user.groupFamily);
  }, [allUsers]);

  const handleMembersChange = useCallback(
    (updatedMembers: SelectedMember[]) => {
      setSelectedMembers(updatedMembers);
    },
    []
  );

  const handleOwnerChange = useCallback(
    (event: { target: { value: string } }) => {
      setOwner(event.target.value);
    },
    []
  );

  const handleNext = useCallback(() => {
    if (activeStep === 0 && groupName === "") {
      showSnackbar({
        message: "Nome obrigatório!",
        severity: "warning",
      });
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  }, [activeStep, groupName, showSnackbar]);

  const handleBack = useCallback(() => {
    setActiveStep((prevStep) => prevStep - 1);
  }, []);

  const handleCancel = useCallback(() => {
    router.replace("/grupo-familiar");
  }, [router]);

  const handleSave = useCallback(async () => {
    if (!owner) {
      showSnackbar({
        message: "Selecione um responsável",
        severity: "warning",
      });
      return;
    }

    if (selectedMembers.length === 0) {
      showSnackbar({
        message: "Selecione pelo menos um membro para o grupo",
        severity: "warning",
      });
      return;
    }

    setIsSubmitting(true);

    const formValues = getValues();
    const finalData = {
      ...formValues,
      members: selectedMembers.map((member) => ({
        userId: member.userId,
        memberName: member.name, // Map name to memberName
        memberAvatar: "", // Provide a default value for memberAvatar
      })),
      owner: owner,
    };

    try {
      const result = await addGroup(finalData);

      await updateUser({
        groupFamilyId: result._id,
        users: selectedMembers,
      });

      router.replace("/grupo-familiar");
    } catch (error) {
      console.error("Erro ao salvar grupo familiar:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    owner,
    selectedMembers,
    getValues,
    addGroup,
    updateUser,
    showSnackbar,
    router,
  ]);

  const getOwnerName = useCallback(
    (ownerId: string) => {
      const ownerMember = selectedMembers.find(
        (member) => member.userId === ownerId
      );
      return ownerMember ? capitalize(ownerMember.name) : ownerId;
    },
    [selectedMembers]
  );

  const RenderSaveStep = useCallback(
    (title: string, value: string | SelectedMember[]) => {
      // Processa o valor baseado no título e tipo
      const processValue = (title: string, value: React.ReactNode) => {
        if (title === "Responsável") {
          return getOwnerName(value as string);
        }
        return value;
      };

      const displayValue = Array.isArray(value) ? (
        <>
          {value.map((item: SelectedMember) => (
            <Text key={item.userId} sx={{ ml: 2 }}>
              {capitalize(item.name)}
            </Text>
          ))}
        </>
      ) : (
        <Text>{processValue(title, value)}</Text>
      );

      return (
        <Stack
          direction={Array.isArray(value) ? "column" : "row"}
          sx={{ gap: 1 }}
        >
          <Text sx={{ fontWeight: "bold" }}>{title}:</Text>
          {displayValue}
        </Stack>
      );
    },
    [getOwnerName]
  );

  const getStepContent = useCallback(
    (step: number) => {
      switch (step) {
        case 0:
          return (
            <EntradaTexto
              name="name"
              control={control}
              label="Nome do grupo"
              sx={{
                width: "70%",
              }}
            />
          );
        case 1:
          return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TransferList
                users={availableUsers || []}
                onSelectionChange={handleMembersChange}
                initialSelected={selectedMembers}
              />
            </Box>
          );
        case 2:
          return (
            <FormControl
              sx={{
                width: "70%",
              }}
            >
              <InputLabel id="owner-select-label">Responsável</InputLabel>
              <Select
                labelId="owner-select-label"
                id="owner-select"
                value={owner}
                label="Responsável"
                onChange={handleOwnerChange}
              >
                {selectedMembers.length === 0 ? (
                  <MenuItem disabled value="">
                    Nenhum membro selecionado
                  </MenuItem>
                ) : (
                  selectedMembers.map((member) => (
                    <MenuItem key={member.userId} value={member.userId}>
                      {capitalize(member.name)}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          );
        case 3:
          const finalValues = getValues();
          return (
            <Stack
              sx={{
                border: "1px solid gray",
                borderRadius: 4,
                paddingX: 10,
                paddingY: 3,
                boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
                backgroundColor: "white",
                position: "relative",
                transform: "translateY(-4px)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                  transform: "translateY(-6px)",
                },
              }}
            >
              {RenderSaveStep("Nome do grupo", finalValues.name)}
              {RenderSaveStep("Responsável", owner)}
              {RenderSaveStep("Membros", selectedMembers)}
            </Stack>
          );
        default:
          return null;
      }
    },
    [
      control,
      availableUsers,
      selectedMembers,
      owner,
      handleOwnerChange,
      handleMembersChange,
      getValues,
      RenderSaveStep,
    ]
  );

  const breadcrumbItems = [
    { label: "Início", href: "/dashboard" },
    { label: "Grupo Familiar", href: "/grupo-familiar" },
    { label: "Novo" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <GenericBreadcrumbs items={breadcrumbItems} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text variant="h5" fontWeight="bold">
          Novo grupo familiar
        </Text>
        <IconButton
          sx={{
            backgroundColor: "success.dark",
            "&:hover": { backgroundColor: "success.main", transition: "0.3s" },
          }}
          onClick={handleCancel}
        >
          <Tooltip title="Voltar">
            <ArrowBackIcon fontSize="medium" sx={{ color: "#fff" }} />
          </Tooltip>
        </IconButton>
      </Stack>

      <Box
        sx={{
          marginTop: 5,
          marginX: 5,
        }}
      >
        <Item>
          <Stack sx={{ width: "100%" }} spacing={4}>
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<ColorlibConnector />}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box
              sx={{
                mt: 2,
                mb: 1,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {getStepContent(activeStep)}
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              {activeStep === 0 ? (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={handleBack}
                >
                  Voltar
                </Button>
              )}

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSave}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Próximo
                </Button>
              )}
            </Stack>
          </Stack>
        </Item>
      </Box>
    </Box>
  );
}
