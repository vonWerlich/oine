import React, { useState } from 'react';
import './RouletteWheel.css';
import { Line } from 'react-chartjs-2'; // Import the chart type

// Import required Chart.js modules
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RouletteWheel = () => {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [balance, setBalance] = useState(1000); // Starting balance
  const [betAmount, setBetAmount] = useState(0);
  const [betOption, setBetOption] = useState('number'); // Default bet option
  const [betDetails, setBetDetails] = useState(null);
  const [balanceHistory, setBalanceHistory] = useState([1000]);
  const [betCount, setBetCount] = useState(0);

  const numbers = Array.from({ length: 37 }, (_, i) => i); // Numbers 0-36
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = numbers.filter(n => !redNumbers.includes(n) && n !== 0);

  

  const placeBet = () => {
    if (betDetails === null) {
      alert('Escolha uma opção válida')
      return;
    }
    if (betAmount > 0 && betAmount <= balance) {
      setBalance((prevBalance) => prevBalance - betAmount);
      setBalanceHistory((prevHistory) => [...prevHistory, balance]);
      setBetCount((count) => count + 1);
      //funcionando entre aspas
      spinWheel();
    } else {
      alert('Invalid bet. Make sure to enter a valid bet amount.');
    }
  };

  const spinWheel = () => {
    
    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * numbers.length);
    
    setTimeout(() => {
      const winningNumber = numbers[randomIndex];
      setSelectedNumber(winningNumber);
      setIsSpinning(false);

      setTimeout(() => {
        let winnings = 0;
      
        if (betOption === 'number' && betDetails === winningNumber) {
          winnings = betAmount * 35; // Standard payout for a single number
        } else if (betOption === 'redBlack') {
          if (betDetails === 'red' && redNumbers.includes(winningNumber)) {
            winnings = betAmount * 2;
          } else if (betDetails === 'black' && blackNumbers.includes(winningNumber)) {
            winnings = betAmount * 2;
          }
        } else if (betOption === 'evenOdd') {
          if (betDetails === 'even' && winningNumber % 2 === 0 && winningNumber !== 0) {
            winnings = betAmount * 2;
          } else if (betDetails === 'odd' && winningNumber % 2 !== 0 && winningNumber !== 0) {
            winnings = betAmount * 2;
          }
        } else if (betOption === 'lowHigh') {
          if (betDetails === 'low' && winningNumber >= 1 && winningNumber <= 18) {
            winnings = betAmount * 2;
          } else if (betDetails === 'high' && winningNumber >= 19 && winningNumber <= 36) {
            winnings = betAmount * 2;
          }
        } else if (betOption === 'dozen') {
          if (betDetails === 'dozen1' && winningNumber >= 1 && winningNumber <= 12) {
            winnings = betAmount * 3;
          } else if (betDetails === 'dozen2' && winningNumber >= 13 && winningNumber <= 24) {
            winnings = betAmount * 3;
          } else if (betDetails === 'dozen3' && winningNumber >= 25 && winningNumber <= 36) {
            winnings = betAmount * 3;
          }
        }

        if (winnings > 0) {
          setBalance((prevBalance) => prevBalance + winnings);
          alert(`Congratulations! You won ${winnings}!`);
        } else {
          alert('You lost this round. Better luck next time!');
        }
      }, 1000); // Delay before showing the result
    }, 3000); // Simulate a 3-second spin
  };

  const ChartComponent = () => {
    // Data to display on the chart
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May'], // X-axis labels
      datasets: [
        {
          label: 'My Dataset', // Legend label
          data: [10, 20, 30, 40, 50], // Y-axis values
          borderColor: 'rgba(75, 192, 192, 1)', // Line color
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color under the line
          borderWidth: 2, // Line thickness
        },
      ],
    };
  
    // Chart options for customization
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top', // Position of the legend
        },
        title: {
          display: true,
          text: 'Line Chart Example', // Title of the chart
        },
      },
    };
  
    return <Line data={data} options={options} />;
  };

  return (
    <div className="roulette-container">
      <div className={`wheel ${isSpinning ? 'spinning' : ''}`}>
        {numbers.map((num) => (
          <div key={num} className="wheel-number">{num}</div>
        ))}
      </div>
      <div className="betting-panel">
        <h2>Place Your Bet</h2>
        <select onChange={(e) => setBetOption(e.target.value)} disabled={isSpinning}>
          <option value="number">Single Number (36:1)</option>
          <option value="redBlack">Red/Black (1:1)</option>
          <option value="evenOdd">Even/Odd (1:1)</option>
          <option value="lowHigh">1-18 / 19-36 (1:1)</option>
          <option value="dozen">1-12, 13-24, 25-36 (2:1)</option>
        </select>
        {betOption === 'number' && (
          <input
            type="number"
            placeholder="Bet on Number (0-36)"
            value={betDetails}
            onChange={(e) => setBetDetails(parseInt(e.target.value, 10) || 0)}
            min="0"
            max="36"
          />
        )}
        {(betOption === 'redBlack' || betOption === 'evenOdd' || betOption === 'lowHigh' || betOption === 'dozen') && (
          <select onChange={(e) => setBetDetails(e.target.value)} disabled={isSpinning}>
            {betOption === 'redBlack' && (
              <>
                <option value="">Choose an option</option>
                <option value="red">Red</option>
                <option value="black">Black</option>
              </>
            )}
            {betOption === 'evenOdd' && (
              <>

                <option value="">Choose an option</option>
                <option value="even">Even</option>
                <option value="odd">Odd</option>
              </>
            )}
            {betOption === 'lowHigh' && (
              <>
                <option value="">Choose an option</option>
                <option value="low">1-18</option>
                <option value="high">19-36</option>
              </>
            )}
            {betOption === 'dozen' && (
              <>
                <option value="">Choose an option</option>
                <option value="dozen1">1-12</option>
                <option value="dozen2">13-24</option>
                <option value="dozen3">25-36</option>
              </>
            )}
          </select>
        )}
        <input
          type="number"
          placeholder="Bet Amount"
          value={betAmount}
          onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
        />
        <button onClick={placeBet} disabled={isSpinning || betAmount <= 0}>
          {isSpinning ? 'Spinning...' : 'Place Bet & Spin'}
        </button>
      </div>
      <div className="balance-info">
        <h3>Balance: ${balance}</h3>
      </div>
      {selectedNumber !== null && (
        <div className="result">
          The winning number is: <strong>{selectedNumber}</strong>
        </div>
      )}
      <div>
        <ChartComponent />
      </div>
    </div>
  );
};

export default RouletteWheel;
