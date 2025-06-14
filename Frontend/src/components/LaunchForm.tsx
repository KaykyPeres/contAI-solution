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
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        setIsSubmitting(true);
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
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 flex items-center gap-2">
                {launchToEdit ? (
                    <>
                        <span className="text-xl md:text-2xl">✏️</span>
                        Editar Lançamento
                    </>
                ) : (
                    <>
                        <span className="text-xl md:text-2xl">➕</span>
                        Novo Lançamento
                    </>
                )}
            </h2>

            {error && (
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-900/50 border border-red-700/50 rounded-xl text-red-300 text-sm md:text-base backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        {error}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {/* Descrição */}
                    <div className="lg:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                            Descrição *
                        </label>
                        <input
                            id="description"
                            type="text"
                            placeholder="Ex: Pagamento de fornecedor, Recebimento de cliente..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all hover:border-gray-500 text-sm md:text-base"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Valor */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                            Valor (R$) *
                        </label>
                        <input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0,00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all hover:border-gray-500 text-sm md:text-base font-mono"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Tipo */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
                            Tipo *
                        </label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value as 'Crédito' | 'Débito')}
                            className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-600 rounded-xl bg-gray-700 text-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all cursor-pointer hover:border-gray-500 text-sm md:text-base"
                            disabled={isSubmitting}
                        >
                            <option value="Débito" className="bg-gray-700">📉 Débito</option>
                            <option value="Crédito" className="bg-gray-700">📈 Crédito</option>
                        </select>
                    </div>

                    {/* Data */}
                    <div className="lg:col-span-2">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                            Data *
                        </label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-600 rounded-xl bg-gray-700 text-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all hover:border-gray-500 text-sm md:text-base font-mono"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                {/* Botões */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                            launchToEdit
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border border-blue-500/30 hover:shadow-blue-500/25'
                                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border border-green-500/30 hover:shadow-green-500/25'
                        } ${isSubmitting ? 'opacity-75 cursor-not-allowed transform-none' : 'hover:shadow-xl'}`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Salvando...</span>
                            </>
                        ) : launchToEdit ? (
                            <>
                                <span className="text-lg md:text-xl">💾</span>
                                <span>Salvar Alterações</span>
                            </>
                        ) : (
                            <>
                                <span className="text-lg md:text-xl">➕</span>
                                <span>Adicionar Lançamento</span>
                            </>
                        )}
                    </button>

                    {launchToEdit && (
                        <button
                            type="button"
                            onClick={onEditCancel}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold text-sm md:text-base transition-all transform hover:scale-105 active:scale-95 shadow-lg border border-gray-500/30 hover:shadow-xl hover:shadow-gray-500/25 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <span className="text-lg md:text-xl">❌</span>
                            <span>Cancelar Edição</span>
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}