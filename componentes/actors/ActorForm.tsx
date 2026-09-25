'use client';

import { useState } from 'react';
import { ActorInput } from '@/hooks/useActors';
import styles from '../ui/styles.module.css';

interface ActorFormProps {
  initialValues?: ActorInput;
  submitLabel: string;
  onSubmit: (data: ActorInput) => Promise<void>;
  onCancel: () => void;
}

const EMPTY_ACTOR: ActorInput = {
  name: '', photo: '', nationality: '', birthDate: '', biography: '',
};

export function ActorForm({ initialValues = EMPTY_ACTOR, submitLabel, onSubmit, onCancel }: ActorFormProps) {
  const [form, setForm] = useState<ActorInput>(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al guardar');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.errorBox}>{error}</p>}

      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>Nombre</label>
        <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required className={styles.input} />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="nationality" className={styles.label}>Nacionalidad</label>
          <input id="nationality" name="nationality" type="text" value={form.nationality} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="birthDate" className={styles.label}>Fecha de nacimiento</label>
          <input id="birthDate" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} required className={styles.input} />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="photo" className={styles.label}>URL de la foto</label>
        <input
          id="photo" name="photo" type="url" value={form.photo} onChange={handleChange} required
          placeholder="https://…" className={styles.input}
        />
        <span className={styles.hint}>Debe ser un enlace directo a una imagen.</span>
        {form.photo && (
          <img src={form.photo} alt="Vista previa de la foto" className={styles.preview} />
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="biography" className={styles.label}>Biografía</label>
        <textarea id="biography" name="biography" value={form.biography} onChange={handleChange} required className={styles.input} />
      </div>

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={`${styles.button} ${styles.secondary}`}>Cancelar</button>
        <button type="submit" disabled={saving} className={`${styles.button} ${styles.primary}`}>
          {saving ? 'Guardando…' : submitLabel}
        </button>
      </div>
    </form>
  );
}