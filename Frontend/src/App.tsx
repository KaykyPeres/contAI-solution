import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { LaunchForm } from './components/LaunchForm';

export interface Launch {
  id: number;
  description: string;
  amount: string;
  type: 'Crédito' | 'Débito';
  date: string;
}

function App() {
  const [rawData, setRawData] = useState<Launch[]>([]);
  const [isFilterActive, setFilterActivate] = useState(false);
  const [filteredLaunches, setFilteredLaunches] = useState<Launch[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [summary, setSummary] = useState({ total_creditos: 0, total_debitos: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [editingLaunch, setEditingLaunch] = useState<Launch | null>(null);


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/launches');
      setRawData(response.data);
      setFilteredLaunches(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    sumarizeLaunch();
  }, [rawData, filteredLaunches]);

  useEffect(() => {
    filterMonthAndYear();
  }, [selectedMonth, selectedYear]);


  const filterMonthAndYear = () => {
    const filtered = rawData.filter(({ date }) => {
      const dataObjeto = new Date(date);
      const ano = dataObjeto.getUTCFullYear();
      const mes = dataObjeto.getUTCMonth() + 1;
      return ano === selectedYear && mes === selectedMonth;
    });

    setFilteredLaunches(filtered);
    setFilterActivate(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja deletar este lançamento?")) {
      try {
        await axios.delete(`http://localhost:3001/launches/${id}`);
        fetchData();
      } catch (error) {
        console.error("Erro ao deletar lançamento:", error);
        alert("Não foi possível deletar o lançamento.");
      }
    }
  };

  const handleEdit = (launch: Launch) => {
    setEditingLaunch(launch);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleActionCompleted = () => {
    setEditingLaunch(null);
    fetchData();
  };

  const formatCurrency = (value: number) => {
    const num = value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(isNaN(num) ? 0 : num);
  };

  const calculateBalance = () => {
    const creditos = summary.total_creditos || 0;
    const debitos = summary.total_debitos || 0;
    return creditos - debitos;
  };

  const sortedLaunches = [...filteredLaunches].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const sumarizeLaunch = () => {
    let sumCredit = 0;
    let sumDebit = 0;
    if (filteredLaunches.length !== 0) {
      const credit = filteredLaunches.filter(({ type }) => type == 'Crédito');
      const debit = filteredLaunches.filter(({ type }) => type == 'Débito');
      credit.forEach(({ amount }) => {
        sumCredit += Number(amount);
      });

      debit.forEach(({ amount }) => {
        sumDebit += Number(amount);
      });

      setSummary({ total_creditos: sumCredit, total_debitos: sumDebit });
    } else {
      setSummary({ total_creditos: sumCredit, total_debitos: sumDebit });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-2 md:p-4">
      <div className="w-full space-y-4 md:space-y-6">

        {/* Header */}
        <header className="bg-gray-800/95 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-xl border border-gray-700/30 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3 flex items-center justify-center gap-2 md:gap-4">
            <span className="text-3xl md:text-4xl lg:text-5xl">💰</span>
            ContAI - Lançamentos Contábeis
          </h1>
          <p className="text-gray-300 text-base md:text-lg">Gerencie seus lançamentos de forma inteligente</p>
        </header>

        {/* Filtros */}
        <section className="bg-gray-800/95 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-700/30">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
            🔍 Filtros
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="flex flex-col space-y-2 flex-1 min-w-[150px]">
              <label htmlFor="year-select" className="text-sm font-medium text-gray-300">
                Ano:
              </label>
              <select
                id="year-select"
                className="px-3 md:px-4 py-2 md:py-3 border-2 border-gray-600 rounded-xl bg-gray-700 text-white font-medium focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all cursor-pointer hover:border-gray-500 w-full"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {[0, 1, 2, 3, 4].map(offset => {
                  const year = new Date().getFullYear() - offset;
                  return <option key={year} value={year} className="bg-gray-700">{year}</option>;
                })}
              </select>
            </div>

            <div className="flex flex-col space-y-2 flex-1 min-w-[150px]">
              <label htmlFor="month-select" className="text-sm font-medium text-gray-300">
                Mês:
              </label>
              <select
                id="month-select"
                className="px-3 md:px-4 py-2 md:py-3 border-2 border-gray-600 rounded-xl bg-gray-700 text-white font-medium focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all cursor-pointer hover:border-gray-500 w-full"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month} className="bg-gray-700">
                    {new Date(0, month - 1).toLocaleString('pt-BR', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-2 flex-1 min-w-[150px]">
              <label htmlFor="month-select" className="text-sm font-medium text-gray-300 opacity-0 pointer-events-none">
                Ação:
              </label>
              <button
                onClick={() => { setFilteredLaunches(rawData); setFilterActivate(false) }}
                className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border border-purple-500/20 focus:ring-4 focus:ring-purple-400/20 focus:outline-none justify-center h-[44px] md:h-[52px]"
                title="Limpar todos os filtros e mostrar todos os lançamentos"
              >
                <span className="text-sm md:text-base">🔄</span>
                <span className="text-sm md:text-base font-semibold">Limpar Filtros</span>
              </button>
            </div>
          </div>
        </section>

        {/* Formulário */}
        <section className="bg-gray-800/95 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-700/30">
          <LaunchForm
            onActionCompleted={handleActionCompleted}
            launchToEdit={editingLaunch}
            onEditCancel={() => setEditingLaunch(null)}
          />
        </section>

        {/* Resumo Financeiro */}
        <section className="bg-gray-800/95 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-700/30">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 flex items-center gap-2">
            📊 Resumo Financeiro
            {isFilterActive && (
              <> - {new Date(0, selectedMonth - 1).toLocaleString('pt-BR', { month: 'long' })} {selectedYear}</>
            )}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 md:p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border border-green-500/20">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-3xl md:text-4xl opacity-90">📈</div>
                <div>
                  <h3 className="text-xs md:text-sm font-medium opacity-90 mb-1">Total de Créditos</h3>
                  <p className="text-xl md:text-2xl font-bold">{formatCurrency(summary.total_creditos)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-4 md:p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border border-red-500/20">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-3xl md:text-4xl opacity-90">📉</div>
                <div>
                  <h3 className="text-xs md:text-sm font-medium opacity-90 mb-1">Total de Débitos</h3>
                  <p className="text-xl md:text-2xl font-bold">{formatCurrency(summary.total_debitos)}</p>
                </div>
              </div>
            </div>

            <div className={`${calculateBalance() >= 0
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500/20'
              : 'bg-gradient-to-r from-orange-600 to-orange-700 border-orange-500/20'
              } rounded-xl p-4 md:p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border`}>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-3xl md:text-4xl opacity-90">{calculateBalance() >= 0 ? '✅' : '⚠️'}</div>
                <div>
                  <h3 className="text-xs md:text-sm font-medium opacity-90 mb-1">Saldo do Mês</h3>
                  <p className="text-xl md:text-2xl font-bold">{formatCurrency(calculateBalance())}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabela de Lançamentos */}
        <section className="bg-gray-800/95 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-700/30">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 flex items-center gap-2 flex-wrap">
            📋 Lançamentos do Período
            {/* AGORA USAMOS sortedLaunches, que é baseado na lista já filtrada */}
            <span className="text-sm font-normal text-gray-400">
              ({sortedLaunches.length} registro{sortedLaunches.length !== 1 ? 's' : ''})
            </span>
          </h2>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-16 text-gray-300">
              <div className="w-8 h-8 md:w-10 md:h-10 border-3 border-gray-600 border-t-blue-400 rounded-full animate-spin mb-4"></div>
              <p className="text-sm md:text-base">Carregando lançamentos...</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-600">
              <table className="w-full bg-gray-900 min-w-[600px]">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                    <th className="px-3 md:px-4 py-3 md:py-4 text-left font-semibold text-xs md:text-sm tracking-wide">Data</th>
                    <th className="px-3 md:px-4 py-3 md:py-4 text-left font-semibold text-xs md:text-sm tracking-wide">Descrição</th>
                    <th className="px-3 md:px-4 py-3 md:py-4 text-left font-semibold text-xs md:text-sm tracking-wide">Valor</th>
                    <th className="px-3 md:px-4 py-3 md:py-4 text-left font-semibold text-xs md:text-sm tracking-wide">Tipo</th>
                    <th className="px-3 md:px-4 py-3 md:py-4 text-left font-semibold text-xs md:text-sm tracking-wide">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLaunches.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 md:py-16 px-4 md:px-6">
                        <div className="text-center text-gray-400">
                          <div className="text-4xl md:text-6xl mb-4 opacity-70">📝</div>
                          <p className="text-base md:text-lg text-gray-300 mb-2">Nenhum lançamento encontrado para este período.</p>
                          <p className="text-xs md:text-sm text-gray-500">Adicione um novo lançamento usando o formulário acima.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedLaunches.map((launch) => (
                      <tr key={launch.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                        <td className="px-3 md:px-4 py-3 md:py-4 font-mono font-medium text-gray-300 text-xs md:text-sm whitespace-nowrap">
                          {new Date(launch.date).toLocaleDateString('pt-BR', {
                            timeZone: 'UTC',
                          })}
                        </td>
                        <td className="px-3 md:px-4 py-3 md:py-4 text-gray-200 font-medium text-xs md:text-sm break-words max-w-[200px] md:max-w-xs">
                          {launch.description}
                        </td>
                        <td className={`px-3 md:px-4 py-3 md:py-4 font-mono font-semibold text-sm md:text-lg whitespace-nowrap ${launch.type === 'Crédito' ? 'text-green-400' : 'text-red-400'
                          }`}>
                          {formatCurrency(Number(launch.amount))}
                        </td>
                        <td className="px-3 md:px-4 py-3 md:py-4">
                          <span className={`inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-full text-xs font-medium ${launch.type === 'Crédito'
                            ? 'bg-green-900/50 text-green-300 border border-green-700/50'
                            : 'bg-red-900/50 text-red-300 border border-red-700/50'
                            }`}>
                            <span className="text-xs">{launch.type === 'Crédito' ? '📈' : '📉'}</span>
                            <span className="hidden sm:inline">{launch.type}</span>
                          </span>
                        </td>
                        <td className="px-3 md:px-4 py-3 md:py-4">
                          <div className="flex flex-col lg:flex-row gap-1 md:gap-2 min-w-[120px]">
                            <button
                              className="inline-flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 bg-blue-900/50 text-blue-300 rounded-lg hover:bg-blue-800/50 transition-colors text-xs font-medium border border-blue-700/50"
                              onClick={() => handleEdit(launch)}
                              title="Editar lançamento"
                            >
                              <span>✏️</span>
                              <span className="hidden sm:inline">Editar</span>
                            </button>
                            <button
                              className="inline-flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 bg-red-900/50 text-red-300 rounded-lg hover:bg-red-800/50 transition-colors text-xs font-medium border border-red-700/50"
                              onClick={() => handleDelete(launch.id)}
                              title="Deletar lançamento"
                            >
                              <span>🗑️</span>
                              <span className="hidden sm:inline">Deletar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;