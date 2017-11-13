import * as d3 from 'd3';


export default function mapD3Top10Colors(idx) {
  if (idx <= -1) return 0;
  return d3.schemeCategory10[idx % 10];
}
