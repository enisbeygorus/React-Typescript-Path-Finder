const MAX_VALUE = Infinity;

const selectMinVertex = (
  value: Array<number>,
  processed: Array<boolean>,
  graphLength: number
) => {
  let minimum = MAX_VALUE;
  let vertex: number = 0;
  for (let i = 0; i < graphLength; ++i) {
    if (processed[i] === false && value[i] < minimum) {
      vertex = i;
      minimum = value[i];
    }
  }
  return vertex;
};

export const DijkstraAlgorithm = (
  graph: Array<Array<number>>,
  startNodeId: number,
  finishNodeId: number
) => {
  const parent: Array<number> = [];
  const value: Array<number> = [];
  const processed: Array<boolean> = [];
  const processedOrderAll: Array<number> = [];

  for (let i = 0; i < graph.length; i++) {
    value.push(MAX_VALUE);
    processed.push(false);
  }

  parent[startNodeId] = -1;
  value[startNodeId] = 0;

  for (let i = 0; i < graph.length - 1; i++) {
    const u = selectMinVertex(value, processed, graph.length);
    processed[u] = true;
    processedOrderAll.push(u);

    for (let j = 0; j < graph.length; j++) {
      if (
        graph[u][j] !== 0 &&
        processed[j] === false &&
        value[u] !== MAX_VALUE &&
        value[u] + graph[u][j] < value[j]
      ) {
        value[j] = value[u] + graph[u][j];
        parent[j] = u;
      }
    }
  }

  processedOrderAll.shift();
  processedOrderAll.splice(processedOrderAll.indexOf(finishNodeId));

  let processedOrder = checkForDuplicates(processedOrderAll) ? Array.from(new Set(processedOrderAll)) : processedOrderAll;
  if(checkForDuplicates(processedOrderAll)){
    processedOrder = Array.from(new Set(processedOrderAll))
    if(processedOrder[processedOrder.length - 1] == 0){
        processedOrder.pop();
    }
  } else {
    processedOrder = processedOrderAll
  }

  return { parent, processedOrder };
};

function checkForDuplicates(array: Array<number>) {
    return new Set(array).size !== array.length
  }
