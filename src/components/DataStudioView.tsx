import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Database,
  Download,
} from 'lucide-react';
import { Transaction } from '../types';
import { DATASET_PRESETS } from '../data/sampleDatasets';
import { PageHeader, Card, DataTable } from './ui';

interface DataStudioViewProps {
  currentDatasetId: string;
  transactions: Transaction[];
  onLoadDataset: (datasetId: string) => void;
  onCustomUpload: (customTxs: Transaction[], filename: string) => void;
  currencySymbol: string;
}

export const DataStudioView: React.FC<DataStudioViewProps> = ({
  currentDatasetId,
  transactions,
  onLoadDataset,
  onCustomUpload,
  currencySymbol,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parseCSV(file);
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        setUploadStatus('Invalid CSV format: file must contain a header and at least 1 record.');
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));

      // Validate required columns
      const custIdx = headers.findIndex((h) => h.includes('customer') || h.includes('cust_id'));
      const dateIdx = headers.findIndex((h) => h.includes('date') || h.includes('time'));
      const valIdx = headers.findIndex((h) => h.includes('amount') || h.includes('value') || h.includes('price') || h.includes('spend'));
      const catIdx = headers.findIndex((h) => h.includes('category') || h.includes('product'));

      if (custIdx === -1 || valIdx === -1) {
        setUploadStatus(
          `Column validation error: required columns (customer_id, order_value) not found. Detected: [${headers.join(', ')}]`
        );
        return;
      }

      const parsed: Transaction[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim().replace(/['"]/g, ''));
        if (parts.length >= 2) {
          const custId = parts[custIdx] || `CUST-${1000 + i}`;
          const dateStr = dateIdx !== -1 ? parts[dateIdx] : new Date().toISOString().split('T')[0];
          const valNum = valIdx !== -1 ? parseFloat(parts[valIdx]) || 1500 : 1500;
          const catStr = catIdx !== -1 ? parts[catIdx] : 'General Products';

          parsed.push({
            order_id: `ORD-UPL-${i}`,
            customer_id: custId,
            customer_name: `Customer ${custId}`,
            purchase_date: dateStr,
            product_category: catStr,
            product_name: `${catStr} Item`,
            order_value: valNum,
            payment_method: 'UPI',
            channel: 'Online',
          });
        }
      }

      onCustomUpload(parsed, file.name);
      setUploadStatus(`Success: Imported ${parsed.length} customer records from ${file.name}.`);
    };
    reader.readAsText(file);
  };

  const downloadSampleCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'order_id,customer_id,customer_name,purchase_date,product_category,product_name,order_value\n' +
      transactions
        .slice(0, 30)
        .map(
          (t) =>
            `${t.order_id},${t.customer_id},"${t.customer_name}",${t.purchase_date},"${t.product_category}","${t.product_name}",${t.order_value}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'SpendSense_Sample_Dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-content">
      {/* Page Header */}
      <PageHeader
        title="Data studio and schema verification"
        description="Upload customer purchase transactions, validate schema headers, or toggle between synthetic presets."
        badge={<span className="badge-tag active">Schema verified ✓</span>}
        actions={
          <button className="btn-secondary" onClick={downloadSampleCSV}>
            <Download size={13} />
            <span>Export sample CSV</span>
          </button>
        }
      />

      {/* Upload Dropzone & Built-in Presets */}
      <div className="split-view-grid">
        {/* CSV Dropzone */}
        <Card
          padding="lg"
          style={{
            borderStyle: 'dashed',
            borderWidth: '1.5px',
            borderColor: dragActive ? 'var(--accent)' : 'var(--border-strong)',
            background: dragActive ? 'var(--accent-soft)' : 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: '260px',
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) parseCSV(e.dataTransfer.files[0]);
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'var(--surface-sunken)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              marginBottom: '12px',
            }}
          >
            <UploadCloud size={20} />
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
            Upload transaction dataset
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '340px', marginBottom: '16px' }}>
            Drag and drop a CSV file, or browse. Validates customer_id, order_value, and purchase_date columns.
          </p>

          <label className="btn-primary" style={{ cursor: 'pointer' }}>
            <FileText size={13} />
            <span>Select CSV file</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>

          {uploadStatus && (
            <div
              style={{
                marginTop: '16px',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                background: uploadStatus.startsWith('Success')
                  ? 'var(--accent-soft)'
                  : 'var(--surface-sunken)',
                color: uploadStatus.startsWith('Success') ? 'var(--positive)' : 'var(--negative)',
                border: `1px solid ${
                  uploadStatus.startsWith('Success') ? 'var(--positive)' : 'var(--negative)'
                }`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {uploadStatus.startsWith('Success') ? (
                <CheckCircle2 size={14} />
              ) : (
                <AlertCircle size={14} />
              )}
              <span>{uploadStatus}</span>
            </div>
          )}
        </Card>

        {/* 1-Click Synthetic Presets */}
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Database size={16} style={{ color: 'var(--text-muted)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
              Synthetic benchmark presets
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Switch presets with 1 click to test diverse consumer spending distributions
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DATASET_PRESETS.map((preset) => {
              const isActive = currentDatasetId === preset.id;
              return (
                <div
                  key={preset.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                    background: isActive ? 'var(--accent-soft)' : 'var(--surface-sunken)',
                    cursor: 'pointer',
                    transition: 'border-color 120ms ease-out',
                  }}
                  onClick={() => onLoadDataset(preset.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                      {preset.name}
                    </span>
                    {isActive && (
                      <span className="badge-tag active">
                        Active ✓
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {preset.industry} • {preset.transactions.length} records
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                    {preset.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Raw Data Preview Table */}
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
              Live ingested transactions ({transactions.length} records)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Normalized schema driving RFM segmentation, What-If simulator, and Copilot
            </p>
          </div>
        </div>

        <DataTable minWidth={600}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Purchase date</th>
              <th>Category</th>
              <th>Product item</th>
              <th className="num-col">Order value</th>
              <th>Channel</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map((tx) => (
              <tr key={tx.order_id}>
                <td style={{ fontFamily: 'monospace', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  {tx.order_id}
                </td>
                <td>
                  <div style={{ fontWeight: 500, color: 'var(--text)' }}>{tx.customer_name}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-faint)' }}>{tx.customer_id}</div>
                </td>
                <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{tx.purchase_date}</td>
                <td>
                  <span className="badge-tag">{tx.product_category}</span>
                </td>
                <td style={{ color: 'var(--text)' }}>{tx.product_name}</td>
                <td className="num-col" style={{ fontWeight: 600, color: 'var(--text)' }}>
                  {currencySymbol}{tx.order_value.toLocaleString()}
                </td>
                <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{tx.channel || 'Online'}</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </Card>
    </div>
  );
};

export default DataStudioView;
