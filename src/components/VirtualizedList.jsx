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
      <div style={{ ...style, marginBottom: '10px', padding: '10px', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <ListItem key={index} component="div" disablePadding>
          <ListItemButton>
            <ListItemText
              primary={<strong>{item.nome}</strong>} // Nome destacado em negrito
              secondary={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.9rem', color: '#555' }}>
                  <div>Categoria: <strong style={{color: item.corCategoria}}>{item.categoria}</strong></div>
                  <div>Data: {formatarData(item.dataCadastro)}</div>
                  <div>Preço: <span style={{ fontWeight: 'bold', color: '#449E5C' }}>R$ {item.valor.toFixed(2)}</span></div>
                </div>
              }
            />
          </ListItemButton>
        </ListItem>
      </div>
    );
  }
  

export default function VirtualizedList({ items }) {

  // Calcula a largura do contêiner dinamicamente
  const containerRef = React.useRef();
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: 330,
        maxWidth: '100%',
        bgcolor: 'background.paper',
      }}
    >
      <FixedSizeList
        height={330}
        width={width}
        itemSize={150} // Altura ajustada para comportar mais conteúdo
        itemCount={items.length}
        itemData={items} // Passa os itens para o Virtual Scroller
        overscanCount={10}
      >
        {(props) => renderRow({ ...props, data: props.data })}
      </FixedSizeList>
    </Box>
  );
}
