export const  removeNodeToWallNodeArray = (wallNodes: Array<number> , nodeId: number) => {
    const newWallNodes = [...wallNodes];
    const willRemoveNodeIndex = newWallNodes.indexOf(nodeId);
    newWallNodes.splice(willRemoveNodeIndex, 1);

    return newWallNodes;
}

export const addNodeToWallNodeArray = (wallNodes: Array<number> , nodeId: number) => {
    const newWallNodes = [...wallNodes];
    newWallNodes.push(nodeId);

    return newWallNodes;
}