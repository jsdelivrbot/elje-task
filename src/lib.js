//  @flow
import { action, observable } from 'mobx'
import { isEqual } from 'lodash'

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
  points: Array<Point>
};

export class Dashboard {
  @observable activePoints: Array<Point> = []; // to create vector we need 2 points
  @observable points: Array<Point> = [];
  @observable vectors: Array<Vector> = [];
  viewportWidth: number = 400;
  viewportHeight: number = 400;
  @observable scale: number = 1;

  constructor (initialPoints: Array<Point>) {
    initialPoints.forEach(v => this.createPoint(v))
  }

  @action calculateScale = () => {
    const maxDistantPoint = Math.max.apply(
      null,
      this.points.map(v => Math.max(v.x, v.y))
    )
    if (maxDistantPoint > this.viewportWidth * this.scale) {
      this.scale = this.viewportWidth / maxDistantPoint
    } else {
      this.scale = 1
    }
  };

  @action createPoint = (arg: CreatePointType) => {
    let newPoint: Point = {
      id: Dashboard.generateId(),
      x: arg.x,
      y: arg.y,
      vectors: []
    }

    this.points.push(newPoint)
    this.calculateScale()
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

  @action removePoint = (id: string) => {
    this.points = this.points.filter(v => v.id !== id)
    this.activePoints = this.activePoints.filter(v => v.id !== id)
    this.vectors = this.vectors.filter(
      v => !v.points.map(p => p.id).includes(id)
    )
    this.calculateScale()
  };

  @action addVector = (p1: Point, p2: Point) => {
    const alreadyHasVector = this.vectors.find(v => {
      const oldPoints = v.points.map(p => p.id).sort()
      const newPoints = [p1.id, p2.id].sort()
      return isEqual(oldPoints, newPoints)
    })
    if (alreadyHasVector) return

    let newVector: Vector = {
      id: Dashboard.generateId(),
      startX: p1.x,
      startY: p1.y,
      endX: p2.x,
      endY: p2.y,
      points: [p1, p2]
    }

    p1.vectors.push(newVector)
    p2.vectors.push(newVector)
    this.vectors.push(newVector)
  };

  @action removeVector = (id: string) => {
    this.vectors = this.vectors.filter(v => v.id !== id)
  };

  @action activatePoint = (item: Point) => {
    if (this.activePoints.includes(item)) {
      this.activePoints = this.activePoints.filter(v => v.id !== item.id)
    } else {
      this.activePoints.push(item)
      if (this.activePoints.length === 2) {
        this.autoCreateVector()
      }
    }
  };

  @action autoCreateVector = () => {
    this.addVector(this.activePoints[0], this.activePoints[1])
    this.activePoints = []
  };
}

const initialPoints = [
  Dashboard.createPointStatic({ x: 30, y: 300 }),
  Dashboard.createPointStatic({ x: 250, y: 120 }),
  Dashboard.createPointStatic({ x: 150, y: 167 })
]

export const dashboardInstance = new Dashboard(initialPoints)
