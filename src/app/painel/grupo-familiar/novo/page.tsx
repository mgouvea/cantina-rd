'use client';

import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GenericBreadcrumbs from '@/app/components/breadcrumb/GenericBreadcrumb';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Paper from '@mui/material/Paper';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Text from '@/app/components/ui/text/Text';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { StepIconProps } from '@mui/material/StepIcon';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { User } from '@/types';
import { useRouter } from 'next/navigation';

import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';
import { groupFamily } from '@/types/groupFamily';
import { EntradaTexto } from '@/app/components';
import TransferList from '@/app/components/ui/transferList/TransferList';
import { useUsers } from '@/hooks/queries';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'start',
  borderRadius: '12px',
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
  name: '',
  members: [],
  owner: '',
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg, rgb(169,226,173) 0%, rgb(76 175 80) 50%, rgb(21,120,27) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg, rgb(169,226,173) 0%, rgb(76 175 80) 50%, rgb(21,120,27) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          'linear-gradient( 136deg, rgb(169,226,173) 0%, rgb(76 175 80) 50%, rgb(21,120,27) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          'linear-gradient( 136deg, rgb(169,226,173) 0%, rgb(76 175 80) 50%, rgb(21,120,27) 100%)',
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

const steps = ['Nome do grupo', 'Membros', 'Responsável', 'Salvar'];

export default function NovoGrupoFamiliar() {
  const { data: users, isLoading } = useUsers();

  const router = useRouter();
  const { control, getValues, setValue, watch } = useForm<FormData>({
    defaultValues: INITIAL_FORM_VALUES,
  });

  const [activeStep, setActiveStep] = useState(0);
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
  const [owner, setOwner] = useState<string>('');

  // Observa as mudanças no campo members do formulário
  // const selectedMembers = watch('members');

  const handleMembersChange = (updatedMembers: SelectedMember[]) => {
    setSelectedMembers(updatedMembers);
  };

  const handleOwnerChange = (event: { target: { value: string } }) => {
    setOwner(event.target.value);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCancel = () => {
    router.replace('/painel/grupo-familiar');
  };

  const handleSave = async () => {
    if (!owner) {
      alert('Selecione um responsável');
      return;
    }

    const formValues = getValues();
    const finalData = {
      ...formValues,
      members: selectedMembers,
      owner: owner,
    };

    try {
      console.log('Dados para salvar:', finalData);
      // await saveGroupFamily(finalData);
      router.replace('/painel/grupo-familiar');
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <EntradaTexto
            name="name"
            control={control}
            label="Nome do grupo"
            sx={{
              width: '70%',
            }}
          />
        );
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <TransferList
              users={users || []}
              onSelectionChange={handleMembersChange}
              initialSelected={selectedMembers}
            />
          </Box>
        );
      case 2:
        return (
          <FormControl
            sx={{
              width: '70%',
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
                    {member.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        );
      default:
        return 'Passo desconhecido';
    }
  };

  const breadcrumbItems = [
    { label: 'Início', href: '/painel' },
    { label: 'Grupo Familiar', href: '/painel/clientes' },
    { label: 'Novo' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <GenericBreadcrumbs items={breadcrumbItems} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text variant="h5" fontWeight="bold">
          Novo grupo familiar
        </Text>
        <IconButton
          sx={{
            backgroundColor: 'success.dark',
            '&:hover': { backgroundColor: 'success.main', transition: '0.3s' },
          }}
          onClick={() => router.replace('/painel/clientes')}
        >
          <Tooltip title="Voltar">
            <ArrowBackIcon fontSize="medium" sx={{ color: '#fff' }} />
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
          <Stack sx={{ width: '100%' }} spacing={4}>
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
                display: 'flex',
                justifyContent: 'center',
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
                >
                  Salvar
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
