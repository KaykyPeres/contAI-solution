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
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [summary, setSummary] = useState({ total_creditos: '0', total_debitos: '0' });
  const [isLoading, setIsLoading] = useState(false);

  const [editingLaunch, setEditingLaunch] = useState<Launch | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    if (!selectedYear || !selectedMonth) {
      setIsLoading(false);
      return;
    }
    try {
      const [launchesResponse, summaryResponse] = await Promise.all([
        axios.get(`http://localhost:3001/launches/by-month`, {
          params: { year: selectedYear, month: selectedMonth }
        }),
        axios.get(`http://localhost:3001/launches/summary`, {
          params: { year: selectedYear, month: selectedMonth }
        })
      ]);
      setLaunches(launchesResponse.data);
      setSummary(summaryResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

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
  }

  return (
    <div>
      <h1>Lançamentos Contábeis - ContAI</h1>

      <div className="filters">
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
          {[0, 1, 2, 3, 4].map(offset => {
            const year = new Date().getFullYear() - offset;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
            <option key={month} value={month}>{new Date(0, month - 1).toLocaleString('pt-BR', { month: 'long' })}</option>
          ))}
        </select>
      </div>

      <LaunchForm
        onActionCompleted={handleActionCompleted}
        launchToEdit={editingLaunch}
        onEditCancel={() => setEditingLaunch(null)}
      />

      <hr />
      <div className="summary">
        <h3>Resumo do Mês Selecionado</h3>
        <p>Total de Créditos: <span className="credito">R$ {summary.total_creditos || '0.00'}</span></p>
        <p>Total de Débitos: <span className="debito">R$ {summary.total_debitos || '0.00'}</span></p>
      </div>

      <h2>Registros</h2>
      {isLoading ? (
        <p>Carregando dados...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {launches.length === 0 && !isLoading && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>
                  Nenhum lançamento encontrado para este período.
                </td>
              </tr>
            )}
            {launches.map((launch) => (
              <tr key={launch.id}>
                <td>{launch.description}</td>
                <td>R$ {launch.amount}</td>
                <td className={launch.type === 'Crédito' ? 'credito' : 'debito'}>{launch.type}</td>
                <td>{new Date(launch.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(launch)}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDelete(launch.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;