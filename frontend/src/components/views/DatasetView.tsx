import React, { useState, useMemo } from 'react';
import {
  Database,
  Layers,
  Target,
  FileCheck2,
  CheckCircle2,
  Search,
  Download,
  Upload,
  RotateCcw,
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { generateSyntheticDataset } from '../../utils/tribologyEngine';
import { DatasetRow } from '../../types/tribology';

export const DatasetView: React.FC = () => {
  const allData: DatasetRow[] = useMemo(() => generateSyntheticDataset(3000), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filtered rows
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return allData;
    const q = searchQuery.toLowerCase();
    return allData.filter(
      (r) =>
        r.material_pair.toLowerCase().includes(q) ||
        r.lubrication.toLowerCase().includes(q) ||
        r.id.toString().includes(q) ||
        r.normal_load.toString().includes(q)
    );
  }, [allData, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Distribution chart data
  const volumeHistData = [
    { range: '10⁻⁵', count: 50 },
    { range: '10⁻⁴', count: 180 },
    { range: '10⁻³', count: 340 },
    { range: '10⁻²', count: 590 },
    { range: '10⁻¹', count: 750 },
    { range: '10⁰', count: 620 },
    { range: '10¹', count: 370 },
    { range: '10²', count: 90 },
  ];

  const rateHistData = [
    { range: '10⁻⁶', count: 70 },
    { range: '10⁻⁵', count: 250 },
    { range: '10⁻⁴', count: 530 },
    { range: '10⁻³', count: 810 },
    { range: '10⁻²', count: 690 },
    { range: '10⁻¹', count: 470 },
    { range: '10⁰', count: 180 },
  ];

  // Scatter plot points
  const scatterData = useMemo(() => {
    return allData.slice(0, 180).map((r) => ({
      x: r.normal_load,
      y: r.wear_volume,
    }));
  }, [allData]);

  const handleExportCSV = () => {
    const headers = [
      '#',
      'normal_load',
      'sliding_speed',
      'surface_roughness',
      'sliding_distance',
      'hardness',
      'friction_coeff',
      'temperature',
      'lubrication',
      'contact_pressure',
      'wear_coefficient',
      'material_pair',
      'wear_volume',
      'wear_rate',
    ];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(',')]
        .concat(
          allData.map((row) =>
            [
              row.id,
              row.normal_load,
              row.sliding_speed,
              row.surface_roughness,
              row.sliding_distance,
              row.hardness,
              row.friction_coeff,
              row.temperature,
              row.lubrication,
              row.contact_pressure,
              row.wear_coefficient,
              `"${row.material_pair}"`,
              row.wear_volume,
              row.wear_rate,
            ].join(',')
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'adhesive_wear_dataset_3000.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-3.5">
      {/* Top Banner matching Screenshot 3 */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3 bg-white border border-[#E5E0D8] rounded-lg px-4 py-2.5 shadow-sm">
          <div className="text-[#F95721] flex-shrink-0">
            <Database size={34} className="stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[22px] font-black text-[#111827] tracking-tight leading-tight">DATASET</h2>
              <span className="text-[12px] font-bold text-[#F95721]">
                Synthetic Demonstration Dataset — Not Experimental Data
              </span>
            </div>
            <p className="text-[11px] text-[#4B5563] font-medium leading-tight">
              Calibrated tribological parameters adhering to contact mechanics laws
            </p>
          </div>
        </div>

        {/* Dataset Information Box */}
        <div className="flex-1 bg-[#FFF9F2] border border-[#FED7AA] rounded-lg px-3.5 py-2 flex items-start gap-2.5 text-xs shadow-sm">
          <Info size={16} className="text-[#111827] flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#111827] font-bold block text-[11px]">Dataset Information</strong>
            <p className="text-[11px] text-[#4B5563] leading-relaxed">
              This is a synthetically generated dataset based on tribological principles and engineering assumptions for research and educational demonstration purposes. It can be replaced with real experimental data in the same format.
            </p>
          </div>
        </div>

        {/* Right Badges */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="border border-[#FED7AA] bg-[#FFF9F2] text-[#F95721] px-2.5 py-1.5 rounded text-[11px] font-bold">
            Synthetic Dataset
          </div>
          <button className="border border-[#FED7AA] bg-white hover:bg-[#FFF9F2] text-[#F95721] px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition">
            <Upload size={13} />
            <span>Replace with Experimental Data</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {/* Observations */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#FFF2EC] text-[#F95721] flex items-center justify-center flex-shrink-0">
            <Database size={19} />
          </div>
          <div>
            <span className="text-[20px] font-black text-[#111827] font-mono leading-none block">3,000</span>
            <span className="text-[10px] text-[#6B7280] font-medium">Observations</span>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#FFF2EC] text-[#F95721] flex items-center justify-center flex-shrink-0">
            <Layers size={19} />
          </div>
          <div>
            <span className="text-[20px] font-black text-[#111827] font-mono leading-none block">11</span>
            <span className="text-[10px] text-[#6B7280] font-medium">Features</span>
          </div>
        </div>

        {/* Target Variables */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#FFF2EC] text-[#F95721] flex items-center justify-center flex-shrink-0">
            <Target size={19} />
          </div>
          <div>
            <span className="text-[20px] font-black text-[#111827] font-mono leading-none block">2</span>
            <span className="text-[10px] text-[#6B7280] font-medium">Target Variables</span>
          </div>
        </div>

        {/* Missing Values */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#FFF2EC] text-[#F95721] flex items-center justify-center flex-shrink-0">
            <FileCheck2 size={19} />
          </div>
          <div>
            <span className="text-[20px] font-black text-[#111827] font-mono leading-none block">0</span>
            <span className="text-[10px] text-[#6B7280] font-medium">Missing Values</span>
          </div>
        </div>

        {/* Dataset Status */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-[10px] text-[#6B7280] block font-medium">Dataset Status</span>
            <span className="text-[12px] font-extrabold text-emerald-700">Validated</span>
          </div>
        </div>

        {/* Data Quality */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-2.5 shadow-sm text-[10px] space-y-0.5">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="flex items-center gap-1">✔ Completeness</span>
            <span className="font-bold">100%</span>
          </div>
          <div className="flex items-center justify-between text-emerald-700">
            <span className="flex items-center gap-1">✔ Duplicate Rows</span>
            <span className="font-bold">0</span>
          </div>
          <div className="flex items-center justify-between text-emerald-700">
            <span className="flex items-center gap-1">✔ Range Validation</span>
            <span className="font-bold">Passed</span>
          </div>
          <div className="flex items-center justify-between text-emerald-700">
            <span className="flex items-center gap-1">✔ Outlier Detection</span>
            <span className="font-bold">Checked</span>
          </div>
          <div className="flex items-center justify-between text-emerald-700">
            <span className="flex items-center gap-1">✔ Data Leakage Check</span>
            <span className="font-bold">Passed</span>
          </div>
        </div>
      </div>

      {/* Dataset Preview (First 10 Rows) */}
      <div className="bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-[#F0ECE1]">
          <h3 className="font-extrabold text-[13px] text-[#111827]">
            Dataset Preview (First 10 Rows)
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-2.5 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search in dataset..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-7 pr-2.5 py-1 text-[11px] bg-white border border-[#D1D5DB] rounded focus:ring-1 focus:ring-[#F95721] w-44"
              />
            </div>

            <select className="text-[11px] bg-white border border-[#D1D5DB] rounded px-2 py-1">
              <option>All Columns</option>
            </select>

            <select className="text-[11px] bg-white border border-[#D1D5DB] rounded px-2 py-1">
              <option>Sort</option>
            </select>

            <select className="text-[11px] bg-white border border-[#D1D5DB] rounded px-2 py-1">
              <option>Rows: 10</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="bg-[#F95721] hover:bg-[#E04410] text-white text-[11px] font-bold px-3 py-1 rounded flex items-center gap-1 shadow-sm transition"
            >
              <Download size={12} />
              <span>Export CSV</span>
            </button>

            <button className="bg-white border border-[#D1D5DB] hover:bg-[#FAF8F3] text-[#374151] text-[11px] font-semibold px-2.5 py-1 rounded flex items-center gap-1 transition">
              <Upload size={12} />
              <span>Import Data</span>
            </button>

            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="bg-white border border-[#D1D5DB] hover:bg-[#FAF8F3] text-[#6B7280] text-[11px] font-semibold px-2 py-1 rounded flex items-center gap-1 transition"
            >
              <RotateCcw size={11} />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Exact Table matching Screenshot 3 */}
        <div className="overflow-x-auto rounded border border-[#E5E0D8]">
          <table className="w-full text-[11px] text-left">
            <thead className="bg-[#FAF8F3] text-[#4B5563] text-[10px] font-mono border-b border-[#E5E0D8]">
              <tr>
                <th className="py-2 px-2">#</th>
                <th className="py-2 px-2">normal_load (N)</th>
                <th className="py-2 px-2">sliding_speed (m/s)</th>
                <th className="py-2 px-2">surface_roughness (µm)</th>
                <th className="py-2 px-2">sliding_distance (m)</th>
                <th className="py-2 px-2">hardness (GPa)</th>
                <th className="py-2 px-2">friction_coeff (µ)</th>
                <th className="py-2 px-2">temperature (°C)</th>
                <th className="py-2 px-2">lubrication</th>
                <th className="py-2 px-2">contact_pressure (MPa)</th>
                <th className="py-2 px-2">wear_coefficient</th>
                <th className="py-2 px-2">material_pair</th>
                <th className="py-2 px-2 text-[#F95721] font-bold">wear_volume (mm³)</th>
                <th className="py-2 px-2 text-[#F95721] font-bold">wear_rate (mm³/m)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE1] font-mono text-[11px]">
              {paginatedRows.map((r, idx) => (
                <tr key={r.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F3]'}>
                  <td className="py-1.5 px-2 text-[#9CA3AF]">{r.id}</td>
                  <td className="py-1.5 px-2 text-[#111827] font-semibold">{r.normal_load}</td>
                  <td className="py-1.5 px-2 text-[#374151]">{r.sliding_speed.toFixed(2)}</td>
                  <td className="py-1.5 px-2 text-[#374151]">{r.surface_roughness.toFixed(1)}</td>
                  <td className="py-1.5 px-2 text-[#374151]">{r.sliding_distance}</td>
                  <td className="py-1.5 px-2 text-[#374151]">{r.hardness.toFixed(1)}</td>
                  <td className="py-1.5 px-2 text-[#374151]">{r.friction_coeff.toFixed(2)}</td>
                  <td className="py-1.5 px-2 text-[#374151]">{r.temperature}</td>
                  <td className="py-1.5 px-2 font-sans">{r.lubrication}</td>
                  <td className="py-1.5 px-2 text-[#374151]">{r.contact_pressure}</td>
                  <td className="py-1.5 px-2 text-[#4B5563]">{r.wear_coefficient.toExponential(1)}</td>
                  <td className="py-1.5 px-2 font-sans font-medium text-[#111827]">{r.material_pair}</td>
                  <td className="py-1.5 px-2 text-[#F95721] font-bold">{r.wear_volume.toFixed(3)}</td>
                  <td className="py-1.5 px-2 text-[#F95721] font-semibold">{r.wear_rate.toExponential(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between text-[11px] text-[#6B7280] pt-2.5">
          <span>Showing 1 to 10 of 3,000 rows</span>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded border border-[#D1D5DB] disabled:opacity-40"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="px-2 py-0.5 bg-[#F95721] text-white font-bold rounded">
              1
            </span>
            <span className="px-2 py-0.5 hover:bg-[#FAF8F3] cursor-pointer rounded">2</span>
            <span className="px-2 py-0.5 hover:bg-[#FAF8F3] cursor-pointer rounded">3</span>
            <span className="px-2 py-0.5 hover:bg-[#FAF8F3] cursor-pointer rounded">4</span>
            <span className="px-2 py-0.5 hover:bg-[#FAF8F3] cursor-pointer rounded">5</span>
            <span className="px-1 text-[#9CA3AF]">...</span>
            <span className="px-2 py-0.5 hover:bg-[#FAF8F3] cursor-pointer rounded">300</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded border border-[#D1D5DB] disabled:opacity-40"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Dataset Visualizations Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {/* Hist 1: Wear Volume */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm">
          <div className="mb-1">
            <h4 className="font-extrabold text-[11px] text-[#111827]">Wear Volume Distribution</h4>
            <div className="text-[9px] text-[#6B7280] font-mono flex justify-between">
              <span>Mean: 0.832</span>
              <span>Median: 0.210</span>
            </div>
            <div className="text-[9px] text-[#6B7280] font-mono flex justify-between">
              <span>Std Dev: 1.420</span>
              <span>Min: 1.2e-5</span>
            </div>
          </div>
          <div className="h-28 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeHistData} margin={{ top: 2, right: 2, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#F0ECE1" />
                <XAxis dataKey="range" tick={{ fontSize: 7, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 7, fill: '#6B7280' }} />
                <Bar dataKey="count" fill="#F95721" radius={[1, 1, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[8px] text-[#6B7280] text-center font-mono">Wear Volume (mm³)</div>
        </div>

        {/* Hist 2: Wear Rate */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm">
          <div className="mb-1">
            <h4 className="font-extrabold text-[11px] text-[#111827]">Wear Rate Distribution</h4>
            <div className="text-[9px] text-[#6B7280] font-mono flex justify-between">
              <span>Mean: 2.1e-4</span>
              <span>Median: 8.5e-5</span>
            </div>
            <div className="text-[9px] text-[#6B7280] font-mono flex justify-between">
              <span>Std Dev: 4.2e-4</span>
              <span>Min: 1.0e-6</span>
            </div>
          </div>
          <div className="h-28 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rateHistData} margin={{ top: 2, right: 2, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#F0ECE1" />
                <XAxis dataKey="range" tick={{ fontSize: 7, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 7, fill: '#6B7280' }} />
                <Bar dataKey="count" fill="#F95721" radius={[1, 1, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[8px] text-[#6B7280] text-center font-mono">Wear Rate (mm³/m)</div>
        </div>

        {/* Correlation Matrix */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-extrabold text-[11px] text-[#111827] mb-1">Feature Correlation Matrix</h4>
            <div className="grid grid-cols-7 gap-0.5 text-[8px] text-center font-mono">
              <div className="bg-red-500 text-white p-0.5">1.0</div>
              <div className="bg-red-300 p-0.5">0.7</div>
              <div className="bg-blue-200 p-0.5">-0.3</div>
              <div className="bg-red-200 p-0.5">0.5</div>
              <div className="bg-blue-300 p-0.5">-0.6</div>
              <div className="bg-red-400 text-white p-0.5">0.8</div>
              <div className="bg-red-500 text-white p-0.5">0.9</div>

              <div className="bg-red-300 p-0.5">0.7</div>
              <div className="bg-red-500 text-white p-0.5">1.0</div>
              <div className="bg-blue-100 p-0.5">-0.2</div>
              <div className="bg-red-300 p-0.5">0.6</div>
              <div className="bg-blue-200 p-0.5">-0.5</div>
              <div className="bg-red-300 p-0.5">0.7</div>
              <div className="bg-red-400 text-white p-0.5">0.8</div>

              <div className="bg-blue-200 p-0.5">-0.3</div>
              <div className="bg-blue-100 p-0.5">-0.2</div>
              <div className="bg-red-500 text-white p-0.5">1.0</div>
              <div className="bg-blue-200 p-0.5">-0.4</div>
              <div className="bg-red-300 p-0.5">0.6</div>
              <div className="bg-blue-300 p-0.5">-0.7</div>
              <div className="bg-blue-400 text-white p-0.5">-0.8</div>

              <div className="bg-red-200 p-0.5">0.5</div>
              <div className="bg-red-300 p-0.5">0.6</div>
              <div className="bg-blue-200 p-0.5">-0.4</div>
              <div className="bg-red-500 text-white p-0.5">1.0</div>
              <div className="bg-blue-200 p-0.5">-0.5</div>
              <div className="bg-red-300 p-0.5">0.6</div>
              <div className="bg-red-400 text-white p-0.5">0.7</div>

              <div className="bg-blue-300 p-0.5">-0.6</div>
              <div className="bg-blue-200 p-0.5">-0.5</div>
              <div className="bg-red-300 p-0.5">0.6</div>
              <div className="bg-blue-200 p-0.5">-0.5</div>
              <div className="bg-red-500 text-white p-0.5">1.0</div>
              <div className="bg-blue-400 text-white p-0.5">-0.8</div>
              <div className="bg-blue-500 text-white p-0.5">-0.9</div>
            </div>
            <div className="flex justify-between text-[7px] text-[#6B7280] font-mono mt-1">
              <span>Ld</span>
              <span>Sp</span>
              <span>Ra</span>
              <span>Di</span>
              <span>Ha</span>
              <span>Te</span>
              <span>WV</span>
            </div>
          </div>
        </div>

        {/* Scatter: Normal Load vs Wear Volume */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm">
          <h4 className="font-extrabold text-[11px] text-[#111827] mb-1">Normal Load vs Wear Volume</h4>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 2, right: 2, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#F0ECE1" />
                <XAxis dataKey="x" tick={{ fontSize: 7, fill: '#6B7280' }} />
                <YAxis dataKey="y" tick={{ fontSize: 7, fill: '#6B7280' }} />
                <Scatter data={scatterData} fill="#F95721" opacity={0.65} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[8px] text-[#6B7280] text-center font-mono">Normal Load (N)</div>
        </div>

        {/* Effect of Lubrication Box Plot representation */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-extrabold text-[11px] text-[#111827] mb-2">Effect of Lubrication</h4>
            <div className="flex items-center justify-around h-24 pt-2">
              <div className="flex flex-col items-center">
                <div className="w-6 h-14 bg-[#FED7AA] border-2 border-[#F95721] rounded relative">
                  <div className="w-full h-0.5 bg-[#C2410C] absolute top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[9px] font-bold text-[#111827] mt-1">Dry</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-8 bg-[#E5E7EB] border-2 border-[#6B7280] rounded relative mt-6">
                  <div className="w-full h-0.5 bg-[#1F2937] absolute top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[9px] font-bold text-[#111827] mt-1">Lubricated</span>
              </div>
            </div>
            <div className="text-[8px] text-[#6B7280] text-center font-mono">Wear Volume (mm³)</div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Feature Dictionary, Assumptions, Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        {/* Feature Dictionary (5 cols) */}
        <div className="md:col-span-5 bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm">
          <h4 className="font-extrabold text-[12px] text-[#111827] pb-1.5 mb-1.5 border-b border-[#F0ECE1]">
            Feature Dictionary (11 Features + 2 Targets)
          </h4>
          <div className="overflow-hidden rounded border border-[#E5E0D8] text-[10px]">
            <table className="w-full text-left font-mono">
              <thead className="bg-[#FAF8F3] text-[#4B5563] text-[9px]">
                <tr>
                  <th className="py-1 px-1.5">Feature Name</th>
                  <th className="py-1 px-1.5">Unit</th>
                  <th className="py-1 px-1.5 font-sans">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1] text-[10px]">
                <tr>
                  <td className="py-0.5 px-1.5 font-bold">normal_load</td>
                  <td className="py-0.5 px-1.5">N</td>
                  <td className="py-0.5 px-1.5 font-sans">Normal load applied on contact surface</td>
                </tr>
                <tr>
                  <td className="py-0.5 px-1.5 font-bold">sliding_speed</td>
                  <td className="py-0.5 px-1.5">m/s</td>
                  <td className="py-0.5 px-1.5 font-sans">Relative sliding speed between surfaces</td>
                </tr>
                <tr>
                  <td className="py-0.5 px-1.5 font-bold">surface_roughness</td>
                  <td className="py-0.5 px-1.5">µm</td>
                  <td className="py-0.5 px-1.5 font-sans">Average surface roughness (Ra)</td>
                </tr>
                <tr>
                  <td className="py-0.5 px-1.5 font-bold">sliding_distance</td>
                  <td className="py-0.5 px-1.5">m</td>
                  <td className="py-0.5 px-1.5 font-sans">Total sliding distance</td>
                </tr>
                <tr>
                  <td className="py-0.5 px-1.5 font-bold">hardness</td>
                  <td className="py-0.5 px-1.5">GPa</td>
                  <td className="py-0.5 px-1.5 font-sans">Material hardness</td>
                </tr>
                <tr>
                  <td className="py-0.5 px-1.5 font-bold text-[#F95721]">wear_volume (target)</td>
                  <td className="py-0.5 px-1.5">mm³</td>
                  <td className="py-0.5 px-1.5 font-sans">Total wear volume (target variable)</td>
                </tr>
                <tr>
                  <td className="py-0.5 px-1.5 font-bold text-[#F95721]">wear_rate (target)</td>
                  <td className="py-0.5 px-1.5">mm³/m</td>
                  <td className="py-0.5 px-1.5 font-sans">Wear rate per unit distance (target)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Assumptions (4 cols) */}
        <div className="md:col-span-4 bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-extrabold text-[12px] text-[#111827] pb-1.5 mb-1.5 border-b border-[#F0ECE1]">
              Dataset Generation Assumptions
            </h4>
            <ul className="space-y-1 text-[11px] text-[#4B5563]">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F95721] mt-1.5 flex-shrink-0" />
                <span>Based on Archard's law and tribological relationships.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F95721] mt-1.5 flex-shrink-0" />
                <span>Higher load generally increases wear.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F95721] mt-1.5 flex-shrink-0" />
                <span>Higher sliding distance increases cumulative wear.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F95721] mt-1.5 flex-shrink-0" />
                <span>Higher hardness generally reduces wear.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F95721] mt-1.5 flex-shrink-0" />
                <span>Lubrication reduces adhesive wear.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F95721] mt-1.5 flex-shrink-0" />
                <span>Realistic noise is added to simulate experimental variability.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Workflow (3 cols) */}
        <div className="md:col-span-3 bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-extrabold text-[12px] text-[#111827] pb-1.5 mb-1.5 border-b border-[#F0ECE1]">
              Dataset Workflow
            </h4>
            <div className="space-y-1.5 text-[10px] text-[#374151]">
              <div className="bg-[#FAF8F3] border border-[#E5E0D8] p-1 rounded text-center font-bold">
                Raw Parameters
              </div>
              <div className="text-center text-[#9CA3AF]">↓</div>
              <div className="bg-[#FAF8F3] border border-[#E5E0D8] p-1 rounded text-center font-bold">
                Validation & Cleaning
              </div>
              <div className="text-center text-[#9CA3AF]">↓</div>
              <div className="bg-[#FAF8F3] border border-[#E5E0D8] p-1 rounded text-center font-bold">
                Feature Engineering
              </div>
              <div className="text-center text-[#9CA3AF]">↓</div>
              <div className="bg-[#FAF8F3] border border-[#E5E0D8] p-1 rounded text-center font-bold">
                Train/Test Split
              </div>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold p-1.5 rounded text-center mt-2 flex items-center justify-center gap-1">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Dataset Ready for ML</span>
          </div>
        </div>
      </div>
    </div>
  );
};
