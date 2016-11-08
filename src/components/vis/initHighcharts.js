import ReactHighcharts from 'react-highcharts';
import highchartsMore from 'highcharts-more';
import highchartsExporting from 'highcharts-exporting';
import highchartsTreemap from 'highcharts-treemap';

let hasBeenInitialized = false;

// wrapper to make sure we only initialize the highcharts component once
function initHighcharts() {
  if (!hasBeenInitialized) {
    highchartsMore(ReactHighcharts.Highcharts);
    highchartsExporting(ReactHighcharts.Highcharts);
    highchartsTreemap(ReactHighcharts.Highcharts);
    hasBeenInitialized = true;
  }
}

export default initHighcharts;
