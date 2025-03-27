import { useEffect, useState } from 'react'
import './App.css';
import { Button } from "@/components/ui/button";

type BalanceResponse = {
  jsonrpc: string;
  id: number;
  result: string;
}

type TransactionResponse = {
  jsonrpc: string;
  id: number;
  result?: string;
  error?: {
    code: number;
    message: string;
  };
}

type Balance = {
  wei: string;
  gwei: string;
  eth: string;
}

const ACCOUNTS = [
  "0x47c5d423684Fd66a33c70B464884D052e9c3eA93",
  "0x25e604dc2c1347d8a2998675152ac2803acacf23",
  "0x8c1f450809eb0c5cc1982db461aa9c64eb7c5d0b"
];

export default function Home() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [recipientBalance, setRecipientBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState(ACCOUNTS[0]);
  const [recipient, setRecipient] = useState(ACCOUNTS[1]);
  const [amount, setAmount] = useState("1");
  const [sending, setSending] = useState(false);

  const formatBalance = (wei: number): Balance => {
    return {
      wei: wei.toString(),
      gwei: (wei / 10**9).toString(),
      eth: (wei / 10**18).toString()
    };
  };

  const fetchBalanceForAddress = async (address: string): Promise<Balance> => {
    const response = await fetch('http://localhost:5556', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1
      })
    });

    const data: BalanceResponse = await response.json();
    const balanceInWei = parseInt(data.result, 16);
    return formatBalance(balanceInWei);
  };

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const address = selectedAccount.startsWith('0x') ? selectedAccount : `0x${selectedAccount}`;
      const recipientAddress = recipient.startsWith('0x') ? recipient : `0x${recipient}`;
      
      const [senderBalance, receiverBalance] = await Promise.all([
        fetchBalanceForAddress(address),
        fetchBalanceForAddress(recipientAddress)
      ]);

      setBalance(senderBalance);
      setRecipientBalance(receiverBalance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener el balance');
    } finally {
      setLoading(false);
    }
  };

  const sendTransaction = async () => {
    try {
      setSending(true);
      setError(null);

      const fromAddress = selectedAccount.startsWith('0x') ? selectedAccount : `0x${selectedAccount}`;
      const toAddress = recipient.startsWith('0x') ? recipient : `0x${recipient}`;
      const amountInWei = (parseFloat(amount) * 10**18).toString(16);

      const response = await fetch('http://localhost:5556', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_sendTransaction",
          params: [{
            from: fromAddress,
            to: toAddress,
            value: `0x${amountInWei}`,
            gas: "0x5208",
            gasPrice: "0x3b9aca00"
          }],
          id: 1
        })
      });

      const data: TransactionResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      // Esperar un momento para que la transacción se procese
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Actualizar los balances después de la transacción
      await fetchBalance();
      
      // Mostrar mensaje de éxito
      setError("Transacción enviada exitosamente!");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar la transacción');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [selectedAccount, recipient]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-svh bg-gray-800">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      <p className="mt-4 text-white">Cargando balance...</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-6 p-8 bg-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Balance de la Cuenta</h1>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Cuenta
          </label>
          <select 
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {ACCOUNTS.map((account) => (
              <option key={account} value={account}>
                {account.slice(0, 6)}...{account.slice(-4)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-sm text-gray-600">Balance en ETH</p>
            <p className="text-2xl font-bold text-gray-900">{balance?.eth} ETH</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-sm text-gray-600">Balance en Gwei</p>
            <p className="text-xl text-gray-900">{balance?.gwei} Gwei</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-sm text-gray-600">Balance en Wei</p>
            <p className="text-lg font-mono text-gray-900">{balance?.wei} Wei</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Enviar ETH</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Para
              </label>
              <select 
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {ACCOUNTS.filter(acc => acc !== selectedAccount).map((account) => (
                  <option key={account} value={account}>
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad (ETH)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.000000000000000001"
              />
            </div>

            {recipientBalance && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <p className="text-sm text-gray-600">Balance del Destinatario</p>
                <p className="text-xl font-bold text-gray-900">{recipientBalance.eth} ETH</p>
              </div>
            )}

            {error && (
              <div className={`p-3 rounded-md ${error.includes('exitosamente') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {error}
              </div>
            )}

            <Button 
              onClick={sendTransaction}
              disabled={sending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
            >
              {sending ? 'Enviando...' : 'Enviar ETH'}
            </Button>
          </div>
        </div>

        <Button 
          onClick={fetchBalance}
          className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Actualizar Balance
        </Button>
      </div>
    </div>
  );
}


