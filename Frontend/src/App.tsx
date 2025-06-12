import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { LaunchForm } from './components/LaunchForm';

interface Launch {
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
      setIsLoading(false); // <-- E AQUI TAMBÉM
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

  return (
    <div>
      <h1>Lançamentos Contábeis - ContAI</h1>

      <div className="filters">
        {/* ... seus selects de filtro ... */}
      </div>

      <LaunchForm onLaunchAdded={fetchData} />
      <hr />

      <div className="summary">
        {/* ... sua seção de resumo ... */}
      </div>

      <h2>Registros</h2>

      {/* RENDERIZAÇÃO CONDICIONAL AQUI */}
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
            {/* MENSAGEM DE TABELA VAZIA AQUI */}
            {launches.length === 0 && (
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
                <td className={launch.type === 'Crédito' ? 'credito' : 'debito'}>
                  {launch.type}
                </td>
                <td>{new Date(launch.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                <td>
                  <button onClick={() => handleDelete(launch.id)}>Deletar</button>
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