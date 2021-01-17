import { addNodeToWallNodeArray, removeNodeToWallNodeArray } from '../NodeHelper';

it('should add wall nodes to wallNode array', () => {
    const wallNodes = [2, 3, 4];
    const nodeId = 5;
    const newWallNodes = addNodeToWallNodeArray(wallNodes, nodeId);
    console.log(newWallNodes)
    expect(newWallNodes.toString()).toEqual('2,3,4,5');
});

it('should remove wall nodes to wallNode array', () => {
    const wallNodes = [2, 3, 4];
    const nodeId = 4;
    const newWallNodes = removeNodeToWallNodeArray(wallNodes, nodeId);
    console.log(newWallNodes)
    expect(newWallNodes.toString()).toEqual('2,3');
});