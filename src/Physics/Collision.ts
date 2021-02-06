import Circle from "../GameEntities/Circle";
import Entity from "../GameEntities/Entity";
import Rectangle from "../GameEntities/Rectangle";

export default interface Collision {
  bodyA: Entity | Rectangle | Circle,
  bodyB: Entity | Rectangle | Circle,
  callback: () => void,
}