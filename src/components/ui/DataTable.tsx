import React from 'react';

export interface DataTableProps {
  children: React.ReactNode;
  className?: string;
  minWidth?: number | string;
}

export const DataTable: React.FC<DataTableProps> = ({
  children,
  className = '',
  minWidth = 520,
}) => {
  return (
    <div className="table-scroll-container">
      <table
        className={`data-table-refined ${className}`}
        style={{ minWidth }}
      >
        {children}
      </table>
    </div>
  );
};

export default DataTable;
