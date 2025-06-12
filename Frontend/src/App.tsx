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
  const fetchLaunches = async () => {
    try {
      const response = await axios.get('http://localhost:3001/launches');
      setLaunches(response.data);
    } catch (error) {
      console.error("Erro ao buscar lançamentos:", error);
    }
  };

  useEffect(() => {
    fetchLaunches(); 
  }, []);

  return (
    <div>
      <h1>Lançamentos Contábeis - ContAI</h1>

      <LaunchForm onLaunchAdded={fetchLaunches} />

      <hr />

      <h2>Registros</h2>
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {launches.map((launch) => (
            <tr key={launch.id}>
              <td>{launch.description}</td>
              <td>R$ {launch.amount}</td>
              <td className={launch.type === 'Crédito' ? 'credito' : 'debito'}>
                {launch.type}
              </td>
              <td>{new Date(launch.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;