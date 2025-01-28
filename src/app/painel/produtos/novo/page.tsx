'use client';

import GenericBreadcrumbs from '@/app/components/breadcrumb/GenericBreadcrumb';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Text from '@/app/components/ui/text/Text';
import { Box, IconButton, Stack, Tooltip, useTheme } from '@mui/material';
import { useState } from 'react';
import FastfoodRoundedIcon from '@mui/icons-material/FastfoodRounded';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ChecklistRtlOutlinedIcon from '@mui/icons-material/ChecklistRtlOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { Botao, EntradaTexto } from '@/app/components';
import { useForm } from 'react-hook-form';
import { Products } from '@/types/products';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  dir?: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, dir, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const breadcrumbItems = [
  { label: 'Início', href: '/painel' },
  { label: 'Produtos', href: '/painel/produtos' },
  { label: 'Novo' },
];

const INITIAL_FORM_VALUES = {
  name: '',
  description: '',
  price: undefined,
  quantity: undefined,
  category: '',
  subcategory: '',
};

export default function NovoProduto() {
  const theme = useTheme();
  const router = useRouter();

  const [value, setValue] = useState(0);

  const userForm = useForm<Products>({ defaultValues: INITIAL_FORM_VALUES });
  const { control, getValues, reset } = userForm;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSaveProducts = async () => {}

  return (
    <Stack>
      <GenericBreadcrumbs items={breadcrumbItems} />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text variant="h5" fontWeight="bold">
          Cadastrar {value === 0 ? 'novo produto' : value === 1 ? 'nova categoria' : 'nova subcategoria'}
        </Text>
        <IconButton
          sx={{
            backgroundColor: 'success.dark',
            '&:hover': { backgroundColor: 'success.main', transition: '0.3s' },
          }}
          onClick={() => router.replace('/painel/produtos')}
        >
          <Tooltip title="Voltar">
            <ArrowBackIcon fontSize="medium" sx={{ color: '#fff' }} />
          </Tooltip>
        </IconButton>
      </Stack>

      <Stack
        sx={{
          width: '100%',
          minHeight: '500px',
          backgroundColor: '#fff',
          borderRadius: '16px',
          mt: 5,
        }}
      >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab icon={<FastfoodRoundedIcon />} label="Produto" {...a11yProps(0)} />
          <Tab icon={<CategoryOutlinedIcon />} label="Categoria" {...a11yProps(1)} />
          <Tab icon={<ChecklistRtlOutlinedIcon />} label="Subcategoria" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0} dir={theme.direction}>
        <ProductsForm control={control} handleSaveProducts={handleSaveProducts} reset={reset} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1} dir={theme.direction}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2} dir={theme.direction}>
        Item Three
      </CustomTabPanel>
      </Stack>
    </Stack>
  );
}

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


const ProductsForm = ({ control, handleSaveProducts, reset }: any) => (
  <Stack gap={2} >
    <Text fontWeight="bold">Dados do Produto</Text>

    <Stack sx={{px: 25}} gap={2}>
      <Stack direction="row" gap={1}>
        <EntradaTexto name="name" control={control} label="Nome do produto" />
          <EntradaTexto name="price" control={control} label="Preço" />
          <EntradaTexto name="quantity" control={control} label="Quantidade" />
      </Stack>
    
      <Stack direction="row" gap={1}>
        <EntradaTexto name="category" control={control} label="Categoria" />
        <EntradaTexto name="subcategory" control={control} label="Subcategoria" />
      </Stack>

      <Stack direction="row" gap={1}>
        <EntradaTexto name="description" control={control} label="Descrição" props={{ multiline: true, rows: 4 }} />
      </Stack>
    </Stack>

    <FormActions
      onClear={() => reset(INITIAL_FORM_VALUES)}
      onSave={handleSaveProducts}
      // disabled={!isModified}
    />
  </Stack>
);


