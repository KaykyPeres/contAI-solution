import { useState, useEffect } from 'react';
import axios from 'axios';

interface Launch {
    id: number;
    description: string;
    amount: string;
    type: 'Crédito' | 'Débito';
    date: string;
}

interface LaunchFormProps {
    onActionCompleted: () => void;
    launchToEdit: Launch | null;
    onEditCancel: () => void;
}

export function LaunchForm({ onActionCompleted, launchToEdit, onEditCancel }: LaunchFormProps) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<'Crédito' | 'Débito'>('Débito');
    const [error, setError] = useState('');

    useEffect(() => {
        if (launchToEdit) {
            setDescription(launchToEdit.description);
            setAmount(launchToEdit.amount);
            setDate(new Date(launchToEdit.date).toISOString().split('T')[0]);
            setType(launchToEdit.type);
        } else {
            setDescription('');
            setAmount('');
            setDate('');
            setType('Débito');
            setError('');
        }
    }, [launchToEdit]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!description || !amount || !date) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        const launchData = { description, amount, date, type };

        try {
            if (launchToEdit) {
                await axios.put(`http://localhost:3001/launches/${launchToEdit.id}`, launchData);
            } else {
                await axios.post('http://localhost:3001/launches', launchData);
            }

            setError('');
            onActionCompleted();

        } catch (err) {
            console.error("Erro ao salvar lançamento:", err);
            setError('Não foi possível salvar o lançamento. Verifique os dados.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="launch-form">
            <h2>{launchToEdit ? 'Editar Lançamento' : 'Novo Lançamento'}</h2>
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

            <button type="submit">{launchToEdit ? 'Salvar Alterações' : 'Adicionar Lançamento'}</button>

            {launchToEdit && (
                <button type="button" onClick={onEditCancel} className="cancel-btn">
                    Cancelar Edição
                </button>
            )}
        </form>
    );
}