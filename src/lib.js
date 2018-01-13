//  @flow
import { observable } from 'mobx'

export type Point = {
  id: string,
  x: number,
  y: number,
  vectors: Array<Vector> // eslint-disable-line no-use-before-define
};

export type CreatePointType = {
  x: number,
  y: number
};

export type Vector = {
  id: string,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  points: Array<Point>,
  hightlighted: boolean
};

export class Dashboard {
  @observable
  activePoints: Array<Point> = []; // to create vector we need 2 points
  @observable
  points: Array<Point> = [];
  @observable
  vectors: Array<Vector> = [];
  viewportWidth: number = 200;
  viewportHeight: number = 200;
  scale: 1;

  constructor (initialPoints: Array<Point>) {
    initialPoints.forEach(v => this.createPoint(v))
  }

  createPoint = (arg: CreatePointType) => {
    let newPoint: Point = {
      id: Dashboard.generateId(),
      x: arg.x,
      y: arg.y,
      vectors: []
    }

    this.points.push(newPoint)
  };

  static generateId = (): string => {
    // https://gist.github.com/vko-online/76cc31b6e5cf834ad8ac
    return ('0000' +
      ((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4)
  };

  static createPointStatic = (arg: CreatePointType) => {
    let newPoint: Point = {
      id: Dashboard.generateId(),
      x: arg.x,
      y: arg.y,
      vectors: []
    }

    return newPoint
  };

  removePoint = (id: string) => {
    this.points = this.points.filter(v => v.id !== id)
  };

  addVector = (p1: Point, p2: Point) => {
    let newVector: Vector = {
      id: Dashboard.generateId(),
      startX: p1.x,
      startY: p1.y,
      endX: p2.x,
      endY: p2.y,
      hightlighted: false,
      points: [p1, p2]
    }

    p1.vectors.push(newVector)
    p2.vectors.push(newVector)
    this.vectors.push(newVector)
  };

  removeVector = (id: string) => {
    this.vectors = this.vectors.filter(v => v.id !== id)
  };

  activatePoint = (item: Point) => {
    if (this.activePoints.includes(item)) {
      this.activePoints = this.activePoints.filter(v => v.id !== item.id)
    } else {
      this.activePoints.push(item)
      if (this.activePoints.length === 2) {
        this.autoCreateVector()
      }
    }
  };

  autoCreateVector = () => {
    this.addVector(this.activePoints[0], this.activePoints[1])
    this.activePoints = []
  }
}

const initialPoints = [
  Dashboard.createPointStatic({ x: 10, y: 20 }),
  Dashboard.createPointStatic({ x: 50, y: 120 }),
  Dashboard.createPointStatic({ x: 150, y: 167 })
]

export const dashboardInstance = new Dashboard(initialPoints)
