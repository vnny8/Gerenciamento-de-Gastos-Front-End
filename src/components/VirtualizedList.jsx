import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';

const formatarData = (data) => {
    const options = { day: '2-digit', month: 'long' };
    return new Date(data).toLocaleDateString('pt-BR', options);
  };
  
function renderRow({ index, style, data }) {
  const item = data[index];

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText
          primary={`${item.nome}`}
          secondary={`Data: ${formatarData(item.dataCadastro)} | Preço: R$ ${item.valor.toFixed(2)}`}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default function VirtualizedList({ items }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: 330,
        maxWidth: 360,
        bgcolor: 'background.paper',
      }}
    >
      <FixedSizeList
        height={330}
        width={360}
        itemSize={70} // Altura ajustada para comportar mais conteúdo
        itemCount={items.length}
        itemData={items} // Passa os itens para o Virtual Scroller
        overscanCount={4}
      >
        {(props) => renderRow({ ...props, data: props.data })}
      </FixedSizeList>
    </Box>
  );
}
