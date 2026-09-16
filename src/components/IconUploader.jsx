import { useRef, useState } from "react";
import { saveMachineIcon, removeMachineIcon } from "../lib/machineIcons";

export default function IconUploader({ machineId, currentIcon, onChanged }) {
  const fileRef = useRef(null);
  const [saving, setSaving] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      await saveMachineIcon(machineId, file);
      onChanged();
    } finally {
      setSaving(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleRemove() {
    setSaving(true);
    try {
      await removeMachineIcon(machineId);
      onChanged();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="icon-uploader">
      <div className="icon-uploader-preview">
        {currentIcon ? <img src={currentIcon} alt="" /> : <span className="icon-uploader-empty">sem foto</span>}
      </div>
      <div className="icon-uploader-actions">
        <label className="icon-uploader-button">
          {saving ? "Enviando…" : currentIcon ? "Trocar foto" : "Enviar foto"}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} hidden disabled={saving} />
        </label>
        {currentIcon && (
          <button type="button" className="icon-uploader-remove" onClick={handleRemove} disabled={saving}>
            Remover
          </button>
        )}
      </div>
    </div>
  );
}
