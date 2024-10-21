'use client';

import AddIcon from '@mui/icons-material/Add';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import GenericBreadcrumbs from '@/app/components/breadcrumb/GenericBreadcrumb';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Text from '@/app/components/ui/text/Text';
import { Avatar, Box, Stack, IconButton } from '@mui/material';
import { Botao, EntradaTexto } from '@/app/components';
import { Cliente } from '@/types/clientes';
import { styled } from '@mui/material/styles';
import { useForm, useWatch } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback, useEffect, ChangeEvent } from 'react';

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
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function NovoCliente() {
  const router = useRouter();

  const [fotoPerfil, setFotoPerfil] = useState<fotoPerfilProps | null>(null);
  const [isModified, setIsModified] = useState(false); // Estado para habilitar/desabilitar o botão
  const [hovering, setHovering] = useState(false); // Estado para controlar o hover

  // Inicializa o formulário com valores padrão
  const clienteForm = useForm<Cliente>({
    defaultValues: {
      nomeCompleto: '',
      email: '',
      telefone: '',
      grupoFamiliar: '',
    },
  });

  const { control, getValues } = clienteForm;

  // Usando useWatch para monitorar os valores dos campos em tempo real
  const watchedNome = useWatch({ control, name: 'nomeCompleto' });
  const watchedEmail = useWatch({ control, name: 'email' });
  const watchedTelefone = useWatch({ control, name: 'telefone' });
  const watchedGrupoFamiliar = useWatch({ control, name: 'grupoFamiliar' });

  useEffect(() => {
    // Pegue os valores atuais do formulário
    const currentValues = getValues();

    // Verifica se todos os campos obrigatórios estão preenchidos
    const allFieldsFilled =
      watchedNome.trim() !== '' &&
      watchedEmail.trim() !== '' &&
      watchedTelefone.trim() !== '' &&
      watchedGrupoFamiliar.trim() !== '';

    // Verifica se houve mudanças no formulário
    const hasFormChanges =
      watchedNome !== currentValues.nomeCompleto ||
      watchedEmail !== currentValues.email ||
      watchedTelefone !== currentValues.telefone ||
      watchedGrupoFamiliar !== currentValues.grupoFamiliar;

    // O botão só estará habilitado se todos os campos estiverem preenchidos e houver alterações
    setIsModified(allFieldsFilled && hasFormChanges);
  }, [
    watchedNome,
    watchedEmail,
    watchedTelefone,
    watchedGrupoFamiliar,
    getValues,
  ]);

  const handleSaveClient = async () => {
    console.log(
      'Salvar cliente',
      clienteForm.getValues(),
      isModified,
      fotoPerfil
    );
  };

  const handleUploadFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFotoPerfil({
          base64: base64String.split(',')[1], // Remover o prefixo base64
          name: file.name,
          size: file.size,
          type: file.type,
        });
      };

      reader.readAsDataURL(file);
    },
    []
  );

  const handleRemoveFoto = () => {
    setFotoPerfil(null); // Remove a foto do estado
  };

  const breadcrumbItems = [
    { label: 'Início', href: '/painel/admin' },
    { label: 'Cliente', href: '/painel/admin/clientes' },
    { label: 'Novo' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <GenericBreadcrumbs items={breadcrumbItems} />

      <Text variant="h5" fontWeight="bold">
        Editar cliente
      </Text>

      <Box sx={{ flexGrow: 1, marginTop: 5 }}>
        <Grid container spacing={2}>
          <Grid size={4}>
            <Item>
              <Box
                sx={{ position: 'relative', display: 'inline-block' }}
                onMouseEnter={() => setHovering(true)} // Ativa o estado de hover
                onMouseLeave={() => setHovering(false)} // Desativa o estado de hover
              >
                <Avatar
                  alt="Foto do Perfil"
                  sx={{
                    width: 56,
                    height: 56,
                    '&:hover': {
                      cursor: fotoPerfil ? 'pointer' : 'default',
                    },
                  }}
                  src={
                    fotoPerfil
                      ? `data:image/jpeg;base64,${fotoPerfil.base64}`
                      : undefined
                  } // Usa o base64 da fotoPerfil se houver
                >
                  {fotoPerfil ? '' : 'M'}
                </Avatar>
                {hovering &&
                  fotoPerfil && ( // Exibe o ícone de remoção no hover
                    <IconButton
                      onClick={handleRemoveFoto}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,1)',
                        },
                      }}
                    >
                      <ClearOutlinedIcon sx={{ color: 'error.main' }} />
                    </IconButton>
                  )}
              </Box>
              <Text variant="h6">{watchedNome ? watchedNome : 'Nome'}</Text>

              <Stack direction="row" gap={1} marginBottom={3}>
                <Text>{watchedEmail ? watchedEmail : 'Email'}</Text>
                <Text>-</Text>
                <Text>{watchedTelefone ? watchedTelefone : 'Telefone'}</Text>
              </Stack>

              <Stack direction="row" gap="0.5rem">
                {uploadImage(fotoPerfil, handleUploadFile)}
              </Stack>
            </Item>
          </Grid>
          <Grid size={8}>
            <Item>
              <Stack gap={2}>
                <Text fontWeight="bold">Dados do cliente</Text>
                <EntradaTexto
                  name="nomeCompleto"
                  control={control}
                  label="Nome"
                />
                <Stack direction="row" gap={1}>
                  <EntradaTexto name="email" control={control} label="Email" />
                  <EntradaTexto
                    name="telefone"
                    control={control}
                    label="Telefone"
                  />
                </Stack>
                <EntradaTexto
                  name="grupoFamiliar"
                  control={control}
                  label="Grupo familiar"
                />
              </Stack>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                  marginTop: 3,
                }}
              >
                <Botao
                  variant="contained"
                  color="error"
                  onClick={() => router.replace('/painel/admin/clientes')}
                  sx={{ paddingX: 7, borderRadius: '8px' }}
                >
                  Cancelar
                </Botao>
                <Botao
                  variant="contained"
                  color="success"
                  onClick={handleSaveClient}
                  sx={{ paddingX: 10, borderRadius: '8px' }}
                >
                  Cadastrar
                </Botao>
              </Box>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

const uploadImage = (
  file: fotoPerfilProps | null,
  handleUploadFile: (event: ChangeEvent<HTMLInputElement>) => void
) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
      }}
    >
      <input
        type="file"
        accept=".pdf,.png,.jpg"
        onChange={handleUploadFile}
        style={{ display: 'none' }}
        id="file-input"
      />
      <label htmlFor="file-input">
        <Botao
          data-testid={'foto-perfil'}
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
};
