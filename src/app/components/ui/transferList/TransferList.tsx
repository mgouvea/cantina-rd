import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { capitalize } from '@/utils';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  telephone: string;
  groupFamily: string;
  createdAt: string;
}

interface TransferListProps {
  users: User[];
  onSelectionChange?: (
    selectedUsers: { userId: string; name: string }[]
  ) => void;
  initialSelected?: { userId: string; name: string }[];
}

function not(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.includes(value));
}

function union(a: readonly string[], b: readonly string[]) {
  return [...a, ...not(b, a)];
}

export default function TransferList({
  users,
  onSelectionChange,
  initialSelected = [],
}: TransferListProps) {
  const [checked, setChecked] = React.useState<readonly string[]>([]);
  const [left, setLeft] = React.useState<readonly string[]>(() => {
    // Remove os usuários inicialmente selecionados da lista da esquerda
    const initialSelectedIds = new Set(
      initialSelected.map((user) => user.userId)
    );
    return users
      .map((user) => user._id)
      .filter((id) => !initialSelectedIds.has(id));
  });
  const [right, setRight] = React.useState<readonly string[]>(() =>
    // Inicializa a lista da direita com os IDs dos usuários selecionados
    initialSelected.map((user) => user.userId)
  );

  // Mapa para buscar usuários por ID rapidamente
  const userMap = React.useMemo(() => {
    const map = new Map<string, User>();
    users.forEach((user) => map.set(user._id, user));
    return map;
  }, [users]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedUsers = right.map((userId) => ({
        userId,
        name: userMap.get(userId)?.name || '',
      }));
      onSelectionChange(selectedUsers);
    }
  }, [right, userMap, onSelectionChange]);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly string[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly string[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: React.ReactNode, items: readonly string[]) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 300,
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((userId: string) => {
          const user = userMap.get(userId);
          if (!user) return null;

          const labelId = `transfer-list-item-${userId}-label`;

          return (
            <ListItemButton
              key={userId}
              role="listitem"
              onClick={handleToggle(userId)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(userId)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={capitalize(user.name)} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid
      container
      spacing={2}
      sx={{ justifyContent: 'flex-start', alignItems: 'center' }}
    >
      <Grid item>{customList('Usuários Disponíveis', left)}</Grid>
      <Grid item>
        <Grid container direction="column" sx={{ alignItems: 'center' }}>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('Usuários Selecionados', right)}</Grid>
    </Grid>
  );
}
