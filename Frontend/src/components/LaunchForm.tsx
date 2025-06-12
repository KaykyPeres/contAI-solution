import { useState } from 'react';
import axios from 'axios';

interface LaunchFormProps {
  onLaunchAdded: () => void;
}

export function LaunchForm({ onLaunchAdded }: LaunchFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'Crédito' | 'Débito'>('Débito');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 
    if (!description || !amount || !date) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    try {
      await axios.post('http://localhost:3001/launches', {
        description,
        amount,
        date,
        type,
      });

      setDescription('');
      setAmount('');
      setDate('');
      setType('Débito');
      setError('');

      onLaunchAdded();

    } catch (err) {
      console.error("Erro ao criar lançamento:", err);
      setError('Não foi possível criar o lançamento. Verifique os dados.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="launch-form">
      <h2>Novo Lançamento</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value as 'Crédito' | 'Débito')}>
        <option value="Débito">Débito</option>
        <option value="Crédito">Crédito</option>
      </select>
      <button type="submit">Adicionar Lançamento</button>
    </form>
  );
}