// Tab navigation
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
    
    // Plot SP chart when SP tab is opened
    if(btn.dataset.target === 'sp' && !spChart){
      setTimeout(()=>plotSPData(), 100);
    }
    
    // Plot AM chart when AM tab is opened
    if(btn.dataset.target === 'am' && !amChart){
      setTimeout(()=>plotAMComparison('time'), 100);
    }
  })
});

// Chart handling
let pfChart = null;
let spChart = null;
let amChart = null;
let lruData = null;
let mruData = null;

// Default LRU and MRU data
const defaultLRU = {
  mix: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
  logicalRead: [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000],
  logicalWrite: [0,0,0,0,0,0,0,0,0,0,0],
  physicalRead: [1812,1798,1791,1802,1790,1794,1775,1823,1794,1812,1790],
  physicalWrite: [0,202,413,545,700,946,1092,1295,1457,1633,1770],
  pageHit: [188,202,209,198,210,206,225,177,206,188,210],
  pageMiss: [1812,1798,1791,1802,1790,1794,1775,1823,1794,1812,1790]
};

const defaultMRU = {
  mix: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
  logicalRead: [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000],
  logicalWrite: [0,0,0,0,0,0,0,0,0,0,0],
  physicalRead: [1816,1799,1787,1778,1783,1799,1795,1790,1801,1779,1790],
  physicalWrite: [0,198,412,555,710,953,1119,1275,1466,1597,1770],
  pageHit: [184,201,213,222,217,201,205,210,199,221,210],
  pageMiss: [1816,1799,1787,1778,1783,1799,1795,1790,1801,1779,1790]
};

lruData = defaultLRU;
mruData = defaultMRU;

function plotPFComparison(metric){
  const ctx = document.getElementById('pfChart').getContext('2d');
  if(pfChart) pfChart.destroy();
  
  let lruValues, mruValues, yLabel;
  
  if(metric === 'physicalIO'){
    lruValues = lruData.physicalRead.map((r,i)=> r + lruData.physicalWrite[i]);
    mruValues = mruData.physicalRead.map((r,i)=> r + mruData.physicalWrite[i]);
    yLabel = 'Total Physical I/O (Read + Write)';
  } else {
    lruValues = lruData[metric];
    mruValues = mruData[metric];
    yLabel = metric.charAt(0).toUpperCase() + metric.slice(1);
  }
  
  pfChart = new Chart(ctx,{
    type:'line',
    data:{
      labels: lruData.mix,
      datasets:[
        {
          label:'LRU (Least Recently Used)',
          data: lruValues,
          borderColor:'#2563eb',
          backgroundColor:'rgba(37,99,235,0.1)',
          tension:0.3,
          borderWidth:2,
          pointRadius:4,
          pointHoverRadius:6
        },
        {
          label:'MRU (Most Recently Used)',
          data: mruValues,
          borderColor:'#f97316',
          backgroundColor:'rgba(249,115,22,0.1)',
          tension:0.3,
          borderWidth:2,
          pointRadius:4,
          pointHoverRadius:6
        }
      ]
    },
    options:{
      responsive:true,
      maintainAspectRatio:true,
      plugins:{
        legend:{display:true,position:'top'},
        title:{display:true,text:'Performance Comparison: LRU vs. MRU Buffer Replacement',font:{size:16}}
      },
      scales:{
        x:{title:{display:true,text:'Workload Mixture (Write Percentage)',font:{size:12}}},
        y:{title:{display:true,text:yLabel,font:{size:12}},beginAtZero:true}
      }
    }
  });
}

