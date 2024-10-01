'use client';
import { Avatar, Box, Stack } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Text from '@/app/components/ui/text/Text';
import { Botao, EntradaTexto } from '@/app/components';
import { useForm } from 'react-hook-form';
import { Cliente } from '@/types/clientes';
import GenericBreadcrumbs from '@/app/components/breadcrumb/GenericBreadcrumb';

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

export default function EditarCliente() {
  const { id } = useParams();

  const router = useRouter();

  const clienteForm = useForm<Cliente>({
    defaultValues: {
      nomeCompleto: '',
      email: '',
      telefone: '',
      grupoFamiliar: '',
    },
  });

  const handleUpdateClients = async () => {
    console.log('Atualizar cliente', clienteForm.getValues());
  };

  const breadcrumbItems = [
    { label: 'Início', href: '/painel/admin' },
    { label: 'Cliente', href: '/painel/admin/clientes' },
    { label: 'Editar' },
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
              <Avatar alt="Remy Sharp" sx={{ width: 56, height: 56 }}>
                M
              </Avatar>
              <Text variant="h6">Nome</Text>

              <Stack direction="row" gap={1} marginBottom={3}>
                <Text>Email</Text>
                <Text>-</Text>
                <Text>Telefone</Text>
              </Stack>

              <Botao variant="contained" color="error">
                Excluir
              </Botao>
            </Item>
          </Grid>
          <Grid size={8}>
            <Item>
              <Stack gap={2}>
                <Text fontWeight="bold">Dados do cliente</Text>
                <EntradaTexto
                  name="nomeCompleto"
                  control={clienteForm.control}
                  label="Nome"
                />
                <Stack direction="row" gap={1}>
                  <EntradaTexto
                    name="email"
                    control={clienteForm.control}
                    label="Email"
                  />
                  <EntradaTexto
                    name="telefone"
                    control={clienteForm.control}
                    label="Telefone"
                  />
                </Stack>
                <EntradaTexto
                  name="grupoFamiliar"
                  control={clienteForm.control}
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
                  onClick={handleUpdateClients}
                  sx={{ paddingX: 10, borderRadius: '8px' }}
                >
                  Atualizar
                </Botao>
              </Box>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
