import React from 'react';
import * as ReactWindow from 'react-window';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import BrandCard from '../brand/BrandCard';

const { FixedSizeList } = ReactWindow;

/**
 * Virtualized Brand Grid Component
 * Uses react-window for efficient rendering of large brand lists
 * Only renders visible items, dramatically improving performance
 * 
 * @param {Object} props
 * @param {Array} props.brands - Array of brand objects to display
 * @param {number} props.itemHeight - Height of each item (default: 500)
 * @param {number} props.overscanCount - Number of items to render outside visible area (default: 2)
 */
const VirtualizedBrandList = ({
  brands = [],
  itemHeight = 500,
  overscanCount = 2,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Determine grid columns based on screen size
  const getColumnsPerRow = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const columnsPerRow = getColumnsPerRow();
  const rowCount = Math.ceil(brands.length / columnsPerRow);

  // Row renderer function
  const Row = ({ index, style }) => {
    const startIndex = index * columnsPerRow;
    const rowBrands = brands.slice(startIndex, startIndex + columnsPerRow);

    return (
      <Box
        style={style}
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columnsPerRow}, 1fr)`,
          gap: 3,
          px: { xs: 2, md: 0 },
        }}
      >
        {rowBrands.map((brand, i) => (
          <Box key={brand.id || startIndex + i}>
            <BrandCard brand={brand} index={startIndex + i} />
          </Box>
        ))}
      </Box>
    );
  };

  if (brands.length === 0) {
    return null;
  }

  return (
    <FixedSizeList
      height={window.innerHeight - 300} // Adjust based on header/filter height
      itemCount={rowCount}
      itemSize={itemHeight}
      width="100%"
      overscanCount={overscanCount}
    >
      {Row}
    </FixedSizeList>
  );
};

/**
 * Virtualized Simple List (for single column layouts)
 * Better for mobile or detail-heavy lists
 */
export const VirtualizedSimpleList = ({
  items = [],
  renderItem,
  itemHeight = 150,
  height = 600,
  overscanCount = 3,
}) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      {renderItem(items[index], index)}
    </div>
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <FixedSizeList
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      width="100%"
      overscanCount={overscanCount}
    >
      {Row}
    </FixedSizeList>
  );
};

/**
 * Auto-sized Virtual List
 * Automatically calculates container height based on viewport
 */
export const AutoVirtualizedList = ({
  items = [],
  renderItem,
  itemHeight = 150,
  headerHeight = 200,
  footerHeight = 100,
  overscanCount = 3,
}) => {
  const [containerHeight, setContainerHeight] = React.useState(600);

  React.useEffect(() => {
    const calculateHeight = () => {
      const viewportHeight = window.innerHeight;
      const availableHeight = viewportHeight - headerHeight - footerHeight;
      setContainerHeight(Math.max(400, availableHeight));
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, [headerHeight, footerHeight]);

  const Row = ({ index, style }) => (
    <div style={style}>
      {renderItem(items[index], index)}
    </div>
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <FixedSizeList
      height={containerHeight}
      itemCount={items.length}
      itemSize={itemHeight}
      width="100%"
      overscanCount={overscanCount}
    >
      {Row}
    </FixedSizeList>
  );
};

export default VirtualizedBrandList;