function parseCSVToData(text){
  const lines = text.trim().split(/\r?\n/).filter(l=>l.trim().length);
  if(lines.length < 2) return null;
  
  const header = lines[0].split(',').map(h=>h.trim());
  const data = {mix:[], logicalRead:[], logicalWrite:[], physicalRead:[], physicalWrite:[], pageHit:[], pageMiss:[]};
  
  lines.slice(1).forEach(line=>{
    const vals = line.split(',').map(v=>v.trim());
    const mixValue = (vals[0] || '').replace(/F/g,'');
    data.mix.push(mixValue || vals[0]);
    data.logicalRead.push(Number(vals[1])||0);
    data.logicalWrite.push(Number(vals[2])||0);
    data.physicalRead.push(Number(vals[3])||0);
    data.physicalWrite.push(Number(vals[4])||0);
    data.pageHit.push(Number(vals[5])||0);
    data.pageMiss.push(Number(vals[6])||0);
  });
  
  return data;
}

// Part 2: Slotted-Page Storage Utilization Chart
function plotSPData(){
  const labels = ['Variable', 'Fixed-64', 'Fixed-128', 'Fixed-256', 'Fixed-512'];
  const utilizationPct = [94.66, null, 78.66, 39.33, 19.67];
  const wastePct = [1.38, null, 21.34, 60.67, 80.33];

  const ctx = document.getElementById('spChart').getContext('2d');
  if(spChart) spChart.destroy();
  spChart = new Chart(ctx,{
    type:'bar',
    data:{
      labels:labels,
      datasets:[
        {label:'Utilization %', data:utilizationPct, backgroundColor:'rgba(139,111,71,0.7)', borderColor:'#8b6f47', borderWidth:1},
        {label:'Waste %', data:wastePct, backgroundColor:'rgba(122,107,93,0.7)', borderColor:'#7a6b5d', borderWidth:1}
      ]
    },
    options:{
      responsive:true,
      scales:{
        x:{title:{display:true,text:'Layout Type'}},
        y:{title:{display:true,text:'Percentage (%)'},beginAtZero:true}
      },
      plugins:{
        legend:{display:true,position:'top'}
      }
    }
  });
}

// Part 3: AM Index Build Comparison Chart
const amData = {
  modes: ['Post-build', 'Incremental', 'Bulk-sorted'],
  time: [0.0203, 0.0213, 0.0072],
  logicalRead: [64613, 64613, 1],
  logicalWrite: [1608, 1608, 436],
  physicalRead: [162, 307, 1],
  physicalWrite: [960, 1103, 219],
  hits: [64451, 64306, 0],
  miss: [162, 307, 1]
};

function plotAMComparison(metric) {
  const ctx = document.getElementById('amChart');
  if (!ctx) return;

  const metricLabels = {
    time: 'Build Time (seconds)',
    logicalRead: 'Logical Reads',
    logicalWrite: 'Logical Writes',
    physicalRead: 'Physical Reads',
    physicalWrite: 'Physical Writes',
    hits: 'Cache Hits',
    miss: 'Cache Misses'
  };

  const data = amData[metric];

  if (amChart) {
    amChart.destroy();
  }

  amChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: amData.modes,
      datasets: [{
        label: metricLabels[metric],
        data: data,
        backgroundColor: ['#8b6f47', '#c9a97a', '#6b5235'],
        borderColor: ['#6b5235', '#8b6f47', '#4a3a25'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: metricLabels[metric],
            font: { size: 14, weight: 'bold' }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Build Mode',
            font: { size: 14, weight: 'bold' }
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              let value = context.parsed.y;
              if (metric === 'time') {
                return value.toFixed(4) + ' seconds';
              }
              return value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

// Initialize SP chart on page load
window.addEventListener('DOMContentLoaded', ()=>{
  // Plot SP chart with a delay to ensure canvas is ready
  setTimeout(()=>{
    const spCanvas = document.getElementById('spChart');
    if(spCanvas) plotSPData();
  }, 500);
  
  // Plot initial PF comparison chart
  plotPFComparison('physicalIO');
  
  // Metric selector for PF chart
  document.getElementById('metricSelect')?.addEventListener('change', (e)=>{
    plotPFComparison(e.target.value);
  });
  
  // Plot initial AM comparison chart
  plotAMComparison('time');
  
  // Metric selector for AM chart
  document.getElementById('amMetricSelect')?.addEventListener('change', (e)=>{
    plotAMComparison(e.target.value);
  });
});
