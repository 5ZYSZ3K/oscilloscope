import './App.css';
import {VictoryChart} from 'victory-chart'
import {VictoryTheme, VictoryLine, VictoryAxis, VictoryLabel} from 'victory'
import { useEffect, useState } from 'react';

const mapEventDataToVoltage = (data: string): number => {
  return (Number(data) - 915) / 1024 * 3.3; 
}

const App: React.FC = () => {
  const [data, setData] = useState<Array<number>>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.1.10:2137/ws");
    ws.onopen = (event) => {
      console.log('opened');
    };
    ws.onmessage = (event) => {
      if(typeof event.data !== 'string') return;
      setData((currentData) => {
        if(currentData.length < 200) {
          return [...currentData, mapEventDataToVoltage(event.data)];
        }
        currentData.shift();
        return [...currentData, mapEventDataToVoltage(event.data)];
      });
    }
  }, []);

  return (
    <div className="App">
      <div className="test">
        <div className="victory">
          <VictoryChart
            width={600} 
            height={470} 
            domain={{x: [0, 200], y: [-1, 1]}}
            padding={{left: 100, bottom: 100, top: 50, right: 50}}
          >
            <VictoryLine
              style={{
                data: { stroke: "yellow" },
                parent: { border: "1px solid #ccc"}
              }}
              data={data}
            />
            <VictoryAxis 
              dependentAxis 
              axisLabelComponent={<VictoryLabel dy={-30} />}
              style={{tickLabels: {fill: '#994'}, axis: {stroke: '#994'}, axisLabel: {fill: '#994'}}}
              label="Napięcie [V]"
            />
            <VictoryAxis style={{tickLabels: {fill: '#994'}, axis: {stroke: '#994'}}} />
          </VictoryChart>
        </div>
      </div>
    </div>
  );
}

export default App;
