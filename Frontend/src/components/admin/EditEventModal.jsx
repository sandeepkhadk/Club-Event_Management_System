import React, { useState } from 'react';

const EditEventModal = ({ event, onClose, onSave }) => {
  const [editData, setEditData] = useState({ ...event });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h3 className="font-bold mb-4">Edit Event</h3>
        <input className="w-full border p-2 mb-3" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
        <button onClick={() => onSave(editData)} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </div>
    </div>
  );
};

export default EditEventModal;
