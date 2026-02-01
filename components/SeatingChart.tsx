import React, { useState } from 'react';
import { Guest, Table, GuestSide, TableShape } from '../types';
import { Plus, Trash2, Users, GripVertical, Armchair, Circle, Square, RectangleHorizontal } from 'lucide-react';

interface SeatingChartProps {
  guests: Guest[];
  tables: Table[];
  onAddTable: (table: Table) => void;
  onRemoveTable: (tableId: string) => void;
  onAssignGuest: (guestId: string, tableId: string, seatIndex: number) => void;
  onUnassignGuest: (guestId: string) => void;
}

export const SeatingChart: React.FC<SeatingChartProps> = ({ 
  guests, 
  tables, 
  onAddTable, 
  onRemoveTable, 
  onAssignGuest, 
  onUnassignGuest 
}) => {
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState('8');
  const [newTableShape, setNewTableShape] = useState<TableShape>(TableShape.ROUND);
  const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null);

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;

    const newTable: Table = {
      id: crypto.randomUUID(),
      name: newTableName,
      capacity: parseInt(newTableCapacity) || 8,
      shape: newTableShape
    };

    onAddTable(newTable);
    setNewTableName('');
  };

  const handleDragStart = (e: React.DragEvent, guestId: string) => {
    setDraggedGuestId(guestId);
    e.dataTransfer.setData('guestId', guestId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, tableId: string, seatIndex: number) => {
    e.preventDefault();
    const guestId = e.dataTransfer.getData('guestId');
    if (guestId) {
      onAssignGuest(guestId, tableId, seatIndex);
    }
    setDraggedGuestId(null);
  };

  // Filter unseated guests
  const unseatedGuests = guests.filter(g => !g.assignedTableId);

  // Helper to calculate seat position based on Shape
  const getSeatPosition = (index: number, total: number, shape: TableShape) => {
    // Basic angle for distribution
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top (-90deg)

    if (shape === TableShape.ROUND) {
      const radius = 65; // Distance from center
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      return { x, y };
    } 
    
    // For Square and Rectangle, we project the angle onto a box
    // Width and Height of the "virtual" box for seat placement (slightly larger than the visual table)
    let width = 0;
    let height = 0;

    if (shape === TableShape.SQUARE) {
        width = 75; 
        height = 75;
    } else { // RECTANGLE
        width = 110; // Wider
        height = 60;
    }

    // Ray casting from center to box edge
    // tan(theta) = y / x
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    // Distance to vertical edge (x = +/- width)
    const tx = Math.abs(width / cos);
    // Distance to horizontal edge (y = +/- height)
    const ty = Math.abs(height / sin);

    // The intersection is the minimum distance
    const t = Math.min(tx, ty);

    return {
        x: t * cos,
        y: t * sin
    };
  };

  const getTableDimensions = (shape: TableShape) => {
      switch (shape) {
          case TableShape.ROUND: return 'w-32 h-32 rounded-full';
          case TableShape.SQUARE: return 'w-32 h-32 rounded-xl';
          case TableShape.RECTANGLE: return 'w-48 h-24 rounded-lg';
          default: return 'w-32 h-32 rounded-full';
      }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
      
      {/* Sidebar: Unseated Guests & Add Table */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        
        {/* Add Table Form */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Plus size={18} className="text-rose-500" />
            Nova Mesa
          </h3>
          <form onSubmit={handleAddTable} className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 font-medium">Nome da Mesa</label>
              <input
                type="text"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                placeholder="Ex: Mesa Família"
                className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
                <div className="flex-1">
                    <label className="text-xs text-slate-500 font-medium">Lugares</label>
                    <select 
                        value={newTableCapacity}
                        onChange={(e) => setNewTableCapacity(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    >
                        {[2, 4, 6, 8, 10, 12, 14, 16].map(num => (
                        <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                     <label className="text-xs text-slate-500 font-medium">Formato</label>
                     <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                        <button
                            type="button"
                            onClick={() => setNewTableShape(TableShape.ROUND)}
                            className={`flex-1 flex justify-center py-1.5 rounded transition-colors ${newTableShape === TableShape.ROUND ? 'bg-white shadow-sm text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Redonda"
                        >
                            <Circle size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setNewTableShape(TableShape.SQUARE)}
                            className={`flex-1 flex justify-center py-1.5 rounded transition-colors ${newTableShape === TableShape.SQUARE ? 'bg-white shadow-sm text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Quadrada"
                        >
                            <Square size={16} />
                        </button>
                         <button
                            type="button"
                            onClick={() => setNewTableShape(TableShape.RECTANGLE)}
                            className={`flex-1 flex justify-center py-1.5 rounded transition-colors ${newTableShape === TableShape.RECTANGLE ? 'bg-white shadow-sm text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Retangular"
                        >
                            <RectangleHorizontal size={16} />
                        </button>
                     </div>
                </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Adicionar Mesa
            </button>
          </form>
        </div>

        {/* Unseated List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-700 flex justify-between items-center text-sm">
              <span>Sem Assento</span>
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{unseatedGuests.length}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Arraste para as mesas ao lado</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {unseatedGuests.map(guest => (
              <div
                key={guest.id}
                draggable
                onDragStart={(e) => handleDragStart(e, guest.id)}
                className={`p-3 rounded-lg border border-slate-200 bg-white shadow-sm cursor-grab active:cursor-grabbing flex items-center gap-2 hover:border-rose-300 transition-colors ${
                  guest.side === GuestSide.BRIDE ? 'border-l-4 border-l-rose-400' : 'border-l-4 border-l-blue-400'
                }`}
              >
                <GripVertical size={16} className="text-slate-300" />
                <span className="text-sm font-medium text-slate-700 truncate">{guest.name}</span>
              </div>
            ))}
            {unseatedGuests.length === 0 && (
              <div className="text-center p-4 text-slate-400 text-sm italic">
                Todos os convidados sentados! 🎉
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Area: Tables Grid */}
      <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 overflow-y-auto p-8">
        {tables.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Armchair size={48} className="mb-4 opacity-50" />
            <p>Nenhuma mesa criada.</p>
            <p className="text-sm">Use o painel lateral para adicionar mesas.</p>
          </div>
        ) : (
          <div className="flex flex-wrap content-start items-start justify-center gap-20 pb-20">
            {tables.map(table => {
              // Find guests sitting at this table
              const tableGuests = guests.filter(g => g.assignedTableId === table.id);
              
              return (
                <div key={table.id} className="relative w-64 h-64 flex items-center justify-center">
                  {/* The Table Shape */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-4 border-rose-100 shadow-md flex flex-col items-center justify-center z-10 transition-all ${getTableDimensions(table.shape)}`}>
                    <span className="font-bold text-slate-700 text-center px-2 text-sm leading-tight">{table.name}</span>
                    <span className="text-xs text-slate-400 mt-1">{tableGuests.length}/{table.capacity}</span>
                    <button 
                      onClick={() => onRemoveTable(table.id)}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-500 p-1.5 rounded-full hover:bg-red-200 transition-colors z-20"
                      title="Remover Mesa"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* The Seats */}
                  {Array.from({ length: table.capacity }).map((_, index) => {
                    const assignedGuest = tableGuests.find(g => g.assignedSeatIndex === index);
                    const { x, y } = getSeatPosition(index, table.capacity, table.shape); 

                    return (
                      <div
                        key={index}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, table.id, index)}
                        className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm transform -translate-x-1/2 -translate-y-1/2 ${
                          assignedGuest 
                            ? (assignedGuest.side === GuestSide.BRIDE ? 'bg-rose-100 border-2 border-rose-300' : 'bg-blue-100 border-2 border-blue-300')
                            : 'bg-white border border-slate-300 border-dashed hover:border-slate-400'
                        }`}
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                        }}
                      >
                         {assignedGuest ? (
                           <div className="group relative w-full h-full flex items-center justify-center cursor-pointer" onClick={() => onUnassignGuest(assignedGuest.id)}>
                             <span className="text-xs font-bold text-slate-700 truncate max-w-[40px] px-0.5 text-center select-none" title={assignedGuest.name}>
                               {assignedGuest.name.split(' ')[0].substring(0, 4)}
                             </span>
                             {/* Hover X to remove */}
                             <div className="absolute inset-0 bg-red-500/80 rounded-full items-center justify-center text-white hidden group-hover:flex">
                               <Users size={14} />
                             </div>
                           </div>
                         ) : (
                           <span className="text-slate-300 text-[10px] select-none">{index + 1}</span>
                         )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};