'use client';

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import GenericBreadcrumbs from '@/app/components/breadcrumb/GenericBreadcrumb';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import SwitchSelector from 'react-switch-selector';
import Text from '@/app/components/ui/text/Text';
import { Avatar, Box, IconButton, Stack, Tooltip } from '@mui/material';
import { Botao, EntradaTexto, useSnackbar } from '@/app/components';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useAddAdmin, useAddUser } from '@/hooks/mutations';
import { useApp } from '@/contexts';
import { useForm, useWatch } from 'react-hook-form';
import { User, UserAdmin } from '@/types';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

interface fotoPerfilProps {
  base64: string;
  name: string;
  size: number;
  type: string;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'start',
  borderRadius: '12px',
  color: theme.palette.text.secondary,
}));

const INITIAL_FORM_VALUES = {
  name: '',
  email: '',
  telephone: '',
  isAdmin: false,
  password: '',
  groupFamily: '',
};

const optionsSwitch = [
  {
    label: 'Cliente',
    value: 0,
    selectedBackgroundColor: '#4caf50',
  },
  {
    label: 'Administrador',
    value: 1,
    selectedBackgroundColor: '#1565c0',
  },
];

export default function NovoCliente() {
  const queryClient = useQueryClient();

  const { mutateAsync: addUser } = useAddUser();
  const { mutateAsync: addAdmin } = useAddAdmin();

  const { userContext } = useApp();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const [fotoPerfil, setFotoPerfil] = useState<fotoPerfilProps | null>(null);
  const [isModified, setIsModified] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userForm = useForm<User>({ defaultValues: INITIAL_FORM_VALUES });
  const { control, getValues, reset } = userForm;

  const [watchedNome, watchedEmail, watchedTelefone, watchedGrupoFamiliar] = [
    useWatch({ control, name: 'name' }),
    useWatch({ control, name: 'email' }),
    useWatch({ control, name: 'telephone' }),
    useWatch({ control, name: 'groupFamily' }),
  ];

  useEffect(() => {
    setIsModified(
      [watchedNome, watchedEmail, watchedTelefone, watchedGrupoFamiliar].every(
        (field) => field.trim() !== ''
      )
    );
  }, [watchedNome, watchedEmail, watchedTelefone, watchedGrupoFamiliar]);

  const handleSaveClient = async () => {
    setIsSubmitting(true);

    const userExists = userContext.some(
      (user) =>
        user.email === watchedEmail && user.telephone === watchedTelefone
    );

    if (userExists) {
      showSnackbar({
        message: 'Cliente já cadastrado!',
        severity: 'warning',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { name, email } = getValues();
      const newUser = await addUser({
        ...getValues(),
        isAdmin: checked,
      });

      if (checked) {
        const adminPayload: UserAdmin = {
          idUser: newUser._id,
          name: name,
          email: email,
          password: 'udv@realeza',
        };
        await addAdmin(adminPayload);
      }

      router.replace('/painel/clientes');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      reset();
      showSnackbar({
        message: 'Cliente cadastrado com sucesso!',
        severity: 'success',
      });
    } catch (error) {
      showSnackbar({
        message: 'Ocorreu um erro!',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () =>
          setFotoPerfil({
            base64: (reader.result as string).split(',')[1],
            name: file.name,
            size: file.size,
            type: file.type,
          });
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const breadcrumbItems = [
    { label: 'Início', href: '/painel' },
    { label: 'Cliente', href: '/painel/clientes' },
    { label: 'Novo' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <GenericBreadcrumbs items={breadcrumbItems} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text variant="h5" fontWeight="bold">
          Novo cliente
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

      <Box sx={{ flexGrow: 1, marginTop: 5 }}>
        <Grid container spacing={2}>
          <Grid size={4}>
            <Item>
              <ProfilePicture
                fotoPerfil={fotoPerfil}
                onRemove={() => setFotoPerfil(null)}
                onHover={setHovering}
                hovering={hovering}
              />
              <Text variant="h6">{watchedNome || 'Nome'}</Text>
              <ContactInfo email={watchedEmail} telephone={watchedTelefone} />
              <UploadImageButton onUpload={handleUploadFile} />
            </Item>
          </Grid>

          <Grid size={8}>
            <Item>
              <ClientForm
                control={control}
                checked={checked}
                onCheckChange={setChecked}
              />
              <FormActions
                onClear={() => reset(INITIAL_FORM_VALUES)}
                onSave={handleSaveClient}
                disabled={!isModified}
              />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

const ProfilePicture = ({
  fotoPerfil,
  onRemove,
  onHover,
  hovering,
}: {
  fotoPerfil: fotoPerfilProps | null;
  onRemove: () => void;
  onHover: (hover: boolean) => void;
  hovering: boolean;
}) => (
  <Box
    sx={{ position: 'relative', display: 'inline-block' }}
    onMouseEnter={() => onHover(true)}
    onMouseLeave={() => onHover(false)}
  >
    <Avatar
      alt="Foto do Perfil"
      sx={{ width: 56, height: 56, cursor: fotoPerfil ? 'pointer' : 'default' }}
      src={
        fotoPerfil ? `data:image/jpeg;base64,${fotoPerfil.base64}` : undefined
      }
    >
      {fotoPerfil ? '' : 'M'}
    </Avatar>
    {hovering && fotoPerfil && (
      <IconButton
        onClick={onRemove}
        sx={{
          position: 'absolute',
          top: -8,
          right: -8,
          backgroundColor: 'rgba(255,255,255,0.8)',
          '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
        }}
      >
        <ClearOutlinedIcon sx={{ color: 'error.main' }} />
      </IconButton>
    )}
  </Box>
);

const ContactInfo = ({
  email,
  telephone,
}: {
  email: string;
  telephone: string;
}) => (
  <Stack direction="row" gap={1} marginBottom={3}>
    <Text>{email || 'Email'}</Text>
    <Text>-</Text>
    <Text>{telephone || 'Telefone'}</Text>
  </Stack>
);

const UploadImageButton = ({
  onUpload,
}: {
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
    <input
      type="file"
      accept=".pdf,.png,.jpg"
      onChange={onUpload}
      style={{ display: 'none' }}
      id="file-input"
    />
    <label htmlFor="file-input">
      <Botao
        variant="outlined"
        startIcon={<AddIcon />}
        color="primary"
        component="span"
        sx={{ width: 'fit-content' }}
      >
        Alterar foto de perfil
      </Botao>
    </label>
  </Box>
);

const ClientForm = ({ control, checked, onCheckChange }: any) => (
  <Stack gap={2}>
    <Text fontWeight="bold">Dados do cliente</Text>
    <EntradaTexto name="name" control={control} label="Nome" />
    <Stack direction="row" gap={1}>
      <EntradaTexto name="email" control={control} label="Email" />
      <EntradaTexto name="telephone" control={control} label="Telefone" />
    </Stack>
    <EntradaTexto name="groupFamily" control={control} label="Grupo familiar" />
    <Text color="textSecondary" fontWeight="bold">
      Perfil do usuário
    </Text>
    <SwitchSelector
      onChange={onCheckChange}
      options={optionsSwitch}
      initialSelectedIndex={optionsSwitch.findIndex(
        ({ value }) => value === (checked ? 1 : 0) // Compare with 1 for true (Admin) and 0 for false (Client)
      )}
      backgroundColor={'#666666'}
      fontColor={'#f5f6fa'}
      fontSize={17}
    />
  </Stack>
);

const FormActions = ({ onClear, onSave, disabled }: any) => (
  <Box
    sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 3 }}
  >
    <Botao
      variant="contained"
      color="error"
      onClick={onClear}
      sx={{ paddingX: 7, borderRadius: '8px' }}
    >
      Limpar
    </Botao>
    <Botao
      variant="contained"
      color="success"
      onClick={onSave}
      disabled={disabled}
      sx={{ paddingX: 10, borderRadius: '8px' }}
    >
      Cadastrar
    </Botao>
  </Box>
);
